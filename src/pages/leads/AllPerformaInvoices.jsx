import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllPerformaInvoices,
  downloadPerformaInvoicePDF,
} from "../../redux/features/performa";
import { MdDownload } from "react-icons/md";
import { tableCustomStyles } from "../../constants/tableCustomStyle";

const AllPerformaInvoices = () => {
  const dispatch = useDispatch();
  const allPerformaInvoices = useSelector(
    (state) => state.performaDetails?.allPerformaInvoices || []
  );
  const [filteredData, setFilteredData] = useState([]);

  // Fetch all performa invoices
  useEffect(() => {
    dispatch(getAllPerformaInvoices());
  }, [dispatch]);

  // Keep all invoices in local state
  useEffect(() => {
    setFilteredData(allPerformaInvoices);
  }, [allPerformaInvoices]);

  // Handle PDF download from API
  const handleDownload = async (row) => {
    try {
      const blob = await dispatch(downloadPerformaInvoicePDF(row._id));
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = row.pdfFilename || `${row.invoiceNo || "invoice"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("PDF download failed", err);
      alert("Failed to download PDF.");
    }
  };

  const columns = [
    {
      name: "Invoice No",
      selector: (row) => row.invoiceNo || "-",
      sortable: true,
      wrap: true,
    },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Mobile", selector: (row) => row.mobileNumber || "-" },
    {
      name: "Date",
      selector: (row) => new Date(row.date).toLocaleDateString("en-GB"),
    },
    { name: "Tax Type", selector: (row) => row.taxType || "-" },
    { name: "GST No", selector: (row) => row.gstNo || "-" },
    {
      name: "Download",
      cell: (row) => (
        <button
          onClick={() => handleDownload(row)}
          className="text-blue-600 hover:underline flex items-center gap-1"
        >
          <MdDownload /> PDF
        </button>
      ),
    },
  ];

  return (
    <div className="py-4">
      <DataTable
        columns={columns}
        data={filteredData}
        customStyles={tableCustomStyles}
        pagination
        highlightOnHover
        responsive
        persistTableHead
      />
    </div>
  );
};

export default AllPerformaInvoices;
