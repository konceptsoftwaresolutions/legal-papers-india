import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addClientFile } from "../../redux/features/clientFiles/clientFilesSlice";
import { useNavigate } from "react-router-dom";
import Heading from "../../common/Heading";
import InputField from "../../components/fields/InputField";
import MyButton from "../../components/buttons/MyButton";
import toast from "react-hot-toast";

const AddClientFile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const leads = useSelector((s) => s.leads);
  const leadOptions =
    leads?.allLead?.map((lead) => ({
      label: lead.name,
      value: lead.leadId,
    })) || [];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      leadID: "",
      name: "",
      mobileNumber: "",
      photoNote: "",
    },
  });

  const onSubmit = (data) => {
    dispatch(addClientFile(data));
    toast.success("Client file added successfully!");
    navigate("/superAdmin/clientfiles");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 rounded shadow">
      <Heading text="Add Client File" showHeading />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <InputField
          type="select"
          control={control}
          errors={errors}
          label="Lead ID"
          name="leadID"
          mode="single"
          rules={{ required: "Lead ID is required" }}
          options={leadOptions}
        />

        <InputField
          type="text"
          control={control}
          errors={errors}
          label="Name"
          name="name"
          rules={{ required: "Name is required" }}
        />

        <InputField
          type="text"
          control={control}
          errors={errors}
          label="Mobile Number"
          name="mobileNumber"
          rules={{
            required: "Mobile is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Must be 10 digits",
            },
          }}
        />

        <InputField
          type="text"
          control={control}
          errors={errors}
          label="Photo Note (URL/Text)"
          name="photoNote"
          rules={{ required: "Photo note is required" }}
        />
      </div>

      <div className="mt-6">
        <MyButton
          className="main-bg py-2 flex justify-center items-center text-[15px] font-medium px-4 gap-x-1"
          type="submit"
        >
          Submit
        </MyButton>
      </div>
    </form>
  );
};

export default AddClientFile;
