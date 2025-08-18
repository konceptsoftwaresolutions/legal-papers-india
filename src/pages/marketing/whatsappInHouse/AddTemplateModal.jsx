import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  addChannel,
  getChannelQR,
  getChannelById,
} from "../../../redux/features/marketing";

const AddTemplateModal = ({ open, setOpen }) => {
  const [channelId, setChannelId] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const dispatch = useDispatch();

  // Redux state se data
  const { channelQR, channelDetails } = useSelector(
    (state) => state.marketing
  );

  // Cleanup jab modal band ho
  useEffect(() => {
    if (!open) {
      setChannelId("");
      setIsReady(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [open]);

  const handleSave = () => {
    if (!channelId.trim()) return;

    // 1. Add channel
    dispatch(
      addChannel(
        { channelId },
        (success) => {
          if (success) {
            // 2. Polling har 5 sec me
            intervalRef.current = setInterval(() => {
              // a) Fetch QR
              dispatch(getChannelQR(channelId, () => {}, setLoading));

              // b) Fetch channel status
              dispatch(
                getChannelById(
                  channelId,
                  (success, data) => {
                    if (success && data?.isReady) {
                      setIsReady(true);
                      clearInterval(intervalRef.current);
                    }
                  },
                  setLoading
                )
              );
            }, 5000);
          }
        },
        setLoading
      )
    );
  };

  return (
    <Dialog
      open={open}
      dismiss={{ enabled: false }}
      size="sm"
      className="rounded-xl"
    >
      {/* Header */}
      <DialogHeader className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          Add WhatsApp Channel
        </h2>
        <IoIosCloseCircle
          className="text-2xl cursor-pointer text-red-500 hover:text-red-600 transition"
          onClick={() => setOpen(false)}
        />
      </DialogHeader>

      {/* Body */}
      <DialogBody className="space-y-6">
        {/* Channel Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Channel ID
          </label>
          <input
            type="text"
            placeholder="Enter channel id"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:main-bg"
          />
        </div>

        {/* QR Image / Placeholder */}
        <div className="flex justify-center">
          {channelQR?.qrPng ? (
            <img
              src={channelQR.qrPng}
              alt="QR Code"
              className="w-40 h-40 border rounded-md shadow"
            />
          ) : (
            <p className="text-gray-400 text-sm italic">
              QR code will appear here after submission
            </p>
          )}
        </div>

        {/* Status */}
        {channelDetails && (
          <div className="text-center mt-4">
            {isReady ? (
              <p className="text-green-600 font-semibold">
                ✅ Channel is ready and added to the dropdown. Kindly select and
                use it.
              </p>
            ) : (
              <p className="text-gray-600 text-sm">
                Waiting for channel to be ready... (Status:{" "}
                {channelDetails?.status || "checking"})
              </p>
            )}
          </div>
        )}
      </DialogBody>

      {/* Footer */}
      <DialogFooter className="flex justify-end gap-2 border-t pt-2">
        <Button
          onClick={() => setOpen(false)}
          className="main-bg flex text-[14px] justify-center py-1 items-center gap-x-2 text-white"
        >
          Cancel
        </Button>
        <Button
          className="main-bg flex text-[14px] justify-center py-1 items-center gap-x-2 text-white"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Processing..." : "Save"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default AddTemplateModal;
