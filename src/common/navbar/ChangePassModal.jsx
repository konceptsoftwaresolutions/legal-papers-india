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
import { useDispatch, useSelector } from "react-redux";
import { changeLoggedInUserPass } from "../../redux/features/user";

const ChangePassModal = ({ passModal, setPassModal }) => {
  const dispatch = useDispatch();
  const { userData, loggedPassResetLoader } = useSelector(
    (state) => state.user
  );

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
      email: userData?.email,
    };
    setPassModal(!passModal);
    // console.log(pay);
    dispatch(changeLoggedInUserPass(payload));
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
          Change Password
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
              name="currentPassword"
              control={control}
              errors={errors}
              label="Current Password"
              type="password"
            />
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
          <Button
            type="submit"
            className="mt-4 main-bg"
            loading={loggedPassResetLoader}
          >
            Save
          </Button>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default ChangePassModal;
