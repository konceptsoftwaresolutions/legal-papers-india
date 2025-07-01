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
import { addLead, handleMoveNCBucket } from "../../redux/features/leads";
import toast from "react-hot-toast";

const MoveNCModal = ({ ncModal, setNcModal, leadData }) => {
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
    setNcModal(false);
  };

  // const onSubmit = (data) => {};
  const handleYesClick = () => {
    dispatch(handleMoveNCBucket(leadData.leadId));
    handleCloseModal();
  };

  return (
    <Dialog
      open={ncModal}
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
        className="overflow-y-auto bg-transparent lg:p-5 flex justify-center items-center flex-col   "
        style={{ maxHeight: "calc(90vh - 64px)" }}
      >
        <RiFolderSharedFill size={22} />

        <p className="text-lg md:text-2xl font-semibold">
          Are you sure to move?
        </p>

        <div className="flex justify-end w-full gap-2 mt-4">
          <Button className="bg-red-400">No</Button>
          <Button className=" main-bg" onClick={handleYesClick}>
            Yes
          </Button>
        </div>
      </DialogBody>
      <div></div>
    </Dialog>
  );
};

export default MoveNCModal;
