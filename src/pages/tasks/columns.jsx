import { MdDelete } from "react-icons/md";
import { TiArrowForwardOutline } from "react-icons/ti";

export const columns = (handleTaskDelete, role, navigate) => {
  return [
    // {
    //   name: "Task ID",
    //   selector: (row) => row.taskId || "0",
    //   wrap: true,
    //   style: { textAlign: "left", paddingLeft: "16px" },
    //   width: "150px",
    // },

    {
      name: "Task ID",
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
          {row.taskId}
        </div>
      ),
      wrap: true,
      style: { textAlign: "left" },
      width: "130px",
    },
    {
      name: "Name",
      selector: (row) => row.nameOfBusinessEntity || "0",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "200px",
    },
    {
      name: "Email",
      selector: (row) => row.emailId || "0",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "250px",
    },
    {
      name: "Mobile Number",
      selector: (row) => row.mobileNumber || "0",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "170px",
    },
    {
      name: "Reminder Date",
      selector: (row) => row?.reminder?.reminderDate || "0",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "170px",
    },
    {
      name: "Reminder Time",
      selector: (row) => row?.reminder?.reminderTime || "0",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "170px",
    },
    {
      name: "Status",
      selector: (row) => row.status || "0",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "150px",
    },
    {
      name: "Subject",
      selector: (row) => row.subject || "0",
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "350px",
    },
    {
      name: "Actions",
      // selector: (row) => row.totalPayments || "0",
      cell: (row) => (
        <button
          onClick={() => handleTaskDelete(row.taskId)}
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
          <MdDelete />
        </button>
      ),
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "150px",
    },
  ];
};
