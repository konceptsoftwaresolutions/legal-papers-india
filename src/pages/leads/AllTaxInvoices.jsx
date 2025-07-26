import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector, useDispatch } from "react-redux";
import { MdDownload } from "react-icons/md";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import { getAllTaxEntries } from "../../redux/features/tax"; // Replace path if needed
import GenerateTaxPDF from "./GenerateTaxPDF";
import { pdf } from "@react-pdf/renderer";

const AllTaxInvoices = ({ leadId }) => {
  const dispatch = useDispatch();
  const { allTaxEntries } = useSelector((state) => state.tax || {});
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (leadId) dispatch(getAllTaxEntries(leadId));
  }, [dispatch, leadId]);

  useEffect(() => {
    if (allTaxEntries && leadId) {
      const filtered = allTaxEntries.filter((entry) => entry.leadId === leadId);
      setFilteredData(filtered);
    }
  }, [allTaxEntries, leadId]);

  const handleDownload = async (row) => {
    try {
      const blob = await pdf(
        <GenerateTaxPDF formData={row} invoiceNo={row.invoiceNo} />
      ).toBlob();

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${row.invoiceNo || "tax-invoice"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("PDF generation failed", err);
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

export default AllTaxInvoices;
