import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { MdDownload } from "react-icons/md";
import { tableCustomStyles } from "../../constants/tableCustomStyle";

const EditPiTable = ({ piData = [] }) => {
  const [downloadingId, setDownloadingId] = useState(null);

  // Download fake PDF (demo ke liye)
  const handleDownload = async (row) => {
    try {
      setDownloadingId(row._id);

      // 👇 Yaha actual API call karega
      const blob = new Blob([`PDF content of ${row.invoiceNo}`], {
        type: "application/pdf",
      });

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = row.pdfFilename || `${row.invoiceNo}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setDownloadingId(null);
    }
  };

  // Columns
  const columns = [
    { name: "Invoice No", selector: (row) => row.invoiceNo, sortable: true },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Mobile", selector: (row) => row.mobileNumber || "-" },
    {
      name: "Date",
      selector: (row) => new Date(row.date).toLocaleDateString("en-GB"),
    },
    {
      name: "Download",
      cell: (row) => (
        <button
          onClick={() => handleDownload(row)}
          className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2"
          disabled={downloadingId === row._id}
        >
          {downloadingId === row._id ? "Downloading..." : <MdDownload />}
          PDF
        </button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <DataTable
        columns={columns}
        data={piData}
        customStyles={tableCustomStyles}
        pagination
        highlightOnHover
        responsive
        persistTableHead
      />
    </div>
  );
};

export default EditPiTable;
