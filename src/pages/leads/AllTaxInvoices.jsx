import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector, useDispatch } from "react-redux";
import { MdDownload } from "react-icons/md";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import {
  getAllTaxInvoices,
  downloadTaxInvoicePDF,
} from "../../redux/features/tax";
import toast from "react-hot-toast";

const AllTaxInvoices = () => {
  const dispatch = useDispatch();
  const { allTaxInvoices, loading } = useSelector((state) => state.tax || {});
  const [tableData, setTableData] = useState([]);

  // Fetch all invoices on mount
  useEffect(() => {
    dispatch(getAllTaxInvoices());
  }, [dispatch]);

  // Update table data when Redux changes
  useEffect(() => {
    if (allTaxInvoices) {
      setTableData(allTaxInvoices);
    }
  }, [allTaxInvoices]);

  const handleDownload = async (row) => {
    try {
      const blob = await dispatch(downloadTaxInvoicePDF(row._id)).unwrap();

      if (!blob) {
        toast.error("No PDF data received");
        return;
      }

      // Create blob URL & trigger download
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${row.invoiceNo || "tax-invoice"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("PDF download failed", err);
      toast.error("Failed to download PDF");
    }
  };

  const columns = [
    {
      name: "Invoice No",
      selector: (row) => row.invoiceNo || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobileNumber || "-",
    },
    {
      name: "Date",
      selector: (row) => new Date(row.date).toLocaleDateString("en-GB"),
    },
    {
      name: "Tax Type",
      selector: (row) => row.taxType || "-",
    },
    {
      name: "GST No",
      selector: (row) => row.gstNo || "-",
    },
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
        data={tableData}
        customStyles={tableCustomStyles}
        pagination
        highlightOnHover
        responsive
        persistTableHead
        progressPending={loading}
      />
    </div>
  );
};

export default AllTaxInvoices;
