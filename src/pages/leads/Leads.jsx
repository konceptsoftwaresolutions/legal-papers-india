import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "../../components/fields/InputField";
import MyButton from "../../components/buttons/MyButton";
import LeadFilter from "./LeadFilter";
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
import { columns } from "./columns";
import DataTable from "react-data-table-component";
import Heading from "../../common/Heading";
import usePath from "../../hooks/usePath";
import { useNavigate } from "react-router-dom";
import AddLeadModal from "./AddLeadModal";
import {
  getProfileBasedUser,
  getUserExecutives,
} from "../../redux/features/user";
import Pagination from "../../components/pagination/Pagination";
import { getNotificationData } from "../../redux/features/notification";
import { Spinner } from "@material-tailwind/react";
import PasswordModal from "./PasswordModal";
import useAxios from "../../hooks/useAxios";

const Leads = () => {
  const dispatch = useDispatch();
  const path = usePath();
  const navigate = useNavigate();
  const axiosInstance = useAxios();

  const [filter, setFilter] = useState(false);
  const [filterObject, setFilterObject] = useState({});
  const [showQuotation, setShowQuotation] = useState(false);
  const [passModal, setPassModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const page = useMemo(() => {
    let pageNo = path.searchQuary?.[0]?.page;
    return pageNo && pageNo !== "" ? parseInt(pageNo) : 1;
  }, [path.location]);

  const filters = useMemo(() => {
    let filter = path.searchQuary?.[0]?.filter;
    return filter ? JSON.parse(filter) : null;
  }, [path.location]);

  useEffect(() => {
    dispatch(getAllLeads(page, filters ? true : false, filters));
  }, [dispatch, page, filter, filters]);

  useEffect(() => {
    dispatch(getAllSalesExecutive());
    dispatch(getProfileBasedUser());
    dispatch(getUserExecutives());
    dispatch(getNotificationData());
  }, []);

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
  const { countAllLead } = useSelector((state) => state.leads);
  const { userExecutives } = useSelector((state) => state.user);
  const { leadLoader } = useSelector((state) => state.leads);
  const [selectedRows, setSelecteRows] = useState(null);
  const [allCheckbox, setAllCheckBox] = useState(false);
  const [filteringParameters, setFilteringParameters] = useState({});

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

  const totalPages = countAllLead ? Math.ceil(countAllLead / 10) : 500;

  const openFilter = () => setIsFilterOpen(true);

  const handlePageChange = (page) => {
    // setCurrentPage(page);
    // dispatch(getAllLeads(page, filter, filterObject));
    if (filters) {
      path.changeEndPoint(
        `leads?page=${page}&filter=${JSON.stringify(filters)}`
      );
    } else {
      path.changeEndPoint(`leads?page=${page}`);
    }
  };

  const handleRowClick = (row) => {
    console.log(row);
    // const link = `/${role}/editLead`;
    // navigate(link, { state: { leadData: row } });
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
      // console.log("allLead", allLead);
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
    let formData = new FormData();

    // Add data key based on checkbox
    formData.append("data", allCheckbox ? "all" : "200");

    // Convert leadFilters to FormData
    if (filteringParameters && Object.keys(filteringParameters).length > 0) {
      Object.entries(filteringParameters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Convert arrays to JSON strings
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          // Append other values directly
          formData.append(key, value);
        }
      });
    }

    try {
      // Send the formData to the API
      const response = await axiosInstance.post(
        `/leadRoutes/export`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // responseType: "blob", // Expect a blob response for file download
        }
      );

      // console.log("=====> response is " , response)
      const data = response.data;
      console.log("response fetched is ", response);

      // Assuming the response data is an array of objects
      // const data = response.data;

      // Create a new workbook from the array of objects
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // Convert the workbook to a binary string and create a Blob
      const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelFile], { type: "application/octet-stream" });

      // Create a download link for the blob
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "leads_data.xlsx"; // Set the filename for the download
      link.click(); // Trigger the download

      // Clean up the URL object
      URL.revokeObjectURL(url);
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
        filterFor="Leads"
        endPoint="leads"
      />

      <div className="flex flex-col w-full px-4 gap-y-4 py-5">
        <div className="grid grid-cols-2">
          <Heading text="Leads" showHeading />
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
                className="main-bg py-2 text-[15px] font-medium px-4 "
                onClick={handleSalesAssign}
              >
                Assign
              </MyButton>
            </>
          )}

          {!(
            role === "salesTl" ||
            role === "salesExecutive" ||
            role === "operationsExecutive"
          ) && (
            <>
              <div className="w-[220px]">
                <InputField
                  control={control}
                  errors={errors}
                  type="option"
                  options={operationExecutiveOptions}
                  placeholder="Operations Executive Name"
                  name="executiveEmail"
                />
              </div>
              <MyButton
                className="main-bg py-2 text-[15px] font-medium px-4"
                onClick={handleExecutiveAssign}
              >
                Assign
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

          {!(role === "operationsTl" || role === "operationsExecutive") && (
            <>
              <MyButton
                title="Add Lead"
                placement="top"
                className="main-bg py-2.5 text-[15px] font-medium px-4"
                onClick={() => setShowQuotation(!showQuotation)}
              >
                <FaPlus size={18} />
              </MyButton>
            </>
          )}

          {!(
            role === "salesTl" ||
            role === "operationsTl" ||
            role === "salesExecutive" ||
            role === "operationsExecutive"
          ) && (
            <>
              <MyButton
                title="Export"
                placement="top"
                className="main-bg py-2.5 text-[15px] font-medium px-4"
                onClick={() => setPassModal(!passModal)}
              >
                <BiExport size={18} />
              </MyButton>
            </>
          )}
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
                  true, // pass fowardShow explicitly
                  role,
                  navigate // now in correct 5th position
                )}
                data={allLead ? allLead : []}
                noDataComponent={
                  <p className="text-center text-gray-500 text-lg p-3">
                    No data to be displayed...
                  </p>
                }
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
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </div>
      <AddLeadModal
        showQuotation={showQuotation}
        setShowQuotation={setShowQuotation}
      />
      <PasswordModal
        passModal={passModal}
        setPassModal={setPassModal}
        onSave={handleExport}
      />
    </>
  );
};

export default Leads;
