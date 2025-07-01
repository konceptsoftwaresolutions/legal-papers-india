import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Button,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { IoIosCloseCircle } from "react-icons/io";
import InputField from "../../components/fields/InputField";
import { useSelector } from "react-redux";

const ProfileModal = ({ showQuotation, setShowQuotation }) => {
  const { userData } = useSelector((state) => state.user);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const handleCloseModal = () => {
    setShowQuotation(false);
  };

  const onSubmit = (data) => {
    setShowQuotation(!showQuotation);
    console.log(data);
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
          Profile
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              disabled={true}
              name="name"
              control={control}
              errors={errors}
              label="Name"
                defaultValue={userData?.name}
            />

            <InputField
              name="mobile"
              disabled={true}
              control={control}
              errors={errors}
              label="Mobile Number"
              type="number"
                defaultValue={userData?.mobile}
            />

            <InputField
              disabled={true}
              control={control}
              name="email"
              errors={errors}
              label="Email"
                defaultValue={userData?.email}
            />

            <InputField
              control={control}
              name="profile"
              disabled={true}
              errors={errors}
              label="Profile"
                defaultValue={userData?.profile}
            />
          </div>
          {/* <Button type="submit" className="mt-4 main-bg">
            Create
          </Button> */}
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default ProfileModal;
