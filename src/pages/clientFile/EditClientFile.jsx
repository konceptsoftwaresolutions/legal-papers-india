import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateClientFile } from "../../redux/features/clientFiles/clientFilesSlice";
import { useNavigate, useParams } from "react-router-dom";
import MyButton from "../../components/buttons/MyButton";
import InputField from "../../components/fields/InputField";
import Heading from "../../common/Heading";
import toast from "react-hot-toast";

const EditClientFile = () => {
  const { id } = useParams();
  const leads = useSelector((s) => s.leads);
  const items = useSelector((s) => s.clientFiles.items);

  const leadOptions =
    leads?.allLead?.map((lead) => ({
      label: lead.name, // dropdown me show
      value: lead.leadId, // backend ko bhejna
    })) || [];

  const file = items.find((i) => i.id === id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!file) return <p>Client File not found</p>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      leadID: file.leadID || "",
      name: file.name || "",
      mobileNumber: file.mobileNumber || "",
      photoNote: file.photoNote || "",
    },
  });

  const onSubmit = (data) => {
    dispatch(updateClientFile({ ...file, ...data }));
    toast.success("Client file updated successfully!");
    navigate("/superAdmin/clientfiles");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 rounded shadow">
      <Heading text="Edit Client File" showHeading />

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
          Update
        </MyButton>
      </div>
    </form>
  );
};

export default EditClientFile;
