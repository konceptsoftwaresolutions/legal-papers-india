// EditService.jsx
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateService } from "../../redux/features/services";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../../components/fields/InputField";
import MyButton from "../../components/buttons/MyButton";
import Heading from "../../common/Heading";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import { Spinner } from "@material-tailwind/react";
import "react-quill/dist/quill.snow.css";
import { serviceCategoryOption } from "../../constants/options";

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

const EditService = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { services = [] } = useSelector((s) => s.services || { services: [] });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const service = services.find((srv) => srv._id === id || srv.id === id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      hsnCode: "",
      price: "",
      termsAndConditions: "",
    },
  });

  useEffect(() => {
    if (service) {
      reset({
        name: service.name || "",
        hsnCode: service.hsnCode || "",
        price: service.price || "",
        termsAndConditions: service.termsAndConditions || "",
      });
    }
  }, [service, reset]);

  if (!service) return <p className="text-center mt-10">Service not found</p>;

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await dispatch(
        updateService(id, data, (success) => {
          if (success) {
            navigate("/superAdmin/services");
          }
        })
      );
    } catch (error) {
      toast.error(error?.message || "Failed to update service");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      <Heading text="Edit Service" showHeading />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <InputField
          control={control}
          errors={errors}
          name="name"
          label="Name"
          type="select"
          mode="single"
          options={serviceCategoryOption}
          rules={{ required: "Required" }}
        />
        <InputField
          control={control}
          errors={errors}
          name="hsnCode"
          label="HSN Code"
          rules={{ required: "Required" }}
        />
        <InputField
          control={control}
          errors={errors}
          name="price"
          label="Price"
          type="number"
          rules={{ required: "Required" }}
        />
      </div>

      <div className="mt-6">
        <label className="block font-semibold mb-2">Terms & Conditions</label>
        <Controller
          name="termsAndConditions"
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
        {errors.termsAndConditions && (
          <p className="text-red-500 text-sm mt-1">
            {errors.termsAndConditions.message}
          </p>
        )}
      </div>

      <div className="mt-6">
        <MyButton
          type="submit"
          className="main-bg px-4 py-2 flex items-center justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2 text-white text-sm">
              <div className="w-5 h-5">
                <Spinner className="w-full h-full" />
              </div>
              Updating...
            </div>
          ) : (
            "Update"
          )}
        </MyButton>
      </div>
    </form>
  );
};

export default EditService;
