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
import { userOptions } from "../../constants/options";
import SelectField from "../../components/fields/SelectField";
import { useDispatch, useSelector } from "react-redux";
import { addNewUser } from "../../redux/features/user";

const AddUserModal = ({ userModal, setUserModal }) => {
  const dispatch = useDispatch();

  const { addUserLoader } = useSelector((state) => state.user);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const handleCloseModal = () => {
    setUserModal(false);
  };

  const onSubmit = (data) => {
    setUserModal(!userModal);
    const payload = {
      email: data.email,
      name: data.name,
      mobile: data.mobile,
      profile: data.profile,
      password: data.password,
      dob: data.dob,
    };
    dispatch(addNewUser(payload));
    reset();
  };

  return (
    <Dialog
      open={userModal}
      handler={handleCloseModal}
      className="addLeadModal rounded-lg overflow-hidden"
      style={{ maxHeight: "90vh", minWidth: "60%" }}
    >
      <DialogHeader className="text-xl primary-gradient text-white poppins-font main-bg">
        <div className="flex justify-between w-full items-center">
          Add New User
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
          <div className="grid md:grid-cols-2  gap-4">
            <InputField
              name="name"
              control={control}
              errors={errors}
              label="Name"
            />

            <InputField
              name="mobile"
              control={control}
              errors={errors}
              label="Mobile Number"
              type="number"
            />

            <InputField
              control={control}
              name="email"
              errors={errors}
              label="Email"
            />

            <InputField
              type="date"
              name="dob"
              control={control}
              errors={errors}
              label="D.O.B"
            />

            <InputField
              control={control}
              name="password"
              errors={errors}
              label="Password"
              type="password"
            />

            <SelectField
              control={control}
              name="profile"
              errors={errors}
              label="Profile"
              options={userOptions}
              mode="single"
            />
          </div>
          <Button
            type="submit"
            className="mt-4 main-bg"
            loading={addUserLoader}
          >
            Add
          </Button>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default AddUserModal;
