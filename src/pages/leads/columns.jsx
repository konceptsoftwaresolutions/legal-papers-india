import { MdDelete } from "react-icons/md";
import { TiArrowForwardOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

// const navigate = useNavigate(); // this must be inside your component

export const columns = (
  handleForward,
  handleImpForward,
  fowardShow = true,
  role,
  navigate
) => {
  return [
    {
      name: "Lead ID",
      cell: (row) => (
        <div
          onClick={(e) => {
            console.log("clicked", e);
            e.stopPropagation();
            if (e.ctrlKey) {
              const link = `/${role}/editLead`;
              navigate(link, { state: { leadData: row } });
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
      style: { textAlign: "left" },
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
    ...(fowardShow
      ? [
          {
            name: "Forward",
            cell: (row) => (
              <button
                onClick={() => handleForward(row)}
                className={row.status === "Converted" ? "" : "opacity-20"}
                style={{
                  background: "#198754",
                  color: "#fff",
                  border: "none",
                  padding: "10px 10px",
                  fontSize: "14px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                disabled={row.status === "Converted" ? false : true}
              >
                <TiArrowForwardOutline />
              </button>
            ),
            wrap: true,
            style: { textAlign: "left", paddingLeft: "16px" },
            width: "100px",
          },
          {
            name: "Important Forward",
            cell: (row) => (
              <button
                onClick={() => handleImpForward(row)}
                className={row.status === "Converted" ? "" : "opacity-20"}
                style={{
                  background: "#dc3545",
                  color: "#fff",
                  border: "none",
                  padding: "10px 10px",
                  fontSize: "14px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                disabled={row.status === "Converted" ? false : true}
              >
                <TiArrowForwardOutline />
              </button>
            ),
            wrap: true,
            style: { textAlign: "left", paddingLeft: "16px" },
            width: "190px",
          },
        ]
      : []),
  ];
};

export const oldLeadsColumns = [
  {
    name: "Lead ID",
    selector: (row) => row.leadId,
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
];

export const remarksColumn = [
  {
    name: "Date & Time",
    selector: (row) => row.dateTime,
    wrap: true,
    style: { textAlign: "left", paddingLeft: "16px" },
  },
  {
    name: "Remarks",
    selector: (row) => row.remark,
    wrap: true,
    style: { textAlign: "left", paddingLeft: "16px" },
    isEditable: true,
  },
  {
    name: "Name",
    selector: (row) => row.executiveName || "N/A",
    wrap: true,
    style: { textAlign: "left", paddingLeft: "16px" },
  },
];

export const paymentsColumn = [
  {
    name: "Transaction ID",
    selector: (row) => row.transactionId,
    wrap: true,
    style: { textAlign: "left", paddingLeft: "16px" },
  },
  {
    name: "Payment Date",
    selector: (row) => row.date,
    wrap: true,
    style: { textAlign: "left", paddingLeft: "16px" },
  },
  {
    name: "Total Amount",
    selector: (row) => row.totalAmount || "N/A",
    wrap: true,
    style: { textAlign: "left", paddingLeft: "16px" },
  },
  {
    name: "Govt. Fee",
    selector: (row) => row.govtFee || "N/A",
    wrap: true,
    style: { textAlign: "left", paddingLeft: "16px" },
  },
  {
    name: "Gross Amount",
    selector: (row) => row.grossAmount || "N/A",
    wrap: true,
    style: { textAlign: "left", paddingLeft: "16px" },
  },
  {
    name: "Tax Rate",
    selector: (row) => row.taxRate || "0%",
    wrap: true,
    style: { textAlign: "left", paddingLeft: "16px" },
  },
  {
    name: "Revenue",
    selector: (row) => row.totalAmount - row.govtFee || "N/A",
    wrap: true,
    style: { textAlign: "left", paddingLeft: "16px" },
  },
  {
    name: "Note",
    selector: (row) => row.notes || "N/A",
    wrap: true,
    style: { textAlign: "left", paddingLeft: "16px" },
  },
];

export const impleadCol = [
  {
    name: "Lead Id",
    cell: (row) => (
      <div
        onClick={(e) => e.stopPropagation()} // Prevent row click
        style={{ cursor: "text" }}
      >
        {row.leadId}
      </div>
    ),
    wrap: true,
    width: "120px",
    style: { textAlign: "left", paddingLeft: "16px" },
  },
  {
    name: "Date",
    selector: (row) => row.date,
    wrap: true,
    width: "200px",
    style: { textAlign: "left", paddingLeft: "16px" },
  },
  {
    name: "Name",
    selector: (row) => row.formData.nameOfBusinessEntity,
    wrap: true,
    width: "250px",
    style: { textAlign: "left", paddingLeft: "16px" },
  },
  {
    name: "Mobile Number",
    selector: (row) => row.formData.mobileNumber,
    wrap: true,
    width: "180px",
    style: { textAlign: "left", paddingLeft: "16px" },
  },
  {
    name: "Email ID",
    selector: (row) => row.formData.emailId,
    wrap: true,
    width: "290px",
    style: { textAlign: "left", paddingLeft: "16px" },
  },
  {
    name: "Service Category",
    selector: (row) => row.formData.serviceCategory,
    wrap: true,
    width: "190px",
    style: { textAlign: "left", paddingLeft: "16px" },
  },
  {
    name: "Actions",
    cell: (row) => (
      <button
        onClick={() => console.log("Delete clicked:", row)}
        style={{
          background: "red",
          color: "#fff",
          border: "none",
          padding: "10px 10px",
          fontSize: "14px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        disabled={row.status === "Converted" ? false : true}
      >
        <MdDelete />
      </button>
    ),
    wrap: true,
    width: "190px",
    style: { textAlign: "left", paddingLeft: "16px" },
  },
];
