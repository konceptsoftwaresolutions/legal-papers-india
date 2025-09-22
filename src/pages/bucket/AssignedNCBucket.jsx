import React, { useEffect, useMemo, useState } from "react";
import ReactTable from "../../components/tables/ReactTable";
import BackButton from "../../components/buttons/BackButton";
import MyButton from "../../components/buttons/MyButton";
import { LuListFilter } from "react-icons/lu";
import LeadFilter from "../leads/LeadFilter";
import Heading from "../../common/Heading";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { columns } from "../leads/columns";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import Pagination from "../../components/pagination/Pagination";
import {
  getAssignedNCBucketLeadsData,
  handleBulkSalesAssign,
  handleImpLeadForward,
  handleLeadForward,
} from "../../redux/features/leads";
import { useNavigate } from "react-router-dom";
import { getNotificationData } from "../../redux/features/notification";
import { Spinner } from "@material-tailwind/react";
import usePath from "../../hooks/usePath";
import InputField from "../../components/fields/InputField";
import { useForm } from "react-hook-form";
import { BiExport } from "react-icons/bi";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import useAxios from "../../hooks/useAxios";
import AssignedNCBucketPasswordModal from "./AssignedNCBucketPasswordModal";

const AssignedNCBucket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const path = usePath();

  const {
    control,
    formState: { errors },
    watch,
  } = useForm();

  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState(false);
  const [filterObject, setFilterObject] = useState({});
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [filteringParameters, setFilteringParameters] = useState({});

  const axiosInstance = useAxios();
  const [passModal, setPassModal] = useState(false);
  const [allCheckbox, setAllCheckBox] = useState(false);

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

  // useEffect(() => {
  //   dispatch(getNotificationData());
  // }, [dispatch]);

  const page = useMemo(() => {
    let pageNo = path.searchQuary?.[0]?.page;
    return pageNo && pageNo !== "" ? parseInt(pageNo) : 1;
  }, [path.location]);

  const filters = useMemo(() => {
    let filter = path.searchQuary?.[0]?.filter;
    return filter ? JSON.parse(filter) : null;
  }, [path.location]);

  useEffect(() => {
    dispatch(
      getAssignedNCBucketLeadsData(page, filters ? true : false, filters)
    );
  }, [dispatch, page, filter, filters]);

  const { assignedNCBucketLeads, assignedNCLoader } = useSelector(
    (state) => state.leads
  );
  const { userExecutives } = useSelector((state) => state.user);
  const { role } = useSelector((state) => state.auth);

  // state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRows, setSelecteRows] = useState(null);

  // functions
  const openFilter = () => setIsFilterOpen(true);

  const onFilterSubmit = (page, filter, filterObject) => {
    console.log(page);
    setCurrentPage(page);
    setFilter(filter);
    setFilterObject(filterObject);
  };

  const handleRowClick = (row) => {
    const link = `/${role}/editLead`;
    navigate(link, { state: { leadData: row } });
  };

  // const handlePageChange = (page) => {
  //   path.changeEndPoint(`assigned-nc-bucket?page=${page}`);
  //   // setCurrentPage(page);
  //   // You can add additional logic here to fetch new data based on the page change
  //   // console.log("Page changed to:", page);
  // };

  const handlePageChange = (page) => {
    // setCurrentPage(page);
    // dispatch(getAllLeads(page, filter, filterObject));
    if (filters) {
      path.changeEndPoint(
        `assigned-nc-bucket?page=${page}&filter=${JSON.stringify(filters)}`
      );
    } else {
      path.changeEndPoint(`assigned-nc-bucket?page=${page}`);
    }
  };

  const handleForward = (data) => {
    dispatch(handleLeadForward(data.leadId));
  };

  const handleImpForward = (data) => {
    dispatch(handleImpLeadForward(data.leadId));
  };

  const salesExecutiveOptions = userExecutives?.salesExecutives?.map(
    (executive, index) => {
      return {
        label: executive.name,
        value: executive.email,
      };
    }
  );

  const handleSalesAssign = () => {
    const selectedUser = watch("userEmail");
    const payload = {
      userEmail: {
        value: selectedUser,
      },
      selectedRows: selectedRows,
    };
    dispatch(handleBulkSalesAssign(payload));
  };

  // const handleChange = (row) => {
  //   console.log(row.selectedRows);
  //   setSelecteRows(row.selectedRows);
  // };

  const handleChange = (row) => {
    console.log(row.selectedRows);
    setSelecteRows(row.selectedRows);

    // Check if all rows are selected for export
    if (assignedNCBucketLeads?.allLead?.length > 0) {
      const allRowsSelected =
        row?.selectedRows?.length === assignedNCBucketLeads?.allLead?.length;
      setAllCheckBox(allRowsSelected);
    }
  };

  // Add this export handler function
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
      // Send the formData to the API - Update endpoint for NC Bucket
      const response = await axiosInstance.post(
        `/leadRoutes/export-nc-bucketjgh`, // Updated endpoint for NC Bucket
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;
      console.log("response fetched is ", response);

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
      link.download = "assigned_nc_bucket_leads.xlsx"; // Updated filename
      link.click(); // Trigger the download

      // Clean up the URL object
      URL.revokeObjectURL(url);

      toast.success("Export completed successfully!");
    } catch (error) {
      console.error("Error exporting data", error);
      toast.error("Export failed. Please try again.");
    }
  };

  return (
    <>
      <LeadFilter
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
        filterFor="AssignedNC"
        onFilterSubmit={onFilterSubmit}
        endPoint="assigned-nc-bucket"
        // setIsFilterActive={setIsFilterActive}
        setFilteringParameters={setFilteringParameters}
      />

      <div className="p-3">
        <div className="flex justify-between main-text items-center">
          <div className="flex justify-center items-center gap-x-3">
            {/* <BackButton />
                    <h2 className="font-medium">Assigned NC Bucket Leads</h2> */}
            <Heading text="Assigned NC Bucket Leads" showHeading />
          </div>
          <div className="flex gap-2">
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
            <MyButton
              className="main-bg py-2 flex justify-center items-center text-[15px] font-medium px-4 gap-x-1"
              onClick={openFilter}
            >
              <LuListFilter size={16} />
              <span>Filter</span>
            </MyButton>

            {!(
              role === "salesTl" ||
              role === "operationsTl" ||
              role === "salesExecutive" ||
              role === "operationsExecutive"
            ) && (
              <MyButton
                title="Export"
                placement="top"
                className="main-bg py-2.5 text-[15px] font-medium px-4"
                onClick={() => setPassModal(!passModal)}
              >
                <BiExport size={18} />
              </MyButton>
            )}
          </div>
        </div>
        <div className="w-full py-4">
          {isFilterActive && (
            <div className="flex justify-center mb-4">
              <p className="main-bg py-2 px-3 text-white rounded-md">
                You are viewing the filtered data...
              </p>
            </div>
          )}

          <div className="w-full flex justify-end mb-3 gap-1"></div>

          {assignedNCLoader ? (
            <>
              <div className="h-[90vh] w-full flex justify-center items-center gap-2">
                <p className="md:text-lg flex gap-2">
                  <Spinner /> Loading ...
                </p>
              </div>
            </>
          ) : (
            <>
              <DataTable
                columns={columns(
                  handleForward,
                  handleImpForward,
                  true,
                  role,
                  navigate
                )}
                data={
                  assignedNCBucketLeads ? assignedNCBucketLeads.allLead : []
                }
                noDataComponent="No Records To Display..."
                customStyles={tableCustomStyles}
                // onRowClicked={handleRowClick}
                selectableRows
                onSelectedRowsChange={handleChange}
                // pagination={Pagination}
              />
            </>
          )}
        </div>
        <Pagination
          totalPages={
            assignedNCBucketLeads
              ? Math.ceil(assignedNCBucketLeads.countAllLead / 10)
              : ""
          }
          currentPage={page}
          onPageChange={handlePageChange}
        />
        <AssignedNCBucketPasswordModal
          passModal={passModal}
          setPassModal={setPassModal}
          onSave={handleExport}
        />
      </div>
    </>
  );
};

export default AssignedNCBucket;
