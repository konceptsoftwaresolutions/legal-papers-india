import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateService } from "../../redux/features/services";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../../components/fields/InputField";
import MyButton from "../../components/buttons/MyButton";
import Heading from "../../common/Heading";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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

const EditService = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((s) => s.services);
  const service = items.find((s) => s.id === id || s._id === id);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: service?.name || "",
      hsnCode: service?.hsnCode || "",
      price: service?.price || "",
      terms: service?.terms || "",
    },
  });

  const onSubmit = (data) => {
    dispatch(updateService({ ...data, id }));
    toast.success("Service updated successfully!");
    navigate("/superAdmin/services");
  };

  if (!service) return <p>Service not found</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      <Heading text="Edit Service" showHeading />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <InputField
          control={control}
          errors={errors}
          name="name"
          label="Name"
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
        <MyButton className="main-bg px-4 py-2" type="submit">
          Update
        </MyButton>
      </div>
    </form>
  );
};

export default EditService;
