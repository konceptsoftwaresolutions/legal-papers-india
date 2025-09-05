import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Button,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import InputField from "../../components/fields/InputField";
import {
  leadSourceOptions,
  serviceCategoryOption,
  typeOfBusinessOptions,
} from "../../constants/options";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { addLead } from "../../redux/features/leads";
import toast from "react-hot-toast";
import useAxios from "../../hooks/useAxios";

const PasswordModal = ({ passModal, setPassModal, onSave }) => {
  const dispatch = useDispatch();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const axiosInstance = useAxios();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const handleCloseModal = () => {
    setPassModal(false);
    setOtpSent(false);
    setOtp("");
  };

  const onSubmit = async (data) => {
    if (!otpSent) {
      // Step 1: Password check
      if (data?.password !== "SharmaSarthak@666") {
        toast.error("Incorrect Password: Please try again.");
        handleCloseModal();
        return;
      }

      // Step 2: Generate OTP API call
      try {
        await axiosInstance.post("/api/generate-export-otp");
        toast.success("OTP sent to your registered email/phone");
        setOtpSent(true);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to generate OTP");
      }
    } else {
      // Step 3: Verify OTP API call
      try {
        const res = await axiosInstance.post("/api/verify-export-otp", { otp });
        toast.success("OTP verified successfully");
        handleCloseModal();

        // Step 4: Trigger export if verified
        onSave(data?.password);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Invalid OTP, try again");
      }
    }
  };

  return (
    <Dialog
      open={passModal}
      handler={handleCloseModal}
      className="addLeadModal rounded-lg overflow-hidden"
      style={{ maxHeight: "90vh", minWidth: "50%" }}
    >
      <DialogHeader className="text-xl primary-gradient text-white poppins-font main-bg">
        <div className="flex justify-between w-full items-center">
          {otpSent ? "Enter OTP" : "Password"}
          <button onClick={handleCloseModal} className="text-2xl">
            <IoIosCloseCircle />
          </button>
        </div>
      </DialogHeader>
      <DialogBody
        className="overflow-y-auto bg-transparent lg:p-5"
        style={{ maxHeight: "calc(90vh - 64px)" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4">
            {!otpSent ? (
              <InputField
                control={control}
                name="password"
                errors={errors}
                label="Password"
                type="password"
              />
            ) : (
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="border rounded-lg p-2 w-full"
              />
            )}
            <Button type="submit" className="main-bg mt-3">
              {otpSent ? "Verify OTP" : "Save"}
            </Button>
          </div>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default PasswordModal;
