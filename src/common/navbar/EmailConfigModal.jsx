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
import { byeEmailConfigSave, testEmailConfig } from "../../redux/features/user";
import useAxios from "../../hooks/useAxios";

const EmailConfigModal = ({ emailModal, setEmailModal }) => {
  const axiosInstance = useAxios();

  const dispatch = useDispatch();

  const { userData, emailConfigSaveLoader, emailTestLoader } = useSelector(
    (state) => state.user
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      byeHost: userData?.byeHost,
      byePort: userData?.byePort,
      byeEmail: userData?.byeEmail,
      byePassword: userData?.byePassword,
    },
  });

  const handleCloseModal = () => {
    setEmailModal(false);
  };

  const onSubmit = (data) => {
    const payload = { ...data };
    dispatch(byeEmailConfigSave(payload));
    setEmailModal(!emailModal);

    console.log(data);
  };

  const handleTest = () => {
    const formData = {
      byeHost: userData?.byeHost,
      byePort: userData?.byePort,
      byeEmail: userData?.byeEmail,
      byePassword: userData?.byePassword,
    };
    dispatch(testEmailConfig(formData));
  };

  return (
    <Dialog
      open={emailModal}
      handler={handleCloseModal}
      className="addLeadModal rounded-lg overflow-hidden"
      style={{ maxHeight: "90vh", minWidth: "60%" }}
    >
      <DialogHeader className="text-xl primary-gradient text-white poppins-font main-bg">
        <div className="flex justify-between w-full items-center">
          Bye Email Configure
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
          <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
            <InputField
              control={control}
              name="byeHost"
              errors={errors}
              label="Enter Host"
            />

            <InputField
              control={control}
              name="byePort"
              label="Enter Port"
              errors={errors}
            />

            <InputField
              control={control}
              name="byeEmail"
              errors={errors}
              label="Enter Email"
              type="email"
            />

            <InputField
              control={control}
              name="byePassword"
              label="Password"
              type="password"
              errors={errors}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" className="mt-4 main-bg" onClick={handleTest}>
              {/* Test */}
              {emailTestLoader ? "Testing ..." : "Test"}
            </Button>

            <Button
              type="submit"
              className="mt-4 main-bg"
              loading={emailConfigSaveLoader}
            >
              Save
            </Button>
          </div>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default EmailConfigModal;
