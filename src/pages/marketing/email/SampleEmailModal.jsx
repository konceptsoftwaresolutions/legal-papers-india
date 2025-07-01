import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Button,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";

import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import InputField from "../../../components/fields/InputField";
import { sendEmailSampleMessage } from "../../../redux/features/marketing";

const SampleEmailModal = ({
  open,
  setOpen,
  setSubmitAction,
  currentFormData,
  selectedTemplateData,
}) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const handleCloseModal = () => {
    setOpen(false);
  };

  const onSubmit = (data) => {
    const variableData = {};

    Object.entries(currentFormData).forEach(([key, value]) => {
      // Check if the key starts with 'variableDropdown_' or 'variableValue_'
      if (key.startsWith("variableDropdown_")) {
        const index = parseInt(key.replace("variableDropdown_", "")); // Get the index number

        // Increment the index to start from 1
        const adjustedIndex = index + 1;

        // Use 'variableDropdown' first, or fallback to 'variableValue'
        const dropdownKey = `variableDropdown_${index}`;
        const valueKey = `variableValue_${index}`;

        if (currentFormData[dropdownKey]) {
          variableData[adjustedIndex] = currentFormData[dropdownKey];
        } else if (currentFormData[valueKey]) {
          variableData[adjustedIndex] = currentFormData[valueKey];
        }
      }
    });

    const payload = {
      ...data,
      campaignName: selectedTemplateData?.campaignName,
      leadId: currentFormData?.leadId,
      variables: variableData,
    };

    dispatch(
      sendEmailSampleMessage(payload, setIsLoading, (success) => {
        if (success) {
          reset();
          handleCloseModal();
        }
      })
    );
  };

  return (
    <Dialog
      open={open}
      handler={handleCloseModal}
      className="addLeadModal rounded-lg overflow-hidden"
      style={{ maxHeight: "90vh", minWidth: "50%" }}
    >
      <DialogHeader className="text-xl primary-gradient text-white poppins-font main-bg">
        <div className="flex justify-between w-full items-center">
          {/* Password */}
          <p>Sample Email Testing</p>
          <button onClick={handleCloseModal} className="text-2xl">
            <IoIosCloseCircle />
          </button>
        </div>
      </DialogHeader>
      <DialogBody
        className="overflow-y-auto bg-transparent lg:p-5 flex justify-center items-center flex-col w-full  "
        style={{ maxHeight: "calc(90vh - 64px)" }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="w-full grid gap-3">
          <InputField
            type="email"
            control={control}
            errors={errors}
            label="Enter Email"
            name="destination"
          />
          <Button
            type="submit"
            loading={isLoading}
            className="capitalize main-bg w-max"
          >
            Send Sample Email
          </Button>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default SampleEmailModal;
