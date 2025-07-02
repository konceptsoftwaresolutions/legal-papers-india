import React, { useEffect, useMemo, useState } from "react";
import LeadFilter from "../leads/LeadFilter";
import Heading from "../../common/Heading";
import MyButton from "../../components/buttons/MyButton";
import { LuListFilter } from "react-icons/lu";
import { BiExport } from "react-icons/bi";
import { Spinner } from "@material-tailwind/react";
import DataTable from "react-data-table-component";
import { columns } from "./columns";
import Pagination from "../../components/pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import usePath from "../../hooks/usePath";
import { useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import {
  getAllLeads,
  getAllRenewals,
  getAllSalesExecutive,
  handleImpLeadForward,
  handleLeadForward,
  handleManualIECLeadForward,
  removeRenewalLead,
} from "../../redux/features/leads";
import {
  getProfileBasedUser,
  getUserExecutives,
} from "../../redux/features/user";
import { getNotificationData } from "../../redux/features/notification";
import { useForm } from "react-hook-form";
import InputField from "../../components/fields/InputField";
import { FaPlus } from "react-icons/fa6";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import AddLeadModal from "../leads/AddLeadModal";
import PasswordModal from "../leads/PasswordModal";
import { TiArrowForwardOutline } from "react-icons/ti";
import Swal from "sweetalert2";

const Renewal = () => {
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
    dispatch(getAllRenewals(page, filters ? true : false, filters));
  }, [dispatch, page, filter, filters]);

  useEffect(() => {
    dispatch(getAllSalesExecutive());
    dispatch(getProfileBasedUser());
    dispatch(getUserExecutives());
    dispatch(getNotificationData());
    // dispatch(getAllRenewals());
  }, []);

  const {
    control,
    formState: { errors },
    watch,
  } = useForm();

  // state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const { allLead, countAllLead } = useSelector(
    (state) => state.leads.renewalLeads || {}
  );

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

  const { role } = useSelector((state) => state.auth);
  // const { countAllLead } = useSelector((state) => state.leads);
  const { userExecutives } = useSelector((state) => state.user);
  const { leadLoader } = useSelector((state) => state.leads);
  const [selectedRows, setSelecteRows] = useState(null);
  const [allCheckbox, setAllCheckBox] = useState(false);
  const [filteringParameters, setFilteringParameters] = useState({});

  // const totalPages =
  //   isNaN(renewalLeads) || !renewalLeads ? null : Math.ceil(renewalLeads / 10);

  const totalPages = Math.ceil(countAllLead / 10);

  const openFilter = () => setIsFilterOpen(true);

  const handlePageChange = (page) => {
    // setCurrentPage(page);
    // dispatch(getAllLeads(page, filter, filterObject));
    if (filters) {
      path.changeEndPoint(
        `renewal?page=${page}&filter=${JSON.stringify(filters)}`
      );
    } else {
      path.changeEndPoint(`renewal?page=${page}`);
    }
  };

  const handleRowClick = (row) => {
    const link = `/${role}/editlead`;
    navigate(link, { state: { leadData: row, isScroll: true } });
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

  console.log("=====>", filteringParameters);

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

  const handleRemoval = (data) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to remove this renewal?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          removeRenewalLead(data, page, filters ? true : false, filters)
        );
        // Swal.fire("Removed!", "The renewal has been removed.", "success");
      }
    });
  };

  const [selectedExecutives, setSelectedExecutives] = useState({});

  const handleExecutiveChange = (leadId, value) => {
    setSelectedExecutives((prev) => ({
      ...prev,
      [leadId]: value,
    }));
  };

  console.log(selectedExecutives);

  const handleManuaIECForward = (data) => {
    console.log(data);
    const user = selectedExecutives[data.leadId];
    console.log(user);
    dispatch(handleManualIECLeadForward(data.leadId));
  };

  const columns = [
    {
      name: "Lead ID",
      cell: (row) => (
        <div
          onClick={(e) => {
            console.log("clicked", e);
            e.stopPropagation();
            if (e.ctrlKey) {
              const url = `/${role}/editlead?leadId=${row.leadId}`;
              window.open(url, "_blank");
            } else {
              const link = `/${role}/editLead`;
              navigate(link, { state: { leadData: row } });
            }
          }}
          style={{
            // paddingLeft: "16px",
            cursor: "pointer",
          }}
        >
          {row.leadId}
        </div>
      ),
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "130px",
    },
    {
      name: "Date",
      selector: (row) => row.date,
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "170px",
    },
    {
      name: "Date",
      selector: (row) => row.lastPaymentDate,
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "170px",
    },
    {
      name: "Name",
      selector: (row) => row.formData?.nameOfBusinessEntity || "N/A",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "250px",
    },
    {
      name: "Mobile Number",
      selector: (row) => row.formData?.mobileNumber || "N/A",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "150px",
    },
    {
      name: "Email ID",
      selector: (row) => row.formData?.emailId || "N/A",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "200px",
    },
    {
      name: "Service Category",
      selector: (row) => row.formData?.serviceCategory || "N/A",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "170px",
    },
    {
      name: "Sales Status",
      selector: (row) => row.status || "N/A",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "150px",
    },
    {
      name: "Operation Status",
      selector: (row) => row.operationStatus || "N/A",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "180px",
    },
    {
      name: "Total Payments",
      selector: (row) => row.totalPayments || "0",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "150px",
    },
    // ...(fowardShow
    //   ? [
    //       {
    //         name: "Forward",
    //         cell: (row) => (
    //           <button
    //             onClick={() => handleForward(row)}
    //             className={row.status === "Converted" ? "" : "opacity-20"}
    //             style={{
    //               background: "#198754",
    //               color: "#fff",
    //               border: "none",
    //               padding: "10px 10px",
    //               fontSize: "14px",
    //               borderRadius: "4px",
    //               cursor: "pointer",
    //             }}
    //             disabled={row.status === "Converted" ? false : true}
    //           >
    //             <TiArrowForwardOutline />
    //           </button>
    //         ),
    //         wrap: true,
    //         style: { textAlign: "left", paddingLeft: "16px" },
    //         width: "100px",
    //       },
    //       {
    //         name: "Important Forward",
    //         cell: (row) => (
    //           <button
    //             onClick={() => handleImpForward(row)}
    //             className={row.status === "Converted" ? "" : "opacity-20"}
    //             style={{
    //               background: "#dc3545",
    //               color: "#fff",
    //               border: "none",
    //               padding: "10px 10px",
    //               fontSize: "14px",
    //               borderRadius: "4px",
    //               cursor: "pointer",
    //             }}
    //             disabled={row.status === "Converted" ? false : true}
    //           >
    //             <TiArrowForwardOutline />
    //           </button>
    //         ),
    //         wrap: true,
    //         style: { textAlign: "left", paddingLeft: "16px" },
    //         width: "190px",
    //       },
    //     ]
    //   : []),
    {
      name: "SalesExecutive",
      cell: (row) => {
        const leadId = row.leadId;
        const selectedValue = selectedExecutives[leadId] || "";

        return (
          <InputField
            control={control}
            errors={errors}
            type="option"
            options={salesExecutiveOptions}
            placeholder="Sales Executive Name"
            name={`userEmail-${leadId}`} // unique name for each row
            value={selectedValue}
            onSelectChange={(value) => handleExecutiveChange(leadId, value)}
          />
        );
      },
      width: "200px",
    },

    {
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => handleRemoval(row.leadId)}
          style={{
            background: "#dc3545",
            color: "#fff",
            border: "none",
            padding: "10px 10px",
            fontSize: "14px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Remove from Renewal Page
        </button>
      ),
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "300px",
    },
    ...(["salesTl", "salesExecutive", "superAdmin"].includes(role)
      ? [
          {
            name: "Forward Manual IEC",
            cell: (row) => (
              <button
                onClick={() => handleManuaIECForward(row)}
                style={{
                  background: "#fd7d33",
                  color: "#fff",
                  border: "none",
                  padding: "10px 10px",
                  fontSize: "14px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                <TiArrowForwardOutline />
              </button>
            ),
            wrap: true,
            style: { textAlign: "left", paddingLeft: "16px" },
            width: "250px",
          },
        ]
      : []),
  ];

  return (
    <>
      <LeadFilter
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
        onFilterSubmit={onFilterSubmit}
        // setIsFilterActive={setIsFilterActive}
        setFilteringParameters={setFilteringParameters}
        filterFor="renewal"
        endPoint="renewal"
      />

      <div className="flex flex-col w-full px-4 gap-y-4 py-5">
        <div className="grid grid-cols-2">
          <Heading text="Renewal" showHeading />
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
            a
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
                columns={columns}
                data={allLead ? allLead : []}
                // data={ []}
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

export default Renewal;
