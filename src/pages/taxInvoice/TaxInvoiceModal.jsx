import React, { useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { IoIosCloseCircle } from "react-icons/io";
import { Spin } from "antd";

const TaxInvoiceModal = ({
  open,
  onClose,
  currentInvoiceNo,
  prefix,
  setPrefix,
  startFrom,
  setStartFrom,
  onSave,
  fetchTaxInvoiceData,
  saving,
}) => {
  useEffect(() => {
  if (open) {
    fetchTaxInvoiceData();
  }
}, [open, fetchTaxInvoiceData]);

  return (
    <Dialog open={open} handler={onClose} size="sm">
      {/* Header */}
      <DialogHeader className="main-bg text-white flex justify-between items-center">
        Tax Invoice Number
        <button onClick={onClose}>
          <IoIosCloseCircle className="text-2xl" />
        </button>
      </DialogHeader>

      {/* Body */}
      <DialogBody className="space-y-4">
        {/* Invoice No */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Tax Invoice No
          </label>
          <input
            type="text"
            value={currentInvoiceNo}
            disabled
            className="w-full px-3 py-2 rounded-md bg-[var(--color-backgroundMid)] text-gray-600 border border-[var(--color-hoverColor)]"
          />
        </div>

        {/* Prefix + Start From */}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Prefix</label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="e.g. TAX"
              className="w-full px-3 py-2 rounded-md bg-white border border-[var(--color-hoverColor)] text-[var(--color-textColor)]"
            />
          </div>

          <div className="pb-2 text-xl font-semibold text-[var(--color-textColor)]">
            -
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Start From</label>
            <input
              type="number"
              value={startFrom}
              onChange={(e) => setStartFrom(e.target.value)}
              placeholder="e.g. 1001"
              className="w-full px-3 py-2 rounded-md bg-white border border-[var(--color-hoverColor)] text-[var(--color-textColor)]"
            />
          </div>
        </div>
      </DialogBody>

      {/* Footer */}
      <DialogFooter className="gap-2">
        <Button variant="text" color="gray" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          className="main-bg py-2 text-[15px] font-medium px-4 flex items-center justify-center gap-2"
          onClick={onSave}
          disabled={saving}
        >
          {saving && <Spin size="small" />}
          Save
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default TaxInvoiceModal;
