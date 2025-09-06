import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Button,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch } from "react-redux";
import InputField from "../../../components/fields/InputField";
import { sendWAInHouseSampleMessage } from "../../../redux/features/marketing";
import { toast } from "react-toastify";

const InhouseSampleMsgModal = ({
  open,
  setOpen,
  selectedTemplate, // API response object
  selectedChannel, // full channel object
  sampleMessage,
  currentFormData,
  attachment,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (!open) {
      reset();
      setIsLoading(false);
    }
  }, [open, reset]);

  const renderSafeMessage = (msg) => {
    if (!msg) return "N/A";
    if (typeof msg === "string") return msg;
    if (msg?.message && typeof msg.message === "string") return msg.message;
    try {
      return JSON.stringify(msg, null, 2);
    } catch {
      return "N/A";
    }
  };

  // 🔹 Build variables payload
  const buildVariableData = () => {
    const variableData = {};
    if (!selectedTemplate?.template?.variables?.length) return variableData;
    selectedTemplate.template.variables.forEach((_, index) => {
      const dropdownVal = currentFormData[`variableDropdown_${index}`];
      const manualVal = currentFormData[`variableValue_${index}`];

      let finalVal = dropdownVal || manualVal || "";
      if (typeof finalVal === "object") finalVal = JSON.stringify(finalVal);
      if (finalVal) variableData[index + 1] = finalVal;
    });
    return variableData;
  };

  const onSubmit = (data) => {
    if (!data.sampleMobileNumber) {
      toast.error("Please enter a number!");
      return;
    }
    if (!selectedChannel?.channelId) {
      toast.error("Please select a valid channel!");
      return;
    }

    // 🔹 Create FormData
    const formData = new FormData();
    formData.append("sampleMobileNumber", data.sampleMobileNumber);
    formData.append("templateName", selectedTemplate?.template?.message || "");
    formData.append("channelId", selectedChannel.channelId);

    // Variables (convert object to JSON string)
    const variables = buildVariableData();
    formData.append("variables", JSON.stringify(variables));

    // Text message
    formData.append(
      "text",
      renderSafeMessage(sampleMessage || selectedTemplate?.template?.message)
    );

    // File attachment (if exists)
    if (attachment) {
      formData.append("file", attachment);
    }

    console.log("FormData payload:", formData);

    dispatch(
      sendWAInHouseSampleMessage(formData, setIsLoading, (success) => {
        if (success) {
          alert("Sample message sent successfully!");
          reset();
          setIsLoading(false);
          setOpen(false);
        } else {
          alert("Failed to send sample message!");
          setIsLoading(false);
        }
      })
    );
  };

  const handleCloseModal = () => {
    reset();
    setIsLoading(false);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      handler={handleCloseModal}
      className="rounded-lg overflow-hidden"
      style={{ maxHeight: "90vh", minWidth: "50%" }}
    >
      <DialogHeader className="text-xl primary-gradient text-white poppins-font main-bg">
        <div className="flex justify-between w-full items-center">
          <p>Sample Message Testing (In-House)</p>
          <button onClick={handleCloseModal} className="text-2xl">
            <IoIosCloseCircle />
          </button>
        </div>
      </DialogHeader>

      <DialogBody
        className="overflow-y-auto bg-transparent lg:p-5 flex flex-col w-full gap-4"
        style={{ maxHeight: "calc(90vh - 64px)" }}
      >
        <div className="border p-2 rounded bg-gray-50">
          <p>
            <strong>Template:</strong>{" "}
            {selectedTemplate?.template?.message || "N/A"}
          </p>
          <p>
            <strong>Channel:</strong>{" "}
            {selectedChannel
              ? `${selectedChannel.channelId} (${selectedChannel.phone})`
              : "N/A"}
          </p>
          <p>
            <strong>Sample Message:</strong>
          </p>
          <pre className="whitespace-pre-wrap border p-2 rounded bg-white">
            {renderSafeMessage(
              sampleMessage || selectedTemplate?.template?.message
            )}
          </pre>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full grid gap-3">
          <InputField
            type="text"
            control={control}
            errors={errors}
            label="Enter Number"
            name="sampleMobileNumber"
            placeholder="Enter recipient number"
          />
          <Button
            type="submit"
            loading={isLoading}
            className="capitalize main-bg w-max"
          >
            Send Sample Message
          </Button>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default InhouseSampleMsgModal;
