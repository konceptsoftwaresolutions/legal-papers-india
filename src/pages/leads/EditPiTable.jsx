import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { MdDownload } from "react-icons/md";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { downloadPerformaInvoicePDF } from "../../redux/features/performa";

const DownloadButton = ({ row, onDownload }) => {
  const [downloading, setDownloading] = useState(false);

  const handleClick = async () => {
    setDownloading(true);
    await onDownload(row);
    setDownloading(false);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2"
      disabled={downloading}
    >
      {downloading ? "Downloading..." : <MdDownload />}
      PDF
    </button>
  );
};

const EditPiTable = ({ piData = [] }) => {
  const dispatch = useDispatch();

  const handleDownload = async (row) => {
    try {
      const blob = await dispatch(downloadPerformaInvoicePDF(row._id));

      if (!blob) {
        toast.error("No PDF data received");
        return;
      }

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
    }
  };

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
      cell: (row) => <DownloadButton row={row} onDownload={handleDownload} />,
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

export default EditPiTable; // ✅ No memo
