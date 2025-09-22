import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import toast from "react-hot-toast";
import InputField from "../../components/fields/InputField";
import MyButton from "../../components/buttons/MyButton";
import Heading from "../../common/Heading";
import { createService } from "../../redux/features/services";
import "react-quill/dist/quill.snow.css";
import { Spinner } from "@material-tailwind/react";

// Quill config
const quillModules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
];

const serviceCategoryOption = [
  { label: "AD Code", value: "AD Code" },
  { label: "Barcode Registration", value: "Barcode Registration" },
  { label: "Company Base DSC", value: "Company Base DSC" },
  { label: "Company Compliances", value: "Company Compliances" },
  { label: "Company Incorporation", value: "Company Incorporation" },
  { label: "Copyright", value: "Copyright" },
  { label: "Digital Marketing", value: "Digital Marketing" },
  { label: "DSC Class 3", value: "DSC Class 3" },
  { label: "EPR Registration", value: "EPR Registration" },
  { label: "FSSAI Central License", value: "FSSAI Central License" },
  { label: "FSSAI Modification", value: "FSSAI Modification" },
  { label: "FSSAI Registration", value: "fssaiReg" },
  { label: "FSSAI Renewal", value: "FSSAI Renewal" },
  { label: "FSSAI Returns", value: "FSSAI Returns" },
  { label: "FSSAI State License", value: "FSSAI State License" },
  { label: "GEM Registration", value: "GEM Registration" },
  { label: "GST Cancel", value: "GST Cancel" },
  { label: "GST Modification", value: "GST Modification" },
  { label: "GST Registration", value: "gstReg" },
  { label: "GST Returns", value: "GST Returns" },
  { label: "IEC Modification", value: "IEC Modification" },
  { label: "IEC Registration", value: "iecReg" },
  { label: "IEC Renewal", value: "IEC Renewal" },
  { label: "ISO Certificate", value: "ISO Certificate" },
  { label: "ITR Returns", value: "ITR Returns" },
  { label: "LMPC Registration", value: "LMPC Registration" },
  { label: "Logo Design/Brand Name Suggestion", value: "Logo Design/Brand Name Suggestion" },
  { label: "LUT Registration", value: "LUT Registration" },
  { label: "MCA Services", value: "MCA Services" },
  { label: "Others Services", value: "Others Services" },
  { label: "PF & ESI Registration", value: "PF & ESI Registration" },
  { label: "RCMC Certificate", value: "RCMC Certificate" },
  { label: "Startup India Certificate", value: "Startup India Certificate" },
  { label: "Trade License", value: "Trade License" },
  { label: "Trademark Objection/Hearing", value: "Trademark Objection/Hearing" },
  { label: "Trademark Registration", value: "Trademark Registration" },
  { label: "Udyam Modification", value: "Udyam Modification" },
  { label: "Udyam Registration", value: "Udyam Registration" },
  { label: "Water Test Report", value: "Water Test Report" },
  { label: "Website", value: "Website" },
];

const AddService = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      hsnCode: "",
      price: "",
      terms: "",
    },
  });

  const onSubmit = (data) => {
    setIsSubmitting(true);

    const payload = {
      name: data.name,
      hsnCode: data.hsnCode,
      price: data.price,
      termsAndConditions: data.terms,
    };

    dispatch(
      createService(payload, (success) => {
        setIsSubmitting(false);
        if (success) {
          navigate("/superAdmin/services");
        }
      })
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      <Heading text="Add Service" showHeading />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <InputField
          name="name"
          label="Name"
          type="select"
          mode="single"
          options={serviceCategoryOption}
          control={control}
          errors={errors}
          rules={{ required: "Required" }}
        />
        <InputField
          name="hsnCode"
          label="HSN Code"
          control={control}
          errors={errors}
          rules={{ required: "Required" }}
        />
        <InputField
          name="price"
          label="Price"
          type="number"
          control={control}
          errors={errors}
          rules={{ required: "Required" }}
        />
      </div>

      <div className="mt-6">
        <label className="block font-semibold mb-2">Terms & Conditions</label>
        <Controller
          name="terms"
          control={control}
          render={({ field }) => (
            <ReactQuill
              {...field}
              onChange={field.onChange}
              theme="snow"
              modules={quillModules}
              formats={quillFormats}
              className="bg-white"
              style={{
                minHeight: "120px",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            />
          )}
        />
        {errors.terms && (
          <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>
        )}
      </div>

      <div className="mt-6">
        <MyButton
          className="main-bg px-4 py-2 flex items-center justify-center"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="w-full h-5 flex items-center gap-2 text-white text-sm">
              <Spinner className="w-full h-full" /> Submitting...
            </div>
          ) : (
            "Submit"
          )}
        </MyButton>
      </div>
    </form>
  );
};

export default AddService;
