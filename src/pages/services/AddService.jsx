import React from "react";
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

const AddService = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    dispatch(createService(data));
    toast.success("Service added successfully!");
    navigate("/superAdmin/services");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      <Heading text="Add Service" showHeading />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <InputField
          name="name"
          label="Name"
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
        <MyButton className="main-bg px-4 py-2" type="submit">
          Submit
        </MyButton>
      </div>
    </form>
  );
};

export default AddService;
