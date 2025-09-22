import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { IoArrowBack } from "react-icons/io5";
import toast from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import InputField from "../../components/fields/InputField";
import { useDispatch, useSelector } from "react-redux";
import {
  createTaxInvoice,
  getAllTaxInvoices,
  incrementInvoice,
} from "../../redux/features/tax";
import { pdf } from "@react-pdf/renderer";
import GenerateTaxPDF from "./GenerateTaxPDF";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { gstStates } from "../../constants/gstStates";
import { getAllAddresses } from "../../redux/features/services";
import { getLeaByID } from "../../redux/features/leads";
import Heading from "../../common/Heading";
import FieldsCont from "../../common/FieldsCont";

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

const GenerateTaxInvoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get("leadId");

  const services = useSelector((state) => state.services?.services || []);
  const addresses = useSelector(
    (state) =>
      state.services?.addresses?.data?.filter(
        (address) => address.isActive === true
      ) || []
  );

  const [leadData, setLeadData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Load lead data
  useEffect(() => {
    if (leadId) {
      setIsLoading(true);
      dispatch(getLeaByID(leadId))
        .then((data) => {
          if (data && data.leadId === leadId) {
            setLeadData(data);
          }
        })
        .catch((err) => {
          console.log("Load Error:", err.message);
          toast.error("Failed to load lead data");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [leadId, dispatch]);

  // ✅ Auto-select place of supply based on GST number
  const gstNo = watch("gstNo");

  useEffect(() => {
    if (!gstNo || gstNo.length < 2) return;

    const stateCode = gstNo.substring(0, 2);
    const matchingState = gstStates.find((state) => state.code === stateCode);

    if (matchingState) {
      const placeOfSupplyValue = `${matchingState.code}-${matchingState.name}`;
      setValue("placeOfSupply", placeOfSupplyValue);
      console.log(`🔄 Auto-selected Place of Supply: ${placeOfSupplyValue}`);
    }
  }, [gstNo, setValue]);

  const placeOfSupply = watch("placeOfSupply");

  useEffect(() => {
    if (!placeOfSupply) return;

    const [stateCode] = placeOfSupply.split("-");

    if (stateCode === "07") {
      setValue("taxType", "intra");
    } else {
      setValue("taxType", "inter");
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

  // Autofill form when lead data loads
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
        quantities: services.reduce((acc, s) => ({ ...acc, [s._id]: 1 }), {}),
        prices: services.reduce(
          (acc, s) => ({ ...acc, [s._id]: s.price || 0 }),
          {}
        ),
      });
    }
  }, [leadData, reset, services]);

  useEffect(() => {
    dispatch(getAllAddresses());
  }, [dispatch]);

  const stripHTMLTags = (str) => {
    if (!str) return "";
    return str.replace(/<[^>]*>/g, "");
  };

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

      const discount = parseFloat(data.discount) || 0;
      const taxableValue = taxableValues - discount;

      let totalTax = 0;

      selectedServiceDetails.forEach((service) => {
        const serviceDiscount = (service.baseAmount / taxableValues) * discount;
        const serviceNetAmount = service.baseAmount - serviceDiscount;
        const taxRate = service?.taxRate || 18;

        if (data.taxType === "intra") {
          totalTax += (serviceNetAmount * taxRate) / 100;
        } else if (data.taxType === "inter") {
          totalTax += (serviceNetAmount * taxRate) / 100;
        }
      });

      const invoiceTotal = taxableValue + totalTax;

      // 4️⃣ Prepare payload
      const taxInvoiceData = {
        leadId: leadData?._id,
        name: data.name,
        mobileNumber: data.mobileNumber,
        address: data.address,
        addressDropdown: data.addressDropdown,
        gstNo: data.gstNo,
        taxType: data.taxType,
        placeOfSupply: data.placeOfSupply,
        date: data.date,
        validUntil: "2025-12-31",
        services: selectedServiceDetails,
        termsAndConditions: termsQuill,
        invoiceNo,
        discount,
        totals: {
          taxableValue: Math.round(taxableValue),
          totalTax: Math.round(totalTax),
          invoiceTotal: Math.round(invoiceTotal),
        },
      };

      console.log("🧾 Tax Invoice Payload:", taxInvoiceData);

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
      formData.append("addressDropdown", data.addressDropdown || "");
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
      formData.append("totals", JSON.stringify(taxInvoiceData.totals));
      formData.append("pdfFile", pdfFile);

      // Success callback में localStorage set करें
      await dispatch(
        createTaxInvoice(formData, async (success) => {
          if (success) {
            toast.success("Tax Invoice generated successfully!");

            // Set completion flag
            localStorage.setItem(
              "invoiceCompleted",
              JSON.stringify({
                type: "tax",
                leadId: leadData?.leadId,
                timestamp: Date.now(),
              })
            );

            console.log("Tax Invoice generated successfully");

            // Close window after delay
            setTimeout(() => {
              window.close();
            }, 2000);
          }
        })
      );

      dispatch(getAllTaxInvoices(leadData?.leadId));
    } catch (error) {
      console.error("Tax invoice error:", error);
      toast.error(error.message || "Failed to create Tax Invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading lead data...</div>
      </div>
    );
  }

  if (!leadData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Lead not found!</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full px-4 gap-y-4 py-5">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-y-3">
        <Heading text="Generate Tax Invoice" showHeading />
      </div>

      {/* Form */}
      <div>
        <FieldsCont>
          <div className="grid grid-cols-3 gap-4">
            <InputField
              name="addressDropdown"
              label="Select Address"
              type="select"
              mode="single"
              control={control}
              errors={errors}
              options={addresses.map((address) => ({
                value: address.addressLine1,
                label: stripHTMLTags(address.addressLine1),
              }))}
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

            {/* Tax Type, Date, Discount */}
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
        </FieldsCont>
        {/* Buttons */}
        <div className="flex gap-x-3 gap-y-1 flex-wrap justify-between sticky bottom-1 p-2 main-bg shadow-lg rounded-md mt-3">
          <Button
            className="capitalize"
            onClick={handleSubmit(onSubmitForm)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Generating..." : "Generate Tax Invoice"}
          </Button>
          <Button
            className="capitalize"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GenerateTaxInvoice;
