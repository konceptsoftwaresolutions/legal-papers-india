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
  createTaxInvoice,
  getAllTaxInvoices,
  incrementInvoice, // ✅ Add this for invoice number
} from "../../redux/features/tax";
import { pdf } from "@react-pdf/renderer";
import GenerateTaxPDF from "./GenerateTaxPDF";
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

const GenerateTaxModal = ({ open, onClose, leadData }) => {
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

  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  const placeOfSupply = watch("placeOfSupply");

  useEffect(() => {
    if (!placeOfSupply) return;

    const [stateCode] = placeOfSupply.split("-"); // e.g., "07-Delhi" => ["07", "Delhi"]

    if (stateCode === "07") {
      setValue("taxType", "intra"); // auto-select intra-state
    } else {
      setValue("taxType", "inter"); // auto-select inter-state for other states
    }
  }, [placeOfSupply, setValue]);

  // Auto-update Terms & Conditions based on selected services
  useEffect(() => {
    setTermsQuill(
      selectedServiceIds
        .map(
          (id) => services.find((s) => s._id === id)?.termsAndConditions || ""
        )
        .filter(Boolean)
        .join("\n\n")
    );

    // Update RHF state
    setValue(
      "termsAndConditions",
      selectedServiceIds
        .map(
          (id) => services.find((s) => s._id === id)?.termsAndConditions || ""
        )
        .filter(Boolean)
        .join("\n\n")
    );
  }, [selectedServiceIds, services, setValue]);

  // Ensure each selected service has a default quantity
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

  // Autofill form when modal opens
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

      // 1️⃣ Get invoice number from API
      const invoiceResponse = await dispatch(incrementInvoice("TaxInvoice"));
      const currentData = invoiceResponse?.data;
      const invoiceNo = currentData
        ? `${currentData.prefix}-${currentData.currentNumber}`
        : "INV-ERROR";

      // 2️⃣ Prepare services with base calculations only
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

      // 3️⃣ Calculate totals WITH PROPER DISCOUNT LOGIC ✅
      const taxableValues = selectedServiceDetails.reduce(
        (sum, s) => sum + s.baseAmount,
        0
      );

      // ✅ Apply discount BEFORE GST calculation
      const discount = parseFloat(data.discount) || 0;
      const taxableValue = taxableValues - discount;

      // ✅ Calculate GST on discounted amount
      let totalTax = 0;

      selectedServiceDetails.forEach((service) => {
        // Calculate proportional discount for each service
        const serviceDiscount = (service.baseAmount / taxableValues) * discount;
        const serviceNetAmount = service.baseAmount - serviceDiscount;
        const taxRate = service?.taxRate || 18;

        if (data.taxType === "intra") {
          totalTax += (serviceNetAmount * taxRate) / 100; // CGST + SGST combined
        } else if (data.taxType === "inter") {
          totalTax += (serviceNetAmount * taxRate) / 100; // IGST
        }
      });

      const invoiceTotal = taxableValue + totalTax;

      // 4️⃣ Prepare payload with minimal totals structure ✅
      const taxInvoiceData = {
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
        termsAndConditions: termsQuill,
        invoiceNo,
        discount,
        totals: {
          taxableValue, // ✅ Amount after discount: 600
          totalTax, // ✅ Total GST: 108
          invoiceTotal, // ✅ Final total: 708
        },
      };

      console.log("🧾 Tax Invoice Payload:", taxInvoiceData);

      // Rest of the code remains same...
      const blob = await pdf(
        <GenerateTaxPDF formData={taxInvoiceData} invoiceNo={invoiceNo} />
      ).toBlob();
      const pdfFileName = `TaxInvoice-${
        taxInvoiceData.name || "Unknown"
      }-${invoiceNo}.pdf`;
      const pdfFile = new File([blob], pdfFileName, {
        type: "application/pdf",
      });

      const formData = new FormData();
      formData.append("leadId", taxInvoiceData.leadId);
      formData.append("name", taxInvoiceData.name);
      formData.append("mobileNumber", taxInvoiceData.mobileNumber);
      formData.append("address", taxInvoiceData.address);
      formData.append("gstNo", taxInvoiceData.gstNo || "");
      formData.append("taxType", taxInvoiceData.taxType);
      formData.append("placeOfSupply", taxInvoiceData.placeOfSupply);
      formData.append("date", taxInvoiceData.date);
      formData.append("validUntil", taxInvoiceData.validUntil || "");
      formData.append("services", JSON.stringify(selectedServiceDetails));
      formData.append("invoiceNo", invoiceNo);
      formData.append("discount", discount);
      formData.append(
        "termsAndConditions",
        taxInvoiceData.termsAndConditions || ""
      );
      formData.append("totals", JSON.stringify(taxInvoiceData.totals)); // ✅ Minimal totals
      formData.append("pdfFile", pdfFile);

      await dispatch(
        createTaxInvoice(formData, (success) => {
          if (success) {
            onClose();
          }
        })
      );
      dispatch(getAllTaxInvoices(leadData?._id));
    } catch (error) {
      console.error("Tax invoice error:", error);
      toast.error(error.message || "Failed to create Tax Invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} handler={onClose} size="lg">
      <DialogHeader className="main-bg text-white flex justify-between items-center">
        Generate Tax Invoice
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

          {/* <InputField
            name="amountPaid"
            label="Amount Paid"
            type="number"
            control={control}
            errors={errors}
            rules={{ required: "Amount Paid is required" }}
          /> */}

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

          {/* Services Multi-select */}
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

          {/* Quantities */}
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
            control={control}
            errors={errors}
            options={[
              { value: "inter", label: "Inter-state (IGST)" },
              { value: "intra", label: "Intra-state (CGST + SGST)" },
            ]}
            mode="single"
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
          <InputField
            name="discount"
            label="Discount"
            type="number"
            control={control}
            errors={errors}
          />

          {/* Terms & Conditions */}
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
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    setTermsQuill(value);
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
          {isSubmitting ? "Generating..." : "Generate"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default GenerateTaxModal;
