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
import toast from "react-hot-toast";

const PasswordModal = ({ passModal, setPassModal, onSave }) => {
  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const handleCloseModal = () => {
    setPassModal(false);
  };

  const onSubmit = (data) => {
    if (data?.password) {
      if (data?.password !== "SharmaSarthak@666") {
        toast.error("Incorrect Password: Please try again.");
        handleCloseModal();

        return null;
      }

      onSave(data?.password);
      reset();
      handleCloseModal();
    } else {
      toast.error("Please enter your password to continue.");
      handleCloseModal();
    }
  };

  return (
    <Dialog
      open={passModal}
      handler={handleCloseModal}
      className="addLeadModal rounded-lg overflow-hidden"
      style={{ maxHeight: "90vh", minWidth: "50%" }}
    >
      <DialogHeader className="text-xl primary-gradient text-white poppins-font main-bg">
        <div className="flex justify-between w-full items-center">
          Password
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
          <div className="grid grid-cols-1    gap-4">
            <InputField
              control={control}
              name="password"
              errors={errors}
              label="Password"
              type="password"
            />
            <Button type="submit" className="main-bg mt-3">
              Save
            </Button>
          </div>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default PasswordModal;
