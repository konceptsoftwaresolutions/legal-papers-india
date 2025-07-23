import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector, useDispatch } from "react-redux";
import { getAllPerformaInvoices } from "../../redux/features/performa";
import { MdDownload } from "react-icons/md";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import GeneratePerformaPDF from "./GeneratePerformaPDF";

const AllPerformaInvoices = ({ leadId }) => {
  const dispatch = useDispatch();
  const { allPerformaInvoices } = useSelector((state) => state.performa || {});
  const [filteredData, setFilteredData] = useState([]);

  // Fetch performa invoices
  useEffect(() => {
    if (leadId) dispatch(getAllPerformaInvoices(leadId));
  }, [dispatch, leadId]);

  // Filter invoices by leadId
  useEffect(() => {
    if (allPerformaInvoices && leadId) {
      const filtered = allPerformaInvoices.filter(
        (invoice) => invoice.leadId === leadId
      );
      setFilteredData(filtered);
    }
  }, [allPerformaInvoices, leadId]);

  // Handle PDF Download
  const handleDownload = async (row) => {
    try {
      const blob = await pdf(
        <GeneratePerformaPDF formData={row} invoiceNo={row.invoiceNo} />
      ).toBlob();

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${row.invoiceNo || "invoice"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Failed to download PDF.");
    }
  };

  // Columns for DataTable
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

export default AllPerformaInvoices;
