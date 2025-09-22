// Create new file: PasswordModal.js (for NC Bucket)
import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Button,
  Spinner,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import InputField from "../../components/fields/InputField";
import { IoIosCloseCircle } from "react-icons/io";
import toast from "react-hot-toast";
import useAxios from "../../hooks/useAxios";

const AssignedNCBucketPasswordModal = ({ passModal, setPassModal, onSave }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const axiosInstance = useAxios();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const handleCloseModal = () => {
    setPassModal(false);
    setOtpSent(false);
    setOtp("");
    setLoading(false);
    reset();
  };

  const onSubmit = async (data) => {
    if (!otpSent) {
      // Step 1: Password check
      if (data?.password !== "SharmaSarthak@666") {
        toast.error("Incorrect Password: Please try again.");
        handleCloseModal();
        return;
      }

      setLoading(true);

      // Step 2: Generate OTP API call
      try {
        await axiosInstance.post("/api/generate-export-otppp");
        toast.success("OTP sent to your registered email/phone");
        setOtpSent(true);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to generate OTP");
        handleCloseModal();
      } finally {
        setLoading(false);
      }
    } else {
      // Step 3: Verify OTP API call
      if (!otp || otp.length < 4) {
        toast.error("Please enter a valid OTP");
        return;
      }

      setLoading(true);

      try {
        const res = await axiosInstance.post("/api/verify-export-otppp", { otp });
        toast.success("OTP verified successfully");
        handleCloseModal();

        // Step 4: Trigger export if verified
        await onSave(data?.password);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Invalid OTP, try again");
        setOtp(""); // Clear OTP on error
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog
      open={passModal}
      handler={handleCloseModal}
      className="addLeadModal rounded-lg overflow-hidden"
      style={{ maxHeight: "90vh", minWidth: "50%" }}
      dismiss={{ enabled: !loading }} // Prevent closing during loading
    >
      <DialogHeader className="text-xl primary-gradient text-white poppins-font main-bg">
        <div className="flex justify-between w-full items-center">
          {otpSent
            ? "Enter OTP - NC Bucket Export"
            : "Password - NC Bucket Export"}
          {!loading && (
            <button
              onClick={handleCloseModal}
              className="text-2xl hover:text-gray-300"
            >
              <IoIosCloseCircle />
            </button>
          )}
        </div>
      </DialogHeader>

      <DialogBody
        className="overflow-y-auto bg-transparent lg:p-5"
        style={{ maxHeight: "calc(90vh - 64px)" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4">
            {!otpSent ? (
              // Password Input
              <div>
                <InputField
                  control={control}
                  name="password"
                  errors={errors}
                  label="Enter Password to Export NC Bucket Data"
                  type="password"
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  }}
                  disabled={loading}
                />
                <p className="text-sm text-gray-600 mt-2">
                  This action will export Assigned NC Bucket leads data
                </p>
              </div>
            ) : (
              // OTP Input
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter 6-digit OTP sent to your registered email/phone
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, ""); // Only numbers
                    if (value.length <= 6) {
                      setOtp(value);
                    }
                  }}
                  placeholder="Enter 6-digit OTP"
                  className="border border-gray-300 rounded-lg p-3 w-full text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={6}
                  disabled={loading}
                  autoComplete="one-time-code"
                />
                <p className="text-sm text-gray-600 mt-2 text-center">
                  {`${otp.length}/6 digits entered`}
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="main-bg mt-4 flex items-center justify-center gap-2"
              disabled={loading || (otpSent && otp.length < 4)}
              size="lg"
            >
              {loading && <Spinner className="h-4 w-4" color="white" />}
              {loading
                ? otpSent
                  ? "Verifying OTP..."
                  : "Generating OTP..."
                : otpSent
                ? "Verify OTP & Export"
                : "Generate OTP"}
            </Button>

            {otpSent && !loading && (
              <Button
                type="button"
                variant="text"
                className="text-blue-500 hover:bg-blue-50 mt-2"
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                }}
              >
                Back to Password
              </Button>
            )}
          </div>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default AssignedNCBucketPasswordModal;
