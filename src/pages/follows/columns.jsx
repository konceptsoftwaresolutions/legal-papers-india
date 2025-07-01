import { TiArrowForwardOutline } from "react-icons/ti";

export const columns = (handleForward, handleImpForward, role, navigate) => {
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
    },
    {
      name: "Name",
      width: "190px",
      selector: (row) =>
        row.formData.nameOfBusinessEntity
          ? row.formData.nameOfBusinessEntity
          : row.formData.name,
    },
    {
      name: "Mobile Number",
      selector: (row) => row.formData.mobileNumber,
    },
    {
      name: "Email Id",
      selector: (row) => row.formData.emailId,
    },
    {
      name: "Service Category",
      selector: (row) => row.formData.serviceCategory,
    },
    {
      name: "Sales Status",
      selector: (row) => row.status,
    },
    {
      name: "Operation Status",
      selector: (row) => row.operationStatus,
    },
    {
      name: "Total Payments",
      selector: (row) => row.totalPayments,
    },
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
    {
      name: "Done",
      cell: (row) => (
        <button
          onClick={() => console.log("Done row clicked:", row)}
          className={row.status === "Converted" ? "main-bg" : "opacity-20"}
          style={{
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
  ];
};
