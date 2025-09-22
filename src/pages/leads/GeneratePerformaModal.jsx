import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import Heading from "../../common/Heading";
import InputField from "../../components/fields/InputField";
import MyButton from "../../components/buttons/MyButton";
import FieldsCont from "../../common/FieldsCont";
import {
  createPerformaInvoice,
  incrementInvoice,
} from "../../redux/features/performa";
import { getAllServices, getAllAddresses } from "../../redux/features/services";
import { getLeaByID } from "../../redux/features/leads";
import GeneratePerformaPDF from "./GeneratePerformaPDF";
import { pdf } from "@react-pdf/renderer";
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

const GeneratePerformaInvoicePage = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Get leadId from URL query params
  const searchParams = new URLSearchParams(location.search);
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsQuill, setTermsQuill] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const selectedServiceIds = watch("selectedServices") || [];
  const gstNo = watch("gstNo");
  const placeOfSupply = watch("placeOfSupply");

  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  // ✅ Fetch lead data - Fixed dependency
  useEffect(() => {
    if (leadId) {
      dispatch(getLeaByID(leadId))
        .then((data) => {
          setLeadData(data);
          setIsLoading(false);
        })
        .catch(() => {
          toast.error("Failed to fetch lead data");
          setIsLoading(false);
        });
    }
  }, [leadId, dispatch]);

  // ✅ Fetch services and addresses - Fixed dependency
  useEffect(() => {
    dispatch(getAllServices());
    dispatch(getAllAddresses());
  }, [dispatch]);

  // ✅ Auto-select place of supply - Fixed dependency
  useEffect(() => {
    if (!gstNo || gstNo.length < 2) return;
    const stateCode = gstNo.substring(0, 2);
    const matchingState = gstStates.find((state) => state.code === stateCode);
    if (matchingState) {
      const placeOfSupplyValue = `${matchingState.code}-${matchingState.name}`;
      setValue("placeOfSupply", placeOfSupplyValue);
    }
  }, [gstNo, setValue]);

  // ✅ Auto-select tax type - Fixed dependency
  useEffect(() => {
    if (!placeOfSupply) return;
    const [stateCode] = placeOfSupply.split("-");
    if (stateCode === "07") {
      setValue("taxType", "intra");
    } else {
      setValue("taxType", "inter");
    }
  }, [placeOfSupply, setValue]);

  // ✅ Update terms - Fixed with useCallback
  const updateTerms = useCallback(() => {
    const terms = selectedServiceIds
      .map((id) => services.find((s) => s._id === id)?.termsAndConditions || "")
      .filter(Boolean)
      .join("\n\n");
    setTermsQuill(terms);
  }, [selectedServiceIds, services]);

  useEffect(() => {
    updateTerms();
  }, [updateTerms]);

  // ✅ Initialize form - Fixed dependency issue
  useEffect(() => {
    if (leadData && services.length > 0) {
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
  }, [leadData, services, reset]);

  // ✅ Set quantities and prices - Fixed with useCallback
  const setDefaultValues = useCallback(() => {
    selectedServiceIds.forEach((id) => {
      if (watch(`quantities.${id}`) === undefined) {
        setValue(`quantities.${id}`, 1);
      }
      if (watch(`prices.${id}`) === undefined) {
        const service = services.find((s) => s._id === id);
        setValue(`prices.${id}`, service?.price || 0);
      }
    });
  }, [selectedServiceIds, services, setValue, watch]);

  useEffect(() => {
    if (selectedServiceIds.length > 0) {
      setDefaultValues();
    }
  }, [selectedServiceIds, setDefaultValues]);

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

      // Get invoice number
      const invoiceResponse = await dispatch(incrementInvoice("Proforma"));
      const currentData = invoiceResponse?.data;
      const invoiceNo = currentData
        ? `${currentData.prefix}-${currentData.currentNumber}`
        : "INV-ERROR";

      // Prepare service details
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

      // Calculate totals
      const originalAmount = selectedServiceDetails.reduce(
        (sum, srv) => sum + srv.baseAmount,
        0
      );

      const discount = parseFloat(data.discount) || 0;
      const taxableValue = originalAmount - discount;

      let totalTax = 0;
      selectedServiceDetails.forEach((srv) => {
        const serviceDiscount = (srv.baseAmount / originalAmount) * discount;
        const serviceNetAmount = srv.baseAmount - serviceDiscount;
        const taxRate = srv?.taxRate || 18;
        if (data.taxType === "intra") {
          totalTax += (serviceNetAmount * taxRate) / 100;
        } else if (data.taxType === "inter") {
          totalTax += (serviceNetAmount * taxRate) / 100;
        }
      });

      const invoiceTotal = taxableValue + totalTax;

      // Prepare PI payload
      const pi = {
        leadId: leadData?._id,
        name: data.name,
        mobileNumber: data.mobileNumber,
        address: data.address,
        addressDropdown: data.addressDropdown,
        gstNo: data.gstNo,
        taxType: data.taxType,
        placeOfSupply: data.placeOfSupply,
        date: data.date,
        validUntil: data.validUntil,
        services: selectedServiceDetails,
        totals: {
          taxableValue: Math.round(taxableValue),
          totalTax: Math.round(totalTax),
          invoiceTotal: Math.round(invoiceTotal),
        },
        termsAndConditions: termsQuill,
        invoiceNo,
        discount,
      };

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
      formData.append("leadId", pi.leadId);
      formData.append("name", pi.name);
      formData.append("mobileNumber", pi.mobileNumber);
      formData.append("address", pi.address);
      formData.append("addressDropdown", data.addressDropdown || "");
      formData.append("gstNo", pi.gstNo || "");
      formData.append("taxType", pi.taxType);
      formData.append("date", pi.date);
      formData.append("validUntil", pi.validUntil || "");
      formData.append("placeOfSupply", pi.placeOfSupply);
      formData.append("services", JSON.stringify(selectedServiceDetails));
      formData.append("invoiceNo", invoiceNo);
      formData.append("termsAndConditions", pi.termsAndConditions || "");
      formData.append("totals", JSON.stringify(pi.totals));
      formData.append("discount", discount);
      formData.append("pdfFile", pdfFile);

      // Success callback में localStorage set करें
      await dispatch(
        createPerformaInvoice(formData, async (success) => {
          if (success) {
            toast.success("Performa Invoice generated successfully!");

            // Set completion flag
            localStorage.setItem(
              "invoiceCompleted",
              JSON.stringify({
                type: "performa",
                leadId: leadData?.leadId,
                timestamp: Date.now(),
              })
            );

            console.log("Invoice generated successfully");

            // Close window after delay
            setTimeout(() => {
              window.close();
            }, 2000);
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

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div>Loading lead data...</div>
      </div>
    );
  }

  if (!leadData) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div>Lead data not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full px-4 gap-y-4 py-5">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-y-3">
        <Heading text="Generate Performa Invoice" showHeading />
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)}>
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

            {selectedServiceIds?.length > 0 && (
              <div className="col-span-3 space-y-4">
                {selectedServiceIds.map((id) => {
                  const service = services.find((s) => s._id === id);
                  return (
                    <div key={id} className="flex items-center gap-4">
                      <span className="flex-1 font-medium">
                        {service?.name || "Service"}
                      </span>
                      <div className="w-20">
                        <InputField
                          name={`quantities.${id}`}
                          label="Qty"
                          type="number"
                          control={control}
                          errors={errors}
                          defaultValue={1}
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
                          defaultValue={service?.price || 0}
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
            <InputField
              name="discount"
              label="Discount"
              type="number"
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
                    value={field.value || termsQuill}
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

        <div className="flex gap-x-3 gap-y-1 flex-wrap justify-between sticky bottom-1 p-2 main-bg shadow-lg rounded-md mt-3">
          <MyButton
            type="submit"
            disabled={isSubmitting}
            className="capitalize"
          >
            {isSubmitting ? "Generating..." : "Generate Invoice"}
          </MyButton>
          <MyButton
            type="button"
            onClick={() => window.close()}
            className="capitalize"
          >
            Cancel
          </MyButton>
        </div>
      </form>
    </div>
  );
};

export default GeneratePerformaInvoicePage;
