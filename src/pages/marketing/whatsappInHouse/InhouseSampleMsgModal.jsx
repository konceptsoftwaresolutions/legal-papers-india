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
import { sendWAInHouseSampleMessage } from "../../../redux/features/marketing";

const InhouseSampleMsgModal = ({
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
      if (key.startsWith("variableDropdown_")) {
        const index = parseInt(key.replace("variableDropdown_", ""));
        const adjustedIndex = index + 1;

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
      sendWAInHouseSampleMessage(payload, setIsLoading, (success) => {
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
          <p>Sample Message Testing (In-House)</p>
          <button onClick={handleCloseModal} className="text-2xl">
            <IoIosCloseCircle />
          </button>
        </div>
      </DialogHeader>

      <DialogBody
        className="overflow-y-auto bg-transparent lg:p-5 flex justify-center items-center flex-col w-full"
        style={{ maxHeight: "calc(90vh - 64px)" }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="w-full grid gap-3">
          <InputField
            type="text"
            control={control}
            errors={errors}
            label="Enter Number"
            name="destination"
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
