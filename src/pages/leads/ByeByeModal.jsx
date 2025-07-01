import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Button,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import InputField from "../../components/fields/InputField";
import { RiFolderSharedFill } from "react-icons/ri";

import {
  leadSourceOptions,
  serviceCategoryOption,
  typeOfBusinessOptions,
} from "../../constants/options";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  addLead,
  byeByeThunkMiddleware,
  handleMoveNCBucket,
} from "../../redux/features/leads";
import toast from "react-hot-toast";

const ByeByeModal = ({ open, setOpen, leadData }) => {
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
    setOpen(false);
  };

  const onSubmit = (data) => {
    console.log(data.File[0].file);
    const uploadedFile = data.File[0].file;
    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("leadId", leadData.leadId);
    dispatch(byeByeThunkMiddleware(formData));
    reset();
    handleCloseModal();
  };

  return (
    <Dialog
      open={open}
      handler={handleCloseModal}
      className="addLeadModal rounded-lg overflow-hidden"
      style={{ maxHeight: "90vh", minWidth: "50%" }}
    >
      <DialogHeader className="text-xl primary-gradient text-white poppins-font main-bg">
        <div className="flex justify-end w-full items-center">
          {/* Password */}
          <button onClick={handleCloseModal} className="text-2xl">
            <IoIosCloseCircle />
          </button>
        </div>
      </DialogHeader>
      <DialogBody
        className="overflow-y-auto bg-transparent lg:p-5 flex justify-center items-center flex-col w-full  "
        style={{ maxHeight: "calc(90vh - 64px)" }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <InputField
            type="uploadFiles"
            name="File"
            control={control}
            errors={errors}
            label="Upload File"
            maxFiles={1}
          />

          <div className="flex justify-end w-full gap-2 mt-4">
            <Button className=" main-bg" type="submit">
              Yes
            </Button>
          </div>
        </form>
      </DialogBody>
      <div></div>
    </Dialog>
  );
};

export default ByeByeModal;
