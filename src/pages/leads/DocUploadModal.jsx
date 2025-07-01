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

const DocUploadModal = ({ showModal, setShowModal, setUploadedDoc }) => {
  const dispatch = useDispatch();

  const { addLeadLoader } = useSelector((state) => state.leads);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm();

  const prepareFormData = (files) => {
    const formData = new FormData();

    files.forEach((fileObj, index) => {
      formData.append(`File`, fileObj.file); // Each file is appended as a separate binary file
    });

    return formData;
  };

  const onSubmit = async (data) => {
    console.log("modal;", data);

    setUploadedDoc(data);

    //     const formData = prepareFormData(data.files);

    //   try {
    //     const response = await fetch("https://your-api-endpoint.com/upload", {
    //       method: "POST",
    //       body: formData,
    //     });

    //     if (response.ok) {
    //       console.log("Files uploaded successfully!");
    //     } else {
    //       console.error("Upload failed.");
    //     }
    //   } catch (error) {
    //     console.error("Error uploading files:", error);
    //   }
    setShowModal(false);
  };

  return (
    <Dialog
      open={showModal}
      handler={handleCloseModal}
      className="addLeadModal rounded-lg overflow-hidden"
      style={{ maxHeight: "90vh", minWidth: "70%" }}
    >
      <DialogHeader className="text-xl primary-gradient text-white poppins-font main-bg">
        <div className="flex justify-between w-full items-center">
          Upload Documents
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
          <InputField
            control={control}
            errors={errors}
            name="files"
            label="Upload Files"
            type="uploadFiles"
          />
          <button
            type="submit "
            className="main-bg text-white px-4 py-1 rounded "
          >
            Add
          </button>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default DocUploadModal;
