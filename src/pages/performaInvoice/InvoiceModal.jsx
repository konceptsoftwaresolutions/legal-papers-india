import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
} from "@material-tailwind/react";
import { IoIosCloseCircle } from "react-icons/io";

const InvoiceModal = ({
  open,
  onClose,
  currentInvoiceNo,
  startFrom,
  setStartFrom,
  onSave,
}) => {
  return (
    <Dialog open={open} handler={onClose} size="sm">
      <DialogHeader className="main-bg text-white flex justify-between items-center">
        Performa Invoice Number
        <button onClick={onClose}>
          <IoIosCloseCircle className="text-2xl" />
        </button>
      </DialogHeader>

      <DialogBody className="space-y-4">
        <div className="flex flex-col gap-4">
          {/* Invoice Number */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Performa Invoice No
            </label>
            <Input
              type="text"
              value={currentInvoiceNo}
              disabled
              className="mt-1"
            />
          </div>

          {/* Start From */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Start From
            </label>
            <Input
              type="number"
              value={startFrom}
              onChange={(e) => setStartFrom(e.target.value)}
              placeholder="e.g. 1"
              className="mt-1"
            />
          </div>
        </div>
      </DialogBody>

      <DialogFooter className="gap-2">
        <Button variant="text" color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button className="main-bg text-white" onClick={onSave}>
          Save
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default InvoiceModal;
