import React, { useEffect, useMemo, useState } from "react";

// table
import ReactTable from "../../components/tables/ReactTable";
import { useForm } from "react-hook-form";

// components
import InputField from "../../components/fields/InputField";
import MyButton from "../../components/buttons/MyButton";
import * as XLSX from "xlsx";

// icons
import { LuListFilter } from "react-icons/lu";
import { BiExport } from "react-icons/bi";
import LeadFilter from "../leads/LeadFilter";
import { useDispatch, useSelector } from "react-redux";
import { getOperationsFollowUpLead } from "../../redux/features/followups";
import DataTable from "react-data-table-component";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import Heading from "../../common/Heading";
import { getNotificationData } from "../../redux/features/notification";
import { useNavigate } from "react-router-dom";
import { columns } from "./columns";
import Pagination from "../../components/pagination/Pagination";
import { Spinner } from "@material-tailwind/react";
import {
  handleImpLeadForward,
  handleLeadForward,
} from "../../redux/features/leads";
import useAxios from "../../hooks/useAxios";
import usePath from "../../hooks/usePath";

const FollowUps = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const path = usePath();

  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState(false);
  const [filterObject, setFilterObject] = useState({});

  const page = useMemo(() => {
    let pageNo = path.searchQuary?.[0]?.page;
    return pageNo && pageNo !== "" ? parseInt(pageNo) : 1;
  }, [path.location]);

  const filters = useMemo(() => {
    let filter = path.searchQuary?.[0]?.filter;
    return filter ? JSON.parse(filter) : null;
  }, [path.location]);

  useEffect(() => {
    dispatch(getOperationsFollowUpLead(page, filters ? true : false, filters));
  }, [dispatch, page, filter, filters]);

  useEffect(() => {
    dispatch(getNotificationData());
  }, [dispatch]);

  const { followUpData, followUpLoader } = useSelector(
    (state) => state.followUps
  );
  const { role } = useSelector((state) => state.auth);

  const totalLeadCount = followUpData?.countAllLead;

  const totalPages = totalLeadCount ? Math.ceil(totalLeadCount / 10) : 1000;

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();

  // state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [allCheckbox, setAllCheckBox] = useState(false);
  const [selectedRows, setSelecteRows] = useState(null);
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

  // functions
  const openFilter = () => setIsFilterOpen(true);
  const onFilterSubmit = (page, filter, filterObject) => {
    setCurrentPage(page);
    setFilter(filter);
    setFilterObject(filterObject);
  };

  const handleRowClick = (row) => {
    const link = `/${role}/editLead`;
    navigate(link, { state: { leadData: row } });
  };

  const handlePageChange = (page) => {
    // path.changeEndPoint(`follow-ups?page=${page}`);
    // setCurrentPage(page);
    if (filters) {
      path.changeEndPoint(
        `follow-ups?page=${page}&filter=${JSON.stringify(filters)}`
      );
    } else {
      path.changeEndPoint(`follow-ups?page=${page}`);
    }
  };

  const handleForward = (data) => {
    dispatch(handleLeadForward(data.leadId));
  };

  const handleImpForward = (data) => {
    dispatch(handleImpLeadForward(data.leadId));
  };

  const handleChange = (row) => {
    console.log(row.selectedRows);
    setSelecteRows(row.selectedRows);
    if (followUpData?.allLead?.length > 0) {
      console.log("followUpData?.allLead", followUpData?.allLead);
      const allRowsSelected =
        row?.selectedRows?.length === followUpData?.allLead?.length;
      if (allRowsSelected) {
        setAllCheckBox(true);
      } else {
        setAllCheckBox(false);
      }
    }
  };

  const handleExport = async (passw) => {
    let formData = new FormData();

    // Add data key based on checkbox
    formData.append("data", allCheckbox ? "all" : "200");

    // Convert leadFilters to FormData
    console.log("filtering param", filteringParameters);
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
        filterFor="FollowUp"
        endPoint="follow-ups"
      />

      <div className="flex flex-col w-full px-4 gap-y-4 py-5">
        <Heading text="Follow Ups" showHeading />
        <div className="w-full flex justify-end items-start gap-x-2">
          <MyButton
            className="main-bg py-2 flex justify-center items-center text-[15px] font-medium px-4 gap-x-1"
            onClick={openFilter}
          >
            <LuListFilter size={16} />
            <span>Filter</span>
          </MyButton>

          {!(role === "operationsTl") && (
            <MyButton
              className="main-bg py-2 flex justify-center items-center text-[15px] font-medium px-4 gap-x-1"
              onClick={() => handleExport()}
            >
              <BiExport size={18} className="rotate-90" />
              <span>Export</span>
            </MyButton>
          )}
        </div>

        <div className="w-full">
          {/* <ReactTable Columns={columns} data={data} totalPages={10} /> */}

          {isFilterActive && (
            <div className="flex justify-center mb-4">
              <p className="main-bg py-2 px-3 text-white rounded-md">
                You are viewing the filtered data...
              </p>
            </div>
          )}

          {followUpLoader ? (
            <div className="h-[90vh] w-full flex justify-center items-center gap-2">
              <p className="md:text-lg flex gap-2">
                <Spinner /> Loading ...
              </p>
            </div>
          ) : (
            <>
              <DataTable
                columns={columns(
                  handleForward,
                  handleImpForward,
                  role,
                  navigate
                )}
                data={followUpData?.allLead ? followUpData?.allLead : []}
                customStyles={tableCustomStyles}
                noDataComponent={
                  <div className="py-7">There are no records to display...</div>
                }
                selectableRows
                // onRowClicked={handleRowClick}
                onSelectedRowsChange={handleChange}
              />
            </>
          )}
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default FollowUps;
