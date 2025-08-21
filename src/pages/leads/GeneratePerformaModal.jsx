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
  createPerformaInvoice,
  incrementInvoice,
} from "../../redux/features/performa";
import GeneratePerformaPDF from "./GeneratePerformaPDF";
import { pdf } from "@react-pdf/renderer";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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

const GeneratePerformaModal = ({ open, onClose, leadData }) => {
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
  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  const [termsQuill, setTermsQuill] = useState("");
  useEffect(() => {
    // Update termsQuill whenever selected services change
    const terms = selectedServiceIds
      .map((id) => services.find((s) => s._id === id)?.termsAndConditions || "")
      .filter(Boolean)
      .join("\n\n"); // ya <br> agar HTML formatting chahiye
    setTermsQuill(terms);
  }, [selectedServiceIds, services]);

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
        quantities: services.reduce((acc, s) => ({ ...acc, [s._id]: 1 }), {}),
        prices: services.reduce(
          (acc, s) => ({ ...acc, [s._id]: s.price || 0 }),
          {}
        ),
      });
    }
  }, [leadData, open, reset, services]);

  useEffect(() => {
    selectedServiceIds.forEach((id) => {
      if (watch(`quantities.${id}`) === undefined) {
        setValue(`quantities.${id}`, 1);
      }
      if (watch(`prices.${id}`) === undefined) {
        const service = services.find((s) => s._id === id);
        setValue(`prices.${id}`, service?.price || 0);
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

      // Step 1: Get invoice number
      const invoiceResponse = await dispatch(incrementInvoice("Proforma"));
      const currentData = invoiceResponse?.data;

      const invoiceNo = currentData
        ? `${currentData.prefix}-${currentData.currentNumber}`
        : "INV-ERROR";

      // Step 2: Prepare service details (without individual GST)
      const selectedServiceDetails = data.selectedServices.map((id) => {
        const service = services.find((s) => s._id === id);
        const quantity = data.quantities?.[id] || 1;
        const price = data.prices?.[id] || service.price || 0;
        const baseAmount = quantity * price;
        return {
          ...service,
          quantity,
          price,
          baseAmount,
        };
      });

      // 👉 Step 3: Calculate TOTAL TAX
      let taxableValue = 0,
        sgst = 0,
        cgst = 0,
        igst = 0;

      selectedServiceDetails.forEach((srv) => {
        taxableValue += srv.baseAmount;
        const taxRate = srv?.taxRate || 18; // default 18%

        if (data.taxType === "intra") {
          sgst += (srv.baseAmount * (taxRate / 2)) / 100;
          cgst += (srv.baseAmount * (taxRate / 2)) / 100;
        } else if (data.taxType === "inter") {
          igst += (srv.baseAmount * taxRate) / 100;
        }
      });

      const totalTax = sgst + cgst + igst;
      const invoiceTotal = taxableValue + totalTax;

      // Step 4: Prepare PI payload
      const pi = {
        leadId: leadData?._id,
        name: data.name,
        mobileNumber: data.mobileNumber,
        address: data.address,
        gstNo: data.gstNo,
        taxType: data.taxType,
        placeOfSupply: data.placeOfSupply,
        date: data.date,
        validUntil: data.validUntil,
        services: selectedServiceDetails,
        totals: {
          taxableValue,
          sgst,
          cgst,
          igst,
          totalTax,
          invoiceTotal,
        },
        termsAndConditions: termsQuill,
        invoiceNo,
      };

      console.log("📝 PI Payload:", pi);

      // Step 5: Generate PDF
      const blob = await pdf(
        <GeneratePerformaPDF formData={pi} invoiceNo={invoiceNo} />
      ).toBlob();
      const pdfFileName = `PerformaInvoice-${
        pi.name || "Unknown"
      }-${invoiceNo}.pdf`;

      const pdfFile = new File([blob], pdfFileName, {
        type: "application/pdf",
      });

      // Step 6: Prepare FormData
      const formData = new FormData();
      formData.append("leadId", pi.leadId);
      formData.append("name", pi.name);
      formData.append("mobileNumber", pi.mobileNumber);
      formData.append("address", pi.address);
      formData.append("gstNo", pi.gstNo || "");
      formData.append("taxType", pi.taxType);
      formData.append("date", pi.date);
      formData.append("validUntil", pi.validUntil || "");
      formData.append("placeOfSupply", pi.placeOfSupply);
      formData.append("services", JSON.stringify(selectedServiceDetails));
      formData.append("invoiceNo", invoiceNo);
      formData.append("termsAndConditions", pi.termsAndConditions || "");
      formData.append("totals", JSON.stringify(pi.totals)); // ✅ only totals added
      formData.append("pdfFile", pdfFile);

      // Step 7: Dispatch create invoice
      await dispatch(
        createPerformaInvoice(formData, (success) => {
          if (success) {
            onClose();
          }
        })
      );
    } catch (error) {
      console.error("Performa invoice error:", error);
      toast.error(error.message || "Failed to create Performa Invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} handler={onClose} size="lg">
      <DialogHeader className="main-bg text-white flex justify-between items-center">
        Generate Performa Invoice
        <button onClick={onClose}>
          <IoIosCloseCircle className="text-2xl" />
        </button>
      </DialogHeader>

      <DialogBody className="max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-3 gap-4">
          {/* Name, Mobile, GST */}
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

          {/* Address - full width */}
          <div className="col-span-3">
            <label className="block font-semibold mb-2">Address</label>
            <Controller
              name="address"
              control={control}
              rules={{ required: "Address is required" }}
              render={({ field }) => (
                <ReactQuill
                  {...field}
                  onChange={field.onChange}
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

          {/* Services multi-select */}
          <div className="col-span-3">
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
          </div>

          {/* Quantity fields for selected services */}
          {selectedServiceIds?.length > 0 && (
            <div className="col-span-3 space-y-4">
              {selectedServiceIds.map((id) => {
                const service = services.find((s) => s._id === id);
                return (
                  <div key={id} className="flex items-center gap-4">
                    <span className="flex-1 font-medium">
                      {service?.name || "Service"}
                    </span>

                    {/* Qty Input */}
                    <div className="w-20">
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

                    {/* Price Input */}
                    <div className="w-28">
                      <InputField
                        name={`prices.${id}`}
                        label="Price"
                        type="number"
                        control={control}
                        errors={errors}
                        defaultValue={
                          watch(`prices.${String(id)}`) ?? service?.price ?? 0
                        }
                        rules={{ required: "Required" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tax Type, Date, Valid Until */}
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
              render={({ field }) => (
                <ReactQuill
                  {...field}
                  value={field.value || termsQuill} // field.value se form state manage
                  onChange={(value) => {
                    field.onChange(value); // RHF ke liye update
                    setTermsQuill(value); // local state bhi update
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
          {isSubmitting ? "Generating..." : "Generate"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default GeneratePerformaModal;
