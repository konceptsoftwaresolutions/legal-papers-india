import React from "react";
import Filters from "../../components/sliders/Filters";
import { useForm } from "react-hook-form";
import InputField from "../../components/fields/InputField";
import { useDispatch, useSelector } from "react-redux";
import MyButton from "../../components/buttons/MyButton";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Completed", label: "Completed" },
];

const TasksFilter = ({
  isOpen = false,
  setIsOpen = () => {},
  setIsFilterActive,
  filterTasks,
  resetTasks,
}) => {
  const dispatch = useDispatch();

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const onReset = () => {
    reset({
      emailId: "",
      status: "",
    });
    resetTasks();
    setIsFilterActive(false);
    setIsOpen(false);
  };

  const onSubmit = (data) => {
    const filterObject = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );
    console.log(filterObject);
    if (filterObject) {
      filterTasks(filterObject);
      setIsFilterActive(true);
      setIsOpen(false);
    }
  };

  return (
    <Filters
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Lead Filter"
      onReset={onReset}
      className="space-y-4 font-extrabold"
      onSubmit={handleSubmit(onSubmit)}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
        <InputField
          control={control}
          errors={errors}
          label="Client Email"
          name="emailId"
          type="text"
        />

        <InputField
          control={control}
          errors={errors}
          label="Task Status"
          type="option"
          name="status"
          options={statusOptions}
        />
        <div className="w-full flex justify-end items-center py-3 gap-x-2 sticky bottom-0 border-t-4 bg-white">
          {/* <MyButton
            className="bg-gray-300 shadow-none hover:shadow-none py-2 px-4 text-black text-[14px]"
            // onClick={handleClose}
          >
            Cancel
          </MyButton> */}

          <MyButton
            className="bg-green-700 py-2 px-4 text-[14px]"
            onClick={() => onReset()}
          >
            Reset
          </MyButton>
          <MyButton
            type="submit"
            className="main-bg py-2 px-4 text-[14px]"
            // onClick={onSubmit}
          >
            Apply
          </MyButton>
        </div>
      </form>
    </Filters>
  );
};

export default TasksFilter;
