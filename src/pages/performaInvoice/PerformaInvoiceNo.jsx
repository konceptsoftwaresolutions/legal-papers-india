import React, { useEffect, useState, useCallback } from "react";
import Heading from "../../common/Heading";
import MyButton from "../../components/buttons/MyButton";
import InvoiceModal from "./InvoiceModal";
import EditGeneratePerformaModal from "./EditGeneratePerformaModal"; // import edit modal
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  getInvoiceSettings,
  setInvoiceSettings,
  getAllPerformaInvoices,
  downloadPerformaInvoicePDF,
} from "../../redux/features/performa";
import { MdDownload, MdEdit } from "react-icons/md";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import { Spinner } from "@material-tailwind/react";

const PerformaInvoiceNo = () => {
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const [startFrom, setStartFrom] = useState("");
  const [prefix, setPrefix] = useState("");
  const [currentInvoiceNo, setCurrentInvoiceNo] = useState("");
  const [saving, setSaving] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const { allPerformaInvoices = [], loading } = useSelector(
    (state) => state.performaDetails || {}
  );

  // Fetch invoice settings
  const fetchInvoiceData = useCallback(() => {
    dispatch(
      getInvoiceSettings("Proforma", (success, data) => {
        if (success && data) {
          setCurrentInvoiceNo(data.currentNumber?.toString() || "1"); // readonly
          setStartFrom(data.currentNumber?.toString() || "1"); // editable
          setPrefix(data.prefix || "");
        } else {
          setCurrentInvoiceNo("1");
          setStartFrom("1");
          setPrefix("");
        }
      })
    );
  }, [dispatch]);

  // Fetch all performa invoices on mount
  useEffect(() => {
    dispatch(getAllPerformaInvoices());
  }, [dispatch]);

  // Update local table state when invoices change
  useEffect(() => {
    setFilteredData(allPerformaInvoices);
  }, [allPerformaInvoices]);

  // Save invoice settings
  const handleSave = () => {
    setSaving(true);
    dispatch(
      setInvoiceSettings(
        {
          module: "Proforma",
          prefix: prefix || "",
          currentNumber: startFrom || "1",
        },
        (success) => {
          setSaving(false);
          if (success) {
            setShowModal(false);
          }
        }
      )
    );
  };

  // Download PDF from API
  const handleDownload = async (row) => {
    try {
      setDownloadingId(row._id); // Start loader for this row
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
    } finally {
      setDownloadingId(null); // Stop loader
    }
  };

  // Open edit modal for selected invoice
  const handleEdit = (invoiceId) => {
    setEditingInvoiceId(invoiceId);
    setShowEditModal(true);
  };

  // DataTable columns
  const columns = [
    {
      name: "Invoice No",
      selector: (row) => row.invoiceNo || "-",
      sortable: true,
      wrap: true,
    },
    { name: "Name", selector: (row) => row.name, sortable: true, width: "25%" },
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
      ),
    },
    {
      name: "Edit",
      cell: (row) => (
        <button
          onClick={() => handleEdit(row._id)}
          className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-2 hover:bg-green-700 transition"
        >
          <MdEdit /> Edit
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col w-full px-4 gap-y-4 py-5">
        <div className="grid grid-cols-2">
          <Heading text="Generate Performa Invoice" showHeading />
        </div>

        <div className="w-full flex justify-end items-start gap-2 flex-wrap">
          <MyButton
            className="main-bg py-2 text-[15px] font-medium px-4"
            onClick={() => setShowModal(true)}
          >
            Invoice No
          </MyButton>
        </div>
      </div>

      {/* ✅ Spinner show while loading */}
      {loading ? (
        <div className="h-[90vh] w-full flex justify-center items-center gap-2">
          <p className="md:text-lg flex gap-2">
            <Spinner /> Loading ...
          </p>
        </div>
      ) : (
        <div className="px-4 py-4">
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
      )}

      {/* Create Invoice Modal */}
      <InvoiceModal
        open={showModal}
        onClose={() => setShowModal(false)}
        currentInvoiceNo={currentInvoiceNo}
        prefix={prefix}
        setPrefix={setPrefix}
        startFrom={startFrom}
        setStartFrom={setStartFrom}
        onSave={handleSave}
        fetchInvoiceData={fetchInvoiceData}
        saving={saving}
      />

      {/* Edit Invoice Modal */}
      {showEditModal && (
        <EditGeneratePerformaModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          invoiceId={editingInvoiceId}
        />
      )}
    </>
  );
};

export default PerformaInvoiceNo;
