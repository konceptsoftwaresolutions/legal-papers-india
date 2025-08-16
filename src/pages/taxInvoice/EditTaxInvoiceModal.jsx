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
import { Controller, useForm } from "react-hook-form";
import InputField from "../../components/fields/InputField";
import { useDispatch, useSelector } from "react-redux";
import {
  updateTaxInvoice,
  getOneTaxInvoice,
  getAllTaxInvoices,
} from "../../redux/features/tax";
import { pdf } from "@react-pdf/renderer";
import GenerateTaxPDF from "../leads/GenerateTaxPDF";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { quillModules, quillFormats } from "../leads/GenerateTaxModal";

const EditTaxInvoiceModal = ({ open, onClose, taxInvoiceId }) => {
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

  useEffect(() => {
    console.log("📌 useEffect triggered", { open, taxInvoiceId });

    if (open && taxInvoiceId) {
      console.log("🚀 Fetching invoice for ID:", taxInvoiceId);
      dispatch(
        getOneTaxInvoice(taxInvoiceId, (success, data) => {
          console.log("✅ getOneTaxInvoice callback:", { success, data });

          if (success && data?.data) {
            const invoice = data.data; // ✅ actual invoice object
            setExistingInvoice(invoice);
            reset({
              name: invoice.name || "_",
              mobileNumber: invoice.mobileNumber || "_",
              address: invoice.address || "",
              gstNo: invoice.gstNo || "",
              selectedServices: invoice.services?.map((s) => s.serviceId) || [],
              taxType: invoice.taxType || "",
              date: invoice.date?.split("T")[0] || getCurrentDate(),
              validUntil: invoice.validUntil?.split("T")[0] || "",
              invoiceNo: invoice.invoiceNo || "",
              quantities: (invoice.services || []).reduce(
                (acc, s) => ({ ...acc, [s.serviceId]: s.quantity || 1 }),
                {}
              ),
            });
            setTermsQuill(invoice.termsAndConditions || "");
            setValue("termsAndConditions", invoice.termsAndConditions || "");
          }
        })
      );
    }
  }, [open, taxInvoiceId, dispatch, reset, setValue]);

  // Auto-update terms from services
  useEffect(() => {
    const terms = selectedServiceIds
      .map((id) => services.find((s) => s._id === id)?.termsAndConditions || "")
      .filter(Boolean)
      .join("\n\n");
    setTermsQuill(terms);
  }, [selectedServiceIds, services]);

  // Ensure default quantity
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

      const invoiceNo = data.invoiceNo || existingInvoice?.invoiceNo || "";

      const taxData = {
        leadId: existingInvoice?.leadId,
        name: data.name,
        mobileNumber: data.mobileNumber,
        address: data.address,
        gstNo: data.gstNo,
        taxType: data.taxType,
        date: data.date,
        validUntil: data.validUntil,
        services: selectedServiceDetails,
        termsAndConditions: termsQuill,
        invoiceNo,
      };

      // Generate PDF
      const blob = await pdf(
        <GenerateTaxPDF formData={taxData} invoiceNo={invoiceNo} />
      ).toBlob();
      const pdfFileName = `TaxInvoice-${taxData.name}-${invoiceNo}.pdf`;
      const pdfFile = new File([blob], pdfFileName, {
        type: "application/pdf",
      });

      // FormData
      const formData = new FormData();
      formData.append("id", taxInvoiceId);
      formData.append("leadId", taxData.leadId);
      formData.append("name", taxData.name);
      formData.append("mobileNumber", taxData.mobileNumber);
      formData.append("address", taxData.address);
      formData.append("gstNo", taxData.gstNo || "");
      formData.append("taxType", taxData.taxType);
      formData.append("date", taxData.date);
      formData.append("validUntil", taxData.validUntil || "");
      formData.append("services", JSON.stringify(selectedServiceDetails));
      formData.append("invoiceNo", invoiceNo);
      formData.append("termsAndConditions", termsQuill);
      formData.append("pdfFile", pdfFile);

      await dispatch(updateTaxInvoice(taxInvoiceId, formData));
      dispatch(getAllTaxInvoices(existingInvoice?.leadId));
      toast.success("Tax Invoice Updated Successfully");
      onClose();
    } catch (error) {
      console.error("Update Tax Invoice Error:", error);
      toast.error(error.message || "Failed to update Tax Invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} handler={onClose} size="lg">
      <DialogHeader className="main-bg text-white flex justify-between items-center">
        Edit Tax Invoice
        <button onClick={onClose}>
          <IoIosCloseCircle className="text-2xl" />
        </button>
      </DialogHeader>

      <DialogBody className="max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-3 gap-4">
          <InputField
            name="invoiceNo"
            label="Invoice No"
            control={control}
            errors={errors}
            defaultValue={existingInvoice?.invoiceNo || ""}
            rules={{ required: "Invoice number is required" }}
          />

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

          {/* Address */}
          <div className="col-span-3">
            <label className="block font-semibold mb-2">Address</label>
            <Controller
              name="address"
              control={control}
              rules={{ required: "Address is required" }}
              render={({ field }) => (
                <ReactQuill
                  {...field}
                  value={field.value || ""}
                  onChange={(val) => field.onChange(val)}
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
        <Button
          variant="text"
          color="gray"
          onClick={onClose}
          disabled={isSubmitting}
        >
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

export default EditTaxInvoiceModal;
