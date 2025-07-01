import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "../../components/fields/InputField";
import MyButton from "../../components/buttons/MyButton";
import LeadFilter from "../leads/LeadFilter";
import { LuListFilter } from "react-icons/lu";
import { BiExport } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import {
  getAllLeads,
  getAllSalesExecutive,
  handleBulkSalesAssign,
  handleImpLeadForward,
  handleLeadForward,
} from "../../redux/features/leads";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import { columns } from "../leads/columns";
import DataTable from "react-data-table-component";
import Heading from "../../common/Heading";
import usePath from "../../hooks/usePath";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getProfileBasedUser,
  getUserExecutives,
} from "../../redux/features/user";
import Pagination from "../../components/pagination/Pagination";
import { getNotificationData } from "../../redux/features/notification";
import { Spinner } from "@material-tailwind/react";
import useAxios from "../../hooks/useAxios";
import { getServiceCategoryStatusLeadsDataThreeMonthsThunkMiddleware } from "../../redux/features/bucket";
import { TiArrowForwardOutline } from "react-icons/ti";

const ThreeMonthsNCBucketSharing = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const path = usePath();
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const { serviceCategoryStatusLeadsDataThreeMonths } = useSelector(
    (state) => state.bucket
  );
  // console.log('serviceCategoryStatusLeadsDataThreeMonths', serviceCategoryStatusLeadsDataThreeMonths);

  const allLeads = useMemo(() => {
    return serviceCategoryStatusLeadsDataThreeMonths?.allLead;
  }, [serviceCategoryStatusLeadsDataThreeMonths]);

  const totalPages = useMemo(() => {
    // return serviceCategoryStatusLeadsDataThreeMonths?.countAllLead;
    const countAllLead =
      serviceCategoryStatusLeadsDataThreeMonths?.countAllLead;
    return countAllLead ? Math.ceil(countAllLead / 10) : 500;
  }, [serviceCategoryStatusLeadsDataThreeMonths]);

  const pageNumber = useMemo(() => {
    const query = path.searchQuary?.[0];
    return parseInt(query?.page) || 1;
  }, [path.location]);

  const [filter, setFilter] = useState(false);
  const [filterObject, setFilterObject] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filteringParameters, setFilteringParameters] = useState({});

  // useEffect(() => {
  //     dispatch(getAllLeads(currentPage, filter, filterObject));
  // }, [dispatch, currentPage, filter, filterObject]);

  // Create a URLSearchParams object from the query string
  const queryParams = new URLSearchParams(location.search);

  // Get the parameters
  const serviceCategoryParams = queryParams.get("serviceCategory"); // "gstReg"
  const statusParams = queryParams.get("status"); // "Checklist Shared"
  console.log(statusParams);

  const filters = useMemo(() => {
    let filter = path.searchQuary?.[0]?.filter;
    return filter ? JSON.parse(filter) : null;
  }, [path.location]);

  useEffect(() => {
    const query = path.searchQuary?.[0];
    let payload = {
      page: query?.page,
      serviceCategory: query?.serviceCategory,
      status: query?.status,
      filterObject: filters,
      filter: filters ? true : false,
    };
    dispatch(
      getServiceCategoryStatusLeadsDataThreeMonthsThunkMiddleware(payload)
    );
    dispatch(getAllSalesExecutive());
    dispatch(getProfileBasedUser());
    dispatch(getUserExecutives());
    dispatch(getNotificationData());
  }, [path.location]);

  const {
    control,
    formState: { errors },
    watch,
  } = useForm();

  // state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const { allLead } = useSelector((state) => state.leads);
  const { role } = useSelector((state) => state.auth);
  // const { countAllLead } = useSelector((state) => state.leads);
  const { userExecutives } = useSelector((state) => state.user);
  const { leadLoader } = useSelector((state) => state.leads);
  const [selectedRows, setSelecteRows] = useState(null);
  const [allCheckbox, setAllCheckBox] = useState(false);

  // const totalPages = countAllLead ? Math.ceil(countAllLead / 10) : 500;

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    // Check if the 'filter' param exists
    const hasFilter = searchParams.has("filter");
    if (hasFilter) {
      setIsFilterActive(true);
    } else {
      setIsFilterActive(false);
    }
  }, [window.location.search]);

  const openFilter = () => setIsFilterOpen(true);

  const handlePageChange = (page) => {
    const query = path.searchQuary?.[0];
    let payload = {
      serviceCategory: query?.serviceCategory,
      status: query?.status,
    };
    // setCurrentPage(page);
    path.changeEndPoint(
      `nc-bucket-share-by-selecting-3-months?page=${page}&serviceCategory=${payload?.serviceCategory}&status=${payload?.status}`
    );
  };

  const handleRowClick = (row) => {
    const link = `/${role}/editLead`;
    navigate(link, { state: { leadData: row } });
  };

  const onFilterSubmit = (page, filter, filterObject) => {
    setCurrentPage(page);
    setFilter(filter);
    setFilterObject(filterObject);
  };

  const salesExecutiveOptions = userExecutives?.salesExecutives?.map(
    (executive, index) => {
      return {
        label: executive.name,
        value: executive.email,
      };
    }
  );

  const operationExecutiveOptions = userExecutives?.operationsExecutives?.map(
    (executive, index) => {
      return {
        label: executive.name,
        value: executive.email,
      };
    }
  );

  const handleChange = (row) => {
    console.log(row.selectedRows);
    setSelecteRows(row.selectedRows);
    if (allLead?.length > 0) {
      console.log("allLead", allLead);
      const allRowsSelected = row?.selectedRows?.length === allLead?.length;
      if (allRowsSelected) {
        setAllCheckBox(true);
      } else {
        setAllCheckBox(false);
      }
    }
  };

  const handleSalesAssign = () => {
    const selectedUser = watch("userEmail");
    const payload = {
      userEmail: selectedUser,
      selectedRows: selectedRows,
    };
    console.log(payload);
    dispatch(handleBulkSalesAssign(payload));
  };

  const handleExecutiveAssign = () => {
    const selectedUser = watch("executiveEmail");
    const payload = {
      userEmail: selectedUser,
      selectedRows: selectedRows,
    };
    console.log(payload);
    dispatch(handleBulkSalesAssign(payload));
  };

  const handleForward = (data) => {
    dispatch(handleLeadForward(data.leadId));
  };

  const handleImpForward = (data) => {
    dispatch(handleImpLeadForward(data.leadId));
  };

  const handleExport = async (passw) => {
    // Make sure to convert any keys with null values to empty strings
    if (filterObject && Object.keys(filterObject).length > 0) {
      Object.keys(filterObject).forEach((key) => {
        if (filterObject[key] === null) {
          filterObject[key] = ""; // Set null values to empty string
        }
      });
    }

    // console.log("with password", passw);
    let query = "data=200";
    if (allCheckbox) {
      query = "data=all";
    } else {
      query = "data=200";
    }

    if (filterObject && Object.keys(filterObject).length > 0) {
      const filterQuery = new URLSearchParams(filterObject).toString();
      if (allCheckbox) {
        query = `data=filterAll&${filterQuery}`;
      } else {
        query = `data=filter200&${filterQuery}`;
      }
    }
    // query += `&${passw}`;

    try {
      const response = await axiosInstance.post(`/leadRoutes/export?${query}`, {
        responseType: "blob",
      });
      // Convert the data to an XLSX file

      const workbook = XLSX.utils.book_new();
      console.log(response);
      const worksheet = XLSX.utils.json_to_sheet(response.data);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads Data");
      const xlsxData = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // Create a Blob from the XLSX data

      const blob = new Blob([xlsxData], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      console.log("url is ", url);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leads_data.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error exporting data", error);
    }
  };

  return (
    <>
      <LeadFilter
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
        onFilterSubmit={onFilterSubmit}
        // setIsFilterActive={setIsFilterActive}
        setFilteringParameters={setFilteringParameters}
        filterFor="nc-bucket-share-by-selecting"
        endPoint="nc-bucket-share-by-selecting"
        serviceCategory={serviceCategoryParams}
        status={statusParams}
      />

      <div className="flex flex-col w-full px-4 gap-y-4 py-5">
        <div className="grid grid-cols-2">
          <Heading text="NC Bucket Share by Selecting" showHeading />
        </div>
        <div className="w-full flex justify-end items-start gap-2 flex-wrap">
          {!(
            role === "operationsTl" ||
            role === "salesExecutive" ||
            role === "operationsExecutive"
          ) && (
            <>
              <div className="w-[220px]">
                <InputField
                  control={control}
                  errors={errors}
                  type="option"
                  options={salesExecutiveOptions}
                  placeholder="Sales Executive Name"
                  name="userEmail"
                />
              </div>
              <MyButton
                className="main-bg py-2 text-[15px] font-medium px-4 flex justify-center items-center gap-x-2"
                onClick={handleSalesAssign}
              >
                Share <TiArrowForwardOutline size={16} />
              </MyButton>
            </>
          )}

          <MyButton
            className="main-bg py-2 flex justify-center items-center text-[15px] font-medium px-4 gap-x-1"
            onClick={openFilter}
          >
            <LuListFilter size={16} />
            <span>Filter</span>
          </MyButton>
        </div>

        <div className="w-full">
          {isFilterActive && (
            <div className="flex justify-center mb-4">
              <p className="main-bg py-2 px-3 text-white rounded-md">
                You are viewing the filtered data...
              </p>
            </div>
          )}
          {!leadLoader ? (
            <>
              {" "}
              <DataTable
                columns={columns(
                  handleForward,
                  handleImpForward,
                  false,
                  role,
                  navigate
                )}
                data={allLeads ? allLeads : []}
                noDataComponent="No data to be displayed..."
                customStyles={tableCustomStyles}
                // onRowClicked={handleRowClick}
                selectableRows
                onSelectedRowsChange={handleChange}
                // pagination={Pagination}
              />
            </>
          ) : (
            <div className="h-[90vh] w-full flex justify-center items-center gap-2">
              <p className="md:text-lg flex gap-2">
                <Spinner /> Loading ...
              </p>
            </div>
          )}
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={pageNumber}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default ThreeMonthsNCBucketSharing;
