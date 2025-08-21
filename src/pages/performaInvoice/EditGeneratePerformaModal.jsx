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
import { useForm, Controller } from "react-hook-form";
import InputField from "../../components/fields/InputField";
import { useDispatch, useSelector } from "react-redux";
import {
  getOnePerformaInvoice,
  editPerformaInvoice,
} from "../../redux/features/performa";
import { pdf } from "@react-pdf/renderer";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import GeneratePerformaPDF from "../leads/GeneratePerformaPDF";
import { gstStates } from "../../constants/gstStates";

export const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["link", "image", "code-block"],
    ["clean"],
  ],
};

export const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "color",
  "background",
  "link",
  "image",
  "code-block",
];

const EditGeneratePerformaModal = ({ open, onClose, invoiceId }) => {
  const dispatch = useDispatch();
  const services = useSelector((state) => state.services?.services || []);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const selectedServiceIds = watch("selectedServices") || [];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsQuill, setTermsQuill] = useState("");
  const [existingInvoice, setExistingInvoice] = useState(null);

  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  // Fetch invoice data when modal opens
  useEffect(() => {
    if (open && invoiceId) {
      dispatch(
        getOnePerformaInvoice(invoiceId, (success, data) => {
          if (success && data) {
            setExistingInvoice(data);
            // Pre-fill form
            reset({
              name: data.name || "_",
              mobileNumber: data.mobileNumber || "_",
              address: data.address || "",
              gstNo: data.gstNo || "",
              selectedServices: data.services?.map((s) => s.serviceId) || [],
              taxType: data.taxType || "",
              date: data.date?.split("T")[0] || getCurrentDate(),
              validUntil: data.validUntil?.split("T")[0] || "",
              invoiceNo: data.invoiceNo || "",
              quantities: (data.services || []).reduce(
                (acc, s) => ({ ...acc, [s.serviceId]: s.quantity || 1 }),
                {}
              ),
            });
            // ✅ Set the full termsAndConditions from saved invoice
            setTermsQuill(data.termsAndConditions || "");
            setValue("termsAndConditions", data.termsAndConditions || "");
          }
        })
      );
    }
  }, [open, invoiceId, dispatch, reset]);

  // Update termsQuill when selected services change
  useEffect(() => {
    const terms = selectedServiceIds
      .map((id) => services.find((s) => s._id === id)?.termsAndConditions || "")
      .filter(Boolean)
      .join("\n\n");
    setTermsQuill(terms);
  }, [selectedServiceIds, services]);

  // Ensure quantity fields exist
  useEffect(() => {
    selectedServiceIds.forEach((id) => {
      if (watch(`quantities.${id}`) === undefined) {
        setValue(`quantities.${id}`, 1);
      }
    });
  }, [selectedServiceIds, setValue, watch]);

  const onSubmitForm = async (data) => {
    if (!data.name || !data.address) {
      toast.error("Name and Address are required");
      return;
    }
    if (!data.selectedServices?.length) {
      toast.error("Please select at least one service");
      return;
    }

    try {
      setIsSubmitting(true);

      const selectedServiceDetails = data.selectedServices.map((id) => {
        const service = services.find((s) => s._id === id);
        return { ...service, quantity: data.quantities?.[id] || 1 };
      });

      // Make sure invoiceNo exists
      const invoiceNo = data.invoiceNo || existingInvoice?.invoiceNo || "";
      console.log("✅ Formatted Invoice No:", invoiceNo);

      // Prepare payload
      const pi = {
        name: data.name,
        mobileNumber: data.mobileNumber,
        address: data.address,
        gstNo: data.gstNo,
        taxType: data.taxType,
        placeOfSupply: data.placeOfSupply,
        date: data.date,
        validUntil: data.validUntil,
        services: selectedServiceDetails,
        termsAndConditions: termsQuill,
        invoiceNo: invoiceNo,
      };
      console.log("Payload for backend:", pi);
      // Generate PDF
      const blob = await pdf(
        <GeneratePerformaPDF formData={pi} invoiceNo={invoiceNo} />
      ).toBlob();
      const pdfFileName = `PerformaInvoice-${
        pi.name || "Unknown"
      }-${invoiceNo}.pdf`;
      const pdfFile = new File([blob], pdfFileName, {
        type: "application/pdf",
      });

      // Prepare FormData
      const formData = new FormData();
      formData.append("id", invoiceId);
      formData.append("name", pi.name);
      formData.append("mobileNumber", pi.mobileNumber);
      formData.append("address", pi.address);
      formData.append("gstNo", pi.gstNo || "");
      formData.append("taxType", pi.taxType);
      formData.append("date", pi.date);
      formData.append("validUntil", pi.validUntil || "");
      formData.append("placeOfSupply", pi.placeOfSupply);
      formData.append("services", JSON.stringify(selectedServiceDetails));
      formData.append("invoiceNo", invoiceNo); // append invoiceNo explicitly
      formData.append("termsAndConditions", termsQuill); // ✅ append terms
      formData.append("pdfFile", pdfFile);

      await dispatch(editPerformaInvoice(invoiceId, formData));
      onClose();
    } catch (err) {
      console.error("Edit Performa invoice error:", err);
      toast.error(err.message || "Failed to edit invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} handler={onClose} size="lg">
      <DialogHeader className="main-bg text-white flex justify-between items-center">
        Edit Performa Invoice
        <button onClick={onClose}>
          <IoIosCloseCircle className="text-2xl" />
        </button>
      </DialogHeader>

      <DialogBody className="max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-3 gap-4">
          <InputField
            name="name"
            label="Name"
            control={control}
            errors={errors}
          />
          <InputField
            name="mobileNumber"
            label="Mobile No"
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
            name="invoiceNo"
            label="Invoice No"
            control={control}
            errors={errors}
            defaultValue={existingInvoice?.invoiceNo || ""}
            rules={{ required: "Invoice number is required" }}
          />

          <InputField
            name="placeOfSupply"
            label="Place of Supply"
            type="select"
            mode="single"
            control={control}
            errors={errors}
            options={gstStates.map((state) => ({
              value: `${state.code}-${state.name}`,
              label: `${state.code}-${state.name}`,
            }))}
          />

          <div className="col-span-3">
            <label className="block font-semibold mb-2">Address</label>
            <Controller
              name="address"
              control={control}
              rules={{ required: "Address is required" }}
              render={({ field }) => (
                <ReactQuill
                  {...field}
                  value={field.value || termsQuill}
                  onChange={(val) => {
                    field.onChange(val);
                    setTermsQuill(val);
                  }}
                  theme="snow"
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white"
                  style={{
                    minHeight: "100px",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                />
              )}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="col-span-3">
            <InputField
              name="selectedServices"
              label="Select Services"
              type="select"
              isMulti
              control={control}
              errors={errors}
              options={services.map((s) => ({ value: s._id, label: s.name }))}
            />
          </div>

          {selectedServiceIds?.length > 0 && (
            <div className="col-span-3 space-y-4">
              {selectedServiceIds.map((id) => {
                const service = services.find((s) => s._id === id);
                return (
                  <div key={id} className="flex items-center gap-4">
                    <span className="flex-1 font-medium">
                      {service?.name || "Service"}
                    </span>
                    <div className="w-24">
                      <InputField
                        name={`quantities.${id}`}
                        label="Qty"
                        type="number"
                        control={control}
                        errors={errors}
                        defaultValue={watch(`quantities.${id}`) ?? 1}
                        rules={{ required: "Required" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <InputField
            name="taxType"
            label="Tax Type"
            type="select"
            mode="single"
            control={control}
            errors={errors}
            options={[
              { value: "inter", label: "Inter-state (IGST)" },
              { value: "intra", label: "Intra-state (CGST + SGST)" },
            ]}
          />
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

          <div className="col-span-3 mt-4">
            <label className="block font-semibold mb-2">
              Terms & Conditions
            </label>
            <Controller
              name="termsAndConditions"
              control={control}
              rules={{ required: "Terms & Conditions are required" }}
              render={({ field }) => (
                <ReactQuill
                  {...field}
                  value={field.value || termsQuill}
                  onChange={(val) => {
                    field.onChange(val);
                    setTermsQuill(val);
                  }}
                  theme="snow"
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white text-black"
                  style={{
                    minHeight: "120px",
                    maxHeight: "250px",
                    overflowY: "auto",
                  }}
                />
              )}
            />
            {errors.termsAndConditions && (
              <p className="text-red-500 text-sm mt-1">
                {errors.termsAndConditions.message}
              </p>
            )}
          </div>
        </div>
      </DialogBody>

      <DialogFooter className="gap-2">
        <Button variant="text" color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="main-bg text-white flex items-center justify-center gap-2"
          onClick={handleSubmit(onSubmitForm)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Invoice"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default EditGeneratePerformaModal;
