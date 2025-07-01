import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Button,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import InputField from "../../components/fields/InputField";
import { updateUserPassword } from "../../redux/features/user";

const UserPassModal = ({ passModal, setPassModal, email }) => {
  const dispatch = useDispatch();

  const {userPassUpdateLoader} = useSelector( (state) => state.user )

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const handleCloseModal = () => {
    setPassModal(false);
  };

  const onSubmit = (data) => {
    const payload = {
      ...data,
      email: email,
    };
    console.log(payload);
    dispatch(updateUserPassword(payload));
    setPassModal(!passModal);
    console.log(data);
  };

  return (
    <Dialog
      open={passModal}
      handler={handleCloseModal}
      className="addLeadModal rounded-lg overflow-hidden"
      style={{ maxHeight: "90vh", minWidth: "60%" }}
    >
      <DialogHeader className="text-xl primary-gradient text-white poppins-font main-bg">
        <div className="flex justify-between w-full items-center">
          Change User Password
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
          <div className="grid grid-cols-1  gap-4">
            <InputField
              name="newPassword"
              control={control}
              errors={errors}
              type="password"
              label="New Password"
            />

            <InputField
              name="confirmPassword"
              control={control}
              errors={errors}
              label="Confirm Password"
              type="password"
            />
          </div>
          <Button type="submit" className="mt-4 main-bg" loading={userPassUpdateLoader}>
            Save
          </Button>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default UserPassModal;
