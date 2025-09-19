import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Spinner,
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
  const [loading, setLoading] = useState(false);
  const [isFormLoaded, setIsFormLoaded] = useState(false); // ✅ NEW STATE

  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  // ✅ Auto-update tax type based on place of supply
  const placeOfSupply = watch("placeOfSupply");

  useEffect(() => {
    if (!placeOfSupply || !isFormLoaded) return; // ✅ CHECK IF FORM IS LOADED

    const [stateCode] = placeOfSupply.split("-");
    console.log("🔍 Place of Supply Changed:", { placeOfSupply, stateCode });

    if (stateCode === "07") {
      setValue("taxType", "intra");
    } else {
      setValue("taxType", "inter");
    }
  }, [placeOfSupply, setValue, isFormLoaded]);

  // ✅ Fetch invoice data when modal opens
  useEffect(() => {
    console.log("📌 useEffect triggered", { open, invoiceId });

    if (open && invoiceId) {
      setLoading(true);
      setIsFormLoaded(false); // ✅ RESET FORM LOADED STATE

      dispatch(
        getOnePerformaInvoice(invoiceId, (success, data) => {
          console.log("✅ getOnePerformaInvoice callback:", { success, data });

          if (success && data) {
            console.log("🧾 Invoice Data:", data);
            console.log("📋 Terms from API:", data.termsAndConditions);

            setExistingInvoice(data);

            // ✅ Set termsQuill FIRST
            const existingTerms = data.termsAndConditions || "";
            console.log("📝 Setting Terms:", existingTerms);
            setTermsQuill(existingTerms);

            // ✅ Reset form with all data including discount and placeOfSupply
            const formData = {
              name: data.name || "_",
              mobileNumber: data.mobileNumber || "_",
              address: data.address || "",
              gstNo: data.gstNo || "",
              placeOfSupply: data.placeOfSupply || "", // ✅ ADDED
              selectedServices: data.services?.map((s) => s.serviceId) || [],
              taxType: data.taxType || "",
              date: data.date?.split("T")[0] || getCurrentDate(),
              validUntil: data.validUntil?.split("T")[0] || "",
              invoiceNo: data.invoiceNo || "",
              discount: data.discount || 0, // ✅ ADDED
              quantities: (data.services || []).reduce(
                (acc, s) => ({ ...acc, [s.serviceId]: s.quantity || 1 }),
                {}
              ),
              prices: (data.services || []).reduce(
                (acc, s) => ({ ...acc, [s.serviceId]: s.price || 0 }),
                {}
              ),
              termsAndConditions: existingTerms, // ✅ SET IN FORM
            };

            console.log("🎯 Form Data to Reset:", formData);
            reset(formData);

            // ✅ Also set via setValue after small delay
            setTimeout(() => {
              console.log("⏰ Setting Terms via setValue:", existingTerms);
              setValue("termsAndConditions", existingTerms);
              setIsFormLoaded(true); // ✅ MARK FORM AS LOADED
            }, 100);
          }
          setLoading(false);
        })
      );
    }
  }, [open, invoiceId, dispatch, reset, setValue]);

  // ✅ Modified Terms auto-update - only for NEW selections
  useEffect(() => {
    console.log("🔄 Services Selection Changed:", {
      selectedServiceIds,
      hasExistingTerms: !!existingInvoice?.termsAndConditions,
      isFormLoaded,
    });

    // Only auto-update if:
    // 1. Form is loaded
    // 2. No existing terms OR we're adding new services
    if (isFormLoaded && !existingInvoice?.termsAndConditions) {
      const terms = selectedServiceIds
        .map(
          (id) => services.find((s) => s._id === id)?.termsAndConditions || ""
        )
        .filter(Boolean)
        .join("\n\n");

      console.log("🆕 Auto-updating Terms:", terms);
      setTermsQuill(terms);
      setValue("termsAndConditions", terms);
    }
  }, [
    selectedServiceIds,
    services,
    setValue,
    existingInvoice?.termsAndConditions,
    isFormLoaded,
  ]);

  // ✅ Ensure default quantity & price
  useEffect(() => {
    if (!isFormLoaded) return;

    selectedServiceIds.forEach((id) => {
      if (watch(`quantities.${id}`) === undefined) {
        setValue(`quantities.${id}`, 1);
      }
      if (watch(`prices.${id}`) === undefined) {
        const service = services.find((s) => s._id === id);
        setValue(`prices.${id}`, service?.price || 0);
      }
    });
  }, [selectedServiceIds, setValue, watch, services, isFormLoaded]);

  // ✅ Debug watch values
  useEffect(() => {
    const termsValue = watch("termsAndConditions");
    console.log("👀 Watching Terms Value:", termsValue);
    console.log("📝 Current termsQuill State:", termsQuill);
  }, [watch("termsAndConditions"), termsQuill]);

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

      // ✅ Prepare services with base calculations
      const selectedServiceDetails = data.selectedServices.map((id) => {
        const service = services.find((s) => s._id === id);
        const quantity = data.quantities?.[id] || 1;
        const price = data.prices?.[id] || service?.price || 0;
        const baseAmount = quantity * price;

        return {
          ...service,
          quantity,
          price,
          baseAmount,
        };
      });

      // ✅ Calculate totals WITH SIMPLIFIED DISCOUNT LOGIC
      const originalAmount = selectedServiceDetails.reduce(
        (sum, srv) => sum + srv.baseAmount,
        0
      );

      // ✅ Apply discount BEFORE GST calculation
      const discount = parseFloat(data.discount) || 0;
      const taxableValue = originalAmount - discount; // ✅ Net amount after discount

      // ✅ Calculate total tax on discounted amount
      let totalTax = 0;

      selectedServiceDetails.forEach((srv) => {
        // Calculate proportional discount for each service
        const serviceDiscount = (srv.baseAmount / originalAmount) * discount;
        const serviceNetAmount = srv.baseAmount - serviceDiscount;
        const taxRate = srv?.taxRate || 18; // default 18%

        if (data.taxType === "intra") {
          totalTax += (serviceNetAmount * taxRate) / 100; // CGST + SGST combined
        } else if (data.taxType === "inter") {
          totalTax += (serviceNetAmount * taxRate) / 100; // IGST
        }
      });

      const invoiceTotal = taxableValue + totalTax;

      const invoiceNo = data.invoiceNo || existingInvoice?.invoiceNo || "";
      const finalTerms = data.termsAndConditions || termsQuill;

      console.log("💾 Final Terms to Save:", finalTerms);

      // ✅ Prepare payload with minimal totals structure
      const pi = {
        leadId: existingInvoice?.leadId,
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
          taxableValue, // ✅ Net amount after discount: 600 (name as requested)
          totalTax, // ✅ Total GST: 108
          invoiceTotal, // ✅ Final total: 708
        },
        termsAndConditions: finalTerms, // ✅ USE FINAL TERMS
        invoiceNo,
        discount,
      };

      console.log("📝 Updated PI Payload:", pi);

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

      // ✅ Prepare FormData
      const formData = new FormData();
      formData.append("id", invoiceId);
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
      formData.append("discount", discount); // ✅ ADDED
      formData.append("termsAndConditions", finalTerms); // ✅ USE FINAL TERMS
      formData.append("totals", JSON.stringify(pi.totals)); // ✅ Minimal totals
      formData.append("pdfFile", pdfFile);

      await dispatch(editPerformaInvoice(invoiceId, formData));
      toast.success("Performa Invoice Updated Successfully");
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

      <DialogBody divider className="min-h-[70vh]">
        {loading ? (
          <div className="flex justify-center items-center w-full h-[70vh]">
            <Spinner />
          </div>
        ) : (
          <>
            <DialogBody className="max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-4">
                <InputField
                  name="invoiceNo"
                  label="Invoice No"
                  control={control}
                  errors={errors}
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
                    options={services.map((s) => ({
                      value: s._id,
                      label: s.name,
                    }))}
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
                          {/* ✅ ADDED PRICE INPUT */}
                          <div className="w-28">
                            <InputField
                              name={`prices.${id}`}
                              label="Price"
                              type="number"
                              control={control}
                              errors={errors}
                              defaultValue={
                                watch(`prices.${id}`) ?? service?.price ?? 0
                              }
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
                {/* ✅ ADDED DISCOUNT FIELD */}
                <InputField
                  name="discount"
                  label="Discount"
                  type="number"
                  control={control}
                  errors={errors}
                />

                {/* ✅ FIXED TERMS & CONDITIONS */}
                <div className="col-span-3 mt-4">
                  <label className="block font-semibold mb-2">
                    Terms & Conditions
                  </label>
                  <Controller
                    name="termsAndConditions"
                    control={control}
                    render={({ field }) => {
                      console.log("🎭 ReactQuill Render:", {
                        fieldValue: field.value,
                        termsQuill,
                        finalValue: field.value || termsQuill,
                      });

                      return (
                        <ReactQuill
                          {...field}
                          value={field.value || termsQuill} // ✅ FALLBACK TO termsQuill
                          onChange={(val) => {
                            console.log("✏️ ReactQuill onChange:", val);
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
                      );
                    }}
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
          </>
        )}
      </DialogBody>
    </Dialog>
  );
};

export default EditGeneratePerformaModal;
