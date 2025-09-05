import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import useAxios from "../../hooks/useAxios";

const OTPModal = ({ open, onClose, userId, onSuccess }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const axiosInstance = useAxios();

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/superAdmin-otp-approval", {
        userId,
        otp,
      });

      if (res.data.token) {
        onSuccess(res.data.token, res.data.user);
      } else {
        toast.error("Invalid OTP, please try again.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} handler={onClose} size="sm" className="p-4">
      <DialogHeader>Enter OTP</DialogHeader>
      <DialogBody>
        <Input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          label="One Time Password"
          crossOrigin={undefined}
        />
      </DialogBody>
      <DialogFooter className="flex justify-end gap-3">
        <Button variant="outlined" color="red" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleVerifyOtp}
          disabled={loading}
          className="main-bg"
        >
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default OTPModal;
