import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Spinner,
} from "@material-tailwind/react";
import { IoSend, IoDownload } from "react-icons/io5";
import * as XLSX from "xlsx";
import { useDispatch } from "react-redux";
import { whatsAppInHouseTemplateSaveSend } from "../../../redux/features/marketing";
import toast from "react-hot-toast";
import { IoIosCloseCircle } from "react-icons/io";

const ExcelUploadModal = ({
  open,
  setOpen,
  campaignName,
  templateId,
  templateName,
  variables,
  selectedImage,
  channelId,
  compiledMessage,
  message,
}) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);

  const varObj = useMemo(() => {
    if (!variables) return {};
    if (!Array.isArray(variables)) return variables;
    const obj = {};
    variables.forEach((v, i) => {
      const key = v.key?.startsWith("{{") ? v.key : `{{${i + 1}}}`;
      obj[key] = v.value || "";
    });
    return obj;
  }, [variables]);

  const handleUpload = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      toast.success(`Excel selected: ${f.name}`);
    }
  };

  const handleDownload = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([["MOBILE"], ["1234567890"]]);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "whatsapp-bulk-template.xlsx");
    toast.success("Template downloaded ✅");
  };

  const handleSend = async () => {
    if (!file) return toast.error("Select an Excel file first ❌");
    setSending(true);

    try {
      const payload = {
        campaignName: campaignName || `Inhouse_${Date.now()}`,
        channelId: channelId || "",
        message: compiledMessage || message || "",
        type: "excel",
        templateId: templateId ? [templateId] : [],
        templateName: templateName ? [templateName] : ["InhouseTemplate"],
        variables: varObj,
        records: [],
      };

      if (file) payload.file = file;

      await dispatch(
        whatsAppInHouseTemplateSaveSend(payload, setSending, (success) => {
          if (success) {
            toast.success("Excel sent ✅");
            setFile(null);
            setOpen(false);
          }
        })
      );
    } catch (err) {
      console.log(err);
      toast.error("Failed to send Excel ❌");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog
      open={open}
      handler={() => {}}
      size="sm"
      dismiss={{ escapeKey: false, outsideClick: false }} // ✅ Only close via buttons
    >
      <DialogHeader className="flex justify-between items-center pb-3 main-bg rounded-t-lg text-white">
        <h2 className="text-lg font-semibold text-white">
          Upload Excel
        </h2>
        <IoIosCloseCircle
          className="text-2xl cursor-pointer text-white hover:text-red-800 transition"
          onClick={() => {
            setFile(null); // reset file on cancel
            setOpen(false);
          }}
        />
      </DialogHeader>
      <DialogBody divider className="flex flex-col gap-4">
        <Button
          onClick={handleDownload}
          className="main-bg flex text-[14px] justify-center py-2 px-4 rounded-md items-center gap-x-2 text-white"
        >
          <IoDownload size={18} /> Download Template
        </Button>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleUpload}
          className="border p-2 rounded"
        />
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2">
        <Button
          variant="text"
          className="main-bg flex text-[14px] justify-center py-2 px-4 rounded-md items-center gap-x-2 text-white"
          onClick={() => {
            setFile(null); // reset file on cancel
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSend}
          disabled={sending}
          className="main-bg flex text-[14px] justify-center py-2 px-4 rounded-md items-center gap-x-2 text-white"
        >
          {sending ? (
            <>
              <Spinner size={20} /> Sending...
            </>
          ) : (
            <>
              <IoSend size={18} /> Send Excel
            </>
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ExcelUploadModal;
