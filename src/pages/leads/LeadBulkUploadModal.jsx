import React, { useState } from "react";
import { Dialog, DialogHeader, DialogBody } from "@material-tailwind/react";
import { IoIosCloseCircle } from "react-icons/io";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import MyButton from "../../components/buttons/MyButton";

const BulkUploadModal = ({ showModal, setShowModal, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCloseModal = () => {
    setSelectedFile(null);
    setFileName("");
    setPreviewData([]);
    setLoading(false);
    setShowModal(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isExcel =
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel";

    if (!isExcel) {
      toast.error("Please upload a valid .xlsx Excel file.");
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (!jsonData.length) {
        toast.error("Excel sheet is empty.");
        return;
      }

      setPreviewData(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !previewData.length) {
      toast.error("Please select a valid Excel file with data.");
      return;
    }

    setLoading(true);
    try {
      await onUpload({ data: previewData, file: selectedFile });
      toast.success("File uploaded successfully!");
      handleCloseModal();
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={showModal}
      handler={handleCloseModal}
      className="rounded-lg overflow-hidden"
      style={{ maxHeight: "90vh", minWidth: "80%" }}
    >
      <DialogHeader className="text-xl primary-gradient text-white poppins-font main-bg">
        <div className="flex justify-between w-full items-center">
          Bulk Upload Leads
          <button onClick={handleCloseModal} className="text-2xl">
            <IoIosCloseCircle />
          </button>
        </div>
      </DialogHeader>

      <DialogBody
        className="overflow-y-auto bg-transparent lg:p-5"
        style={{ maxHeight: "calc(90vh - 64px)" }}
      >
        <div className="flex flex-col gap-4">
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            disabled={loading}
            className="border border-gray-300 p-2 rounded-md"
          />

          {fileName && (
            <p className="text-green-600 text-sm font-medium">
              Selected: {fileName}
            </p>
          )}

          {previewData.length > 0 && (
            <div className="overflow-auto max-h-72 border rounded-md">
              <table className="min-w-full text-sm border border-gray-300">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    {Object.keys(previewData[0]).map((key) => (
                      <th
                        key={key}
                        className="border px-2 py-1 text-left font-semibold whitespace-nowrap"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, idx) => (
                        <td
                          key={idx}
                          className="border px-2 py-1 whitespace-nowrap"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end">
            <MyButton
              onClick={handleUpload}
              className="main-bg text-white mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedFile || previewData.length === 0 || loading}
              loading={loading}
            >
              {loading ? "Uploading..." : "Upload Excel"}
            </MyButton>
          </div>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default BulkUploadModal;
