import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { MdDownload } from "react-icons/md";
import { Spinner } from "@material-tailwind/react";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import { useDispatch, useSelector } from "react-redux";
import { downloadTaxInvoicePDF } from "../../redux/features/tax";
import toast from "react-hot-toast";

const TaxTable = ({ taxData = [] }) => {
  const dispatch = useDispatch();
  const [downloadingId, setDownloadingId] = useState(null);
  const { role } = useSelector((state) => state.auth);

  // Download PDF
  const handleDownload = async (row) => {
    try {
      setDownloadingId(row._id);
      const blob = await dispatch(downloadTaxInvoicePDF(row._id));
      if (!blob) {
        toast.error("No PDF data received");
        return;
      }
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${row.name}-${row.invoiceNo || "tax-invoice"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("PDF download failed", err);
      toast.error("Failed to download PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  // Table columns
  const columns = [
    {
      name: "Invoice No",
      selector: (row) => row.invoiceNo || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Name",
      selector: (row) => row.name || "-",
      sortable: true,
      width: "25%",
    },
    {
      name: "Mobile",
      selector: (row) => row.mobileNumber || "-",
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => new Date(row.date).toLocaleDateString("en-GB"),
      sortable: true,
    },
    {
      name: "Download",
      cell: (row) =>
        role === "superAdmin" ||
        role === "salesTl" ||
        role === "salesExecutive" ? (
          <button
            onClick={() => handleDownload(row)}
            className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2 hover:bg-blue-700 transition"
            disabled={downloadingId === row._id}
          >
            {downloadingId === row._id ? (
              <Spinner className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <MdDownload />
            )}
            PDF
          </button>
        ) : null,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={Array.isArray(taxData) ? taxData : []}
      customStyles={tableCustomStyles}
      pagination
      highlightOnHover
      responsive
      persistTableHead
    />
  );
};

export default TaxTable;
