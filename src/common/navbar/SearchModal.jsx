import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Button,
  Spinner,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { IoIosCloseCircle } from "react-icons/io";
import InputField from "../../components/fields/InputField";
import { useDispatch, useSelector } from "react-redux";
import {
  fireMasterSearch,
  setMasterSearch,
} from "../../redux/features/masterSearch";
import DataTable from "react-data-table-component";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import { TiArrowForwardOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { getUserExecutives } from "../../redux/features/user";
import { assignLeadBySearchNCBucket } from "../../redux/features/bucket";
import toast from "react-hot-toast";

const columns = (
  handleDropdownChange,
  salesExecutiveOptions,
  handleLeadShare,
  sectionAfterRole,
  role,
  handleRowClick
) => {
  const baseColumns = [
    {
      name: "Lead Date",
      selector: (row) => row.date,
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "130px",
    },
    // {
    //   name: "Lead ID",
    //   selector: (row) => row.leadId,
    //   wrap: true,
    //   style: { textAlign: "left", paddingLeft: "16px" },
    //   width: "130px",
    // },
    {
      name: "Lead ID",
      cell: (row) => (
        <div
          onClick={() => handleRowClick(row)}
          style={{
            // paddingLeft: "16px",
            cursor: "pointer",
          }}
        >
          {row.leadId}
        </div>
      ),
      wrap: true,
      style: { textAlign: "left" },
      width: "130px",
    },
    {
      name: "Name",
      selector: (row) => row.formData?.nameOfBusinessEntity || "-",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "240px",
    },
    {
      name: "Mobile Number",
      selector: (row) => row.formData?.mobileNumber || "-",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "150px",
    },
    {
      name: "Email ID",
      selector: (row) => row.formData?.emailId || "-",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "200px",
    },
    {
      name: "Validity",
      selector: (row) => row.formData.validity || "-",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "100px",
    },
    {
      name: "Service Category",
      selector: (row) => row.formData?.serviceCategory || "-",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "170px",
    },
    {
      name: "Service Executive Name",
      selector: (row) => row?.salesExecutiveName || "-",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "220px",
    },
    {
      name: "Operations Executive Name",
      selector: (row) => row?.operationExecutiveName || "-",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "260px",
    },
    {
      name: "Sales Status",
      selector: (row) => row.status || "-",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "150px",
    },
    {
      name: "Operation Status",
      selector: (row) => row.operationStatus || "-",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "180px",
    },

    {
      name: "IEC Manual Lead",
      selector: (row) =>
        row.formData.iecManualLead === true ? "True" : "False" || "-",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "180px",
    },
  ];

  if (sectionAfterRole !== "leads" && sectionAfterRole !== "renewal") {
    // Add dropdown and share button columns only if sectionAfterRole is not "leads"
    if (
      role === "superAdmin" ||
      role === "salesTl" ||
      role === "operationsTl"
    ) {
      baseColumns.push(
        {
          name: "Sales Executive Name",
          cell: (row) => (
            <select
              onChange={(e) => handleDropdownChange(row, e.target.value)} // Pass the row and selected value
              className="form-select"
              style={{ width: "150px" }}
              id={`sales-executive-${row.leadId}`}
            >
              <option value="">Select an Option</option>
              {salesExecutiveOptions?.map((option) => (
                <option key={option.label} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
          ),
          style: { textAlign: "left", paddingLeft: "16px" },
        },
        {
          name: "Forward",
          cell: (row) => (
            <button
              onClick={() => {
                const selectedSalesExec = document.getElementById(
                  `sales-executive-${row.leadId}`
                ).value;
                handleLeadShare(row, selectedSalesExec); // Pass row and selectedSalesExec
              }}
              style={{
                background: "#198754",
                color: "#fff",
                border: "none",
                padding: "10px 10px",
                fontSize: "14px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "2px",
              }}
            >
              Share <TiArrowForwardOutline />
            </button>
          ),
          wrap: true,
          style: { textAlign: "left", paddingLeft: "16px" },
          width: "120px",
        }
      );
    }
  }

  return baseColumns;
};
const SearchModal = ({ showQuotation, setShowQuotation }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);
  const { masterSearchLeads, masterLoader } = useSelector(
    (state) => state.master
  );
  const { userExecutives, userData } = useSelector((state) => state.user);
  const [selectedSalesExec, setSelectedSalesExec] = useState(null);

  useEffect(() => {
    if (showQuotation === true) {
      console.log("asdlfjdsa");
      dispatch(getUserExecutives());
    }
  }, [dispatch, showQuotation]);

  // console.log(showQuotation);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const currentUrl = window.location.href; // Full URL of the current page
  const currentPath = window.location.pathname; // Path segment of the URL

  const extractSectionAfterRole = () => {
    const segments = currentPath.split("/").filter(Boolean);
    const roleIndex = segments.indexOf(role);

    if (roleIndex !== -1 && roleIndex + 1 < segments.length) {
      return segments[roleIndex + 1];
    }
    return null;
  };

  const handleCloseModal = () => {
    setShowQuotation(false);
    reset();
    dispatch(setMasterSearch({ masterSearchLeads: null }));
  };

  const sectionAfterRole = extractSectionAfterRole();
  const onSubmit = (data) => {
    let type;
    if (sectionAfterRole === "leads") {
      type = "leads";
    } else if (sectionAfterRole === "no-claim-bucket") {
      type = "noClaimBucket";
    } else if (sectionAfterRole === "bucket") {
      type = "noClaimBucket";
    } else {
      type = "leads"; // Assign a default value if needed
    }
    console.log("Form Data:", data, type);
    const payload = {
      data: data.data,
      type,
    };
    dispatch(fireMasterSearch(payload));
  };

  const handleDropdownChange = (row, selectedValue) => {
    console.log("Selected Value:", selectedValue);
    if (selectedValue) {
      setSelectedSalesExec(selectedValue);
    }
  };

  const handleLeadShare = (row, selectedSalesExec) => {
    if (selectedSalesExec) {
      const payload = {
        userName: selectedSalesExec,
        leadIds: [row.leadId],
      };

      console.log("Payload to dispatch:", payload);

      dispatch(
        assignLeadBySearchNCBucket(payload, (success) => {
          if (success) {
            setShowQuotation(false);
          }
        })
      ); // Assuming your action takes payload as a parameter
    } else {
      toast.error("Select the user ");
    }
  };

  const salesExecutiveOptions = userExecutives?.salesExecutives?.map(
    (executive) => {
      return {
        label: executive.name,
        value: executive.email,
      };
    }
  );

  const handleRowClick = (row) => {
    console.log(row);
    if (role === "superAdmin") {
      const link = `/${role}/editLead`;
      navigate(link, { state: { leadData: row } });
      handleCloseModal();
    } else {
      const roleFieldMap = {
        salesExecutive: "salesExecutive",
        salesTl: "salesTL",
        operationsTl: "operationTL",
        operationsExecutive: "operationExecutiveName",
      };

      const link = `/${role}/editLead`;
      const assignedField = roleFieldMap[role];
      const assignedName = row?.[assignedField];

      console.log(assignedField, assignedName, userData);

      if (userData?.name === assignedName || userData?.email === assignedName) {
        navigate(link, { state: { leadData: row } });
        handleCloseModal();
      }
    }
  };

  return (
    <Dialog
      open={showQuotation}
      handler={handleCloseModal}
      className="addLeadModal rounded-lg overflow-hidden"
      style={{ maxHeight: "90vh", minWidth: "80%" }}
    >
      <DialogHeader className="text-xl primary-gradient text-white poppins-font main-bg">
        <div className="flex justify-between w-full items-center">
          Master Search{" "}
          <button onClick={handleCloseModal} className="text-2xl">
            <IoIosCloseCircle />
          </button>
        </div>
      </DialogHeader>
      <DialogBody
        className="overflow-y-auto bg-transparent lg:p-5"
        style={{ maxHeight: "calc(90vh - 64px)" }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
          <InputField
            control={control}
            errors={errors}
            name="data"
            type="text"
          />
        </form>
        {masterLoader ? (
          <div className="h-[90vh] w-full flex justify-center items-center gap-2">
            <p className="md:text-lg flex gap-2">
              <Spinner /> Loading ...
            </p>
          </div>
        ) : masterSearchLeads ? (
          <div>
            <DataTable
              columns={columns(
                handleDropdownChange,
                salesExecutiveOptions,
                handleLeadShare,
                sectionAfterRole,
                role,
                handleRowClick
              )}
              data={masterSearchLeads || []} // Defaults to an empty array if no data
              noDataComponent="No data to be displayed..."
              customStyles={tableCustomStyles}
              selectableRows
              pagination
              // onRowClicked={handleRowClick}
              paginationPerPage="8"
            />
          </div>
        ) : (
          <p className="text-center mt-4 font-semibold">Type to search ...</p>
        )}
      </DialogBody>
    </Dialog>
  );
};

export default SearchModal;
