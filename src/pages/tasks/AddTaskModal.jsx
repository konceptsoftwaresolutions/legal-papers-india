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
import { useDispatch } from "react-redux";
import { createTask } from "../../redux/features/tasks";

const AddTaskModal = ({ showTaskModal, setShowTaskModal, leadData }) => {
  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const handleCloseModal = () => {
    setShowTaskModal(false);
  };

  const onSubmit = (data) => {
    const { reminder, time, ...rest } = data;

    // Combine date and time into a single ISO string
    const reminderDateTime = new Date(`${reminder}T${time}`).toISOString();

    const payload = {
      ...rest,
      reminder: reminderDateTime,
      leadData,
    };
    dispatch(createTask(payload));
    setShowTaskModal(!showTaskModal);
    console.log(payload);
  };

  return (
    <Dialog
      open={showTaskModal}
      handler={handleCloseModal}
      className="addLeadModal rounded-lg overflow-hidden"
      style={{ maxHeight: "90vh", minWidth: "70%" }}
    >
      <DialogHeader className="text-xl primary-gradient text-white poppins-font main-bg">
        <div className="flex justify-between w-full items-center">
          Create Task
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
              type="text"
              control={control}
              errors={errors}
              label="Subject"
              name="subject"
            />
            <InputField
              type="date"
              control={control}
              errors={errors}
              label="Date"
              name="reminder"
            />
            <InputField
              type="time"
              control={control}
              errors={errors}
              label="Time"
              name="time"
            />
          </div>
          <Button type="submit" className="mt-4 main-bg">
            Create
          </Button>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default AddTaskModal;
