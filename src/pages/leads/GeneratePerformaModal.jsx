import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { IoIosCloseCircle } from "react-icons/io";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import InputField from "../../components/fields/InputField";
import { useDispatch } from "react-redux";
import { createPerformaInvoice } from "../../redux/features/performa";

const GeneratePerformaModal = ({
  open,
  onClose,
  leadData,
  onSubmit,
  services = [],
}) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const selectedServiceIds = watch("selectedServices") || [];

  // Set current date as default
  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };
  const dispatch = useDispatch();

  useEffect(() => {
    if (leadData) {
      reset({
        name: leadData?.formData?.nameOfBusinessEntity || "_",
        mobileNumber: leadData?.formData?.mobileNumber || "_",
        address: leadData?.formData?.principalPlaceOfBusinessEntity || "",
        gstNo: "",
        selectedServices: [],
        taxType: "",
        date: getCurrentDate(),
        validUntil: "",
        quantities: {},
      });
    }
  }, [leadData, open, reset]);

  const onSubmitForm = (data) => {
    if (!data.name || !data.address) {
      toast.error("Name and Address are required");
      return;
    }

    const selectedServiceDetails = data.selectedServices.map((id) => {
      const service = services.find((s) => s._id === id);
      return {
        ...service,
        quantity: data.quantities?.[id] || 1,
      };
    });

    const payload = {
      ...data,
      leadId: leadData?._id,
      selectedServiceData: selectedServiceDetails,
    };

    dispatch(
      createPerformaInvoice(payload, (success, response) => {
        if (success) {
          toast.success("Invoice Generated Successfully");
          onClose(); // Close modal only on success
        } else {
          toast.error("Failed to generate invoice");
        }
      })
    );
  };

  return (
    <Dialog open={open} handler={onClose} size="md">
      <DialogHeader className="main-bg text-white flex justify-between items-center">
        Generate Performa Invoice
        <button onClick={onClose}>
          <IoIosCloseCircle className="text-2xl" />
        </button>
      </DialogHeader>

      <DialogBody>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            name="name"
            label="Name"
            control={control}
            errors={errors}
            disabled
          />
          <InputField
            name="mobileNumber"
            label="Mobile No"
            control={control}
            errors={errors}
          />
          <InputField
            name="address"
            label="Address"
            control={control}
            errors={errors}
          />
          <InputField
            name="gstNo"
            label="GST No"
            control={control}
            errors={errors}
          />
          <InputField
            name="selectedServices"
            label="Select Services"
            type="select"
            isMulti
            control={control}
            errors={errors}
            options={services.map((service) => ({
              value: service._id,
              label: service.name,
            }))}
          />
          <InputField
            name="taxType"
            label="Tax Type"
            type="select"
            control={control}
            errors={errors}
            options={[
              { value: "inter", label: "Inter-state (IGST)" },
              { value: "intra", label: "Intra-state (CGST + SGST)" },
            ]}
          />
          {/* New Date Fields */}
          <InputField
            name="date"
            label="Date"
            type="date"
            control={control}
            errors={errors}
          />
          <InputField
            name="validUntil"
            label="Valid Until"
            type="date"
            control={control}
            errors={errors}
          />
        </div>

        {/* Quantity fields based on selected services */}
        {selectedServiceIds?.length > 0 && (
          <div className="mt-6 space-y-4">
            <p className="font-semibold text-sm">Set Quantity for Services:</p>
            {selectedServiceIds.map((id) => {
              const service = services.find((s) => s._id === id);
              return (
                <InputField
                  key={id}
                  name={`quantities.${id}`}
                  label={`Quantity for ${service?.name || "Service"}`}
                  type="number"
                  control={control}
                  defaultValue={1}
                  rules={{ required: "Required" }}
                />
              );
            })}
          </div>
        )}
      </DialogBody>

      <DialogFooter className="gap-2">
        <Button variant="text" color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="main-bg text-white"
          onClick={handleSubmit(onSubmitForm)}
        >
          Generate
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default GeneratePerformaModal;
