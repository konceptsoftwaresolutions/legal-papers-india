import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Button,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import InputField from "../../components/fields/InputField";
import {
  leadSourceOptions,
  serviceCategoryOption,
  typeOfBusinessOptions,
} from "../../constants/options";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { addLead } from "../../redux/features/leads";
import { addLeadSchema } from "../../constants/validations";
import { yupResolver } from "@hookform/resolvers/yup";

const AddLeadModal = ({ showQuotation, setShowQuotation }) => {
  const dispatch = useDispatch();

  const { addLeadLoader } = useSelector((state) => state.leads);

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(addLeadSchema),
  });

  const handleCloseModal = () => {
    setShowQuotation(false);
  };

  const onSubmit = (data) => {
    dispatch(addLead(data));
    setShowQuotation(false);
    reset();
  };

  const handleReset = () => {
    console.log("clicked");
    reset();
  };

  return (
    <Dialog
      open={showQuotation}
      handler={handleCloseModal}
      className="addLeadModal rounded-lg overflow-hidden"
      style={{ maxHeight: "90vh", minWidth: "70%" }}
    >
      <DialogHeader className="text-xl primary-gradient text-white poppins-font main-bg">
        <div className="flex justify-between w-full items-center">
          Add Lead
          <button onClick={handleCloseModal} className="text-2xl">
            <IoIosCloseCircle />
          </button>
        </div>
      </DialogHeader>
      <DialogBody
        className="overflow-y-auto bg-transparent lg:p-5"
        style={{ maxHeight: "calc(90vh - 64px)" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2   gap-4">
            <InputField
              control={control}
              name="nameOfBusinessEntity"
              errors={errors}
              label="Business Name"
              type="text"
            />
            <InputField
              control={control}
              name="emailId"
              errors={errors}
              label="Email Id"
              type="email"
            />
            <InputField
              name="mobileNumber"
              control={control}
              errors={errors}
              label="Mobile Number"
              type="number"
            />
            <InputField
              name="typeOfBusiness"
              control={control}
              errors={errors}
              label="Type of Business"
              type="option"
              options={typeOfBusinessOptions}
            />
            <InputField
              name="serviceCategory"
              control={control}
              errors={errors}
              label="Service Category"
              type="select"
              mode="single"
              options={serviceCategoryOption}
            />

            <InputField
              name="constitutionOfBusiness"
              control={control}
              errors={errors}
              label="Nature of Business"
              type="text"
            />
            {/* <InputField
              name="leadSource"
              control={control}
              errors={errors}
              label="Lead Source"
              type="option"
              options={leadSourceOptions}
            /> */}
            <InputField
              name="address"
              control={control}
              errors={errors}
              label="Address"
              type="desc"
            />
          </div>
          <Button
            type="submit"
            className="main-bg mt-3"
            loading={addLeadLoader}
          >
            Add
          </Button>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default AddLeadModal;
