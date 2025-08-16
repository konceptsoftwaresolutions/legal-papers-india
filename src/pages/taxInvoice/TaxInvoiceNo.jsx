import React, { useState, useCallback, useEffect } from "react";
import Heading from "../../common/Heading";
import MyButton from "../../components/buttons/MyButton";
import TaxInvoiceModal from "./TaxInvoiceModal";
import { useDispatch, useSelector } from "react-redux";
import {
  getInvoiceSettings,
  setInvoiceSettings,
  getAllTaxInvoices,
  downloadTaxInvoicePDF,
} from "../../redux/features/tax";
import DataTable from "react-data-table-component";
import { MdDownload, MdEdit } from "react-icons/md";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import toast from "react-hot-toast";
import { Spinner } from "@material-tailwind/react";
import EditTaxInvoiceModal from "./EditTaxInvoiceModal";

const TaxInvoiceNo = () => {
  const dispatch = useDispatch();

  // Redux state
  const { allTaxInvoices, loading } = useSelector((state) => state.tax || {});

  // Modal settings states
  const [showModal, setShowModal] = useState(false);
  const [startFrom, setStartFrom] = useState("");
  const [prefix, setPrefix] = useState("");
  const [currentInvoiceNo, setCurrentInvoiceNo] = useState("");
  const [saving, setSaving] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  // New state for Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);

  // Table data state
  const [tableData, setTableData] = useState([]);

  // Fetch invoice settings when modal opens
  const fetchTaxInvoiceData = useCallback(() => {
    dispatch(
      getInvoiceSettings("TaxInvoice", (success, data) => {
        if (success && data) {
          setCurrentInvoiceNo(data.currentNumber?.toString() || "1");
          setStartFrom(data.currentNumber?.toString() || "1");
          setPrefix(data.prefix || "");
        } else {
          setCurrentInvoiceNo("1");
          setStartFrom("1");
          setPrefix("");
        }
      })
    );
  }, [dispatch]);

  // Save invoice settings
  const handleSave = () => {
    setSaving(true);
    dispatch(
      setInvoiceSettings(
        {
          module: "TaxInvoice",
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

  // Fetch all tax invoices on mount
  useEffect(() => {
    dispatch(getAllTaxInvoices());
  }, [dispatch]);

  // Update table data when Redux changes
  useEffect(() => {
    if (Array.isArray(allTaxInvoices?.data)) {
      setTableData(allTaxInvoices.data);
    } else if (Array.isArray(allTaxInvoices)) {
      setTableData(allTaxInvoices);
    } else {
      setTableData([]);
    }
  }, [allTaxInvoices]);

  // Handle PDF download
  const handleDownload = async (row) => {
    try {
      setDownloadingId(row._id); // Start spinner
      const blob = await dispatch(downloadTaxInvoicePDF(row._id));
      if (!blob) {
        toast.error("No PDF data received");
        setDownloadingId(null);
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
      setDownloadingId(null); // Stop spinner
    }
  };

  const handleEdit = (taxInvoiceId) => {
    setEditingInvoiceId(taxInvoiceId);
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
      {/* Heading + Button */}
      <div className="flex flex-col w-full px-4 gap-y-4 py-5">
        <div className="grid grid-cols-2">
          <Heading text="Generate Tax Invoice" showHeading />
        </div>

        <div className="w-full flex justify-end items-start gap-2 flex-wrap">
          <MyButton
            className="main-bg py-2 text-[15px] font-medium px-4"
            onClick={() => setShowModal(true)}
          >
            Tax Invoice No
          </MyButton>
        </div>
      </div>

      {/* Spinner show while loading */}
      {loading ? (
        <div className="h-[90vh] w-full flex justify-center items-center gap-2">
          <p className="md:text-lg flex gap-2">
            <Spinner /> Loading ...
          </p>
        </div>
      ) : (
        <div className="px-4">
          <DataTable
            columns={columns}
            data={Array.isArray(tableData) ? tableData : []}
            customStyles={tableCustomStyles}
            pagination
            highlightOnHover
            responsive
            persistTableHead
          />
        </div>
      )}

      {/* Modal */}
      <TaxInvoiceModal
        open={showModal}
        onClose={() => setShowModal(false)}
        currentInvoiceNo={currentInvoiceNo}
        prefix={prefix}
        setPrefix={setPrefix}
        startFrom={startFrom}
        setStartFrom={setStartFrom}
        onSave={handleSave}
        fetchTaxInvoiceData={fetchTaxInvoiceData}
        saving={saving}
      />

      {showEditModal && (
        <EditTaxInvoiceModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          taxInvoiceId={editingInvoiceId}
        />
      )}
    </>
  );
};

export default TaxInvoiceNo;
