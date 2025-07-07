import React from "react";
import Filters from "../../components/sliders/Filters";
import InputField from "../../components/fields/InputField";
import { useForm } from "react-hook-form";
import MyButton from "../../components/buttons/MyButton";

const FilterClientFiles = ({
  isOpen,
  setIsOpen,
  setIsFilterActive,
  filterClientFiles,
  resetClientFiles,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      mobileNumber: "",
      leadId: "",
    },
  });

  const onSubmit = (data) => {
    const filterObject = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v.trim() !== "")
    );
    if (Object.keys(filterObject).length > 0) {
      filterClientFiles(filterObject);
      setIsFilterActive(true);
      setIsOpen(false);
    }
  };

  const onReset = () => {
    reset();
    resetClientFiles();
    setIsFilterActive(false);
    setIsOpen(false);
  };

  return (
    <Filters isOpen={isOpen} setIsOpen={setIsOpen} title="Filter Client Files">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-between h-full"
      >
        <div className="space-y-4 px-2">
          <InputField
            type="text"
            control={control}
            errors={errors}
            label="Name"
            name="name"
          />
          <InputField
            type="text"
            control={control}
            errors={errors}
            label="Mobile Number"
            name="mobileNumber"
          />
          <InputField
            type="text"
            control={control}
            errors={errors}
            label="Lead ID"
            name="leadId"
          />
        </div>

        <div className="w-full flex justify-end items-center py-3 gap-x-2 sticky bottom-0 border-t-4 bg-white mt-6 px-2">
          <MyButton
            className="bg-green-700 py-2 px-4 text-[14px]"
            onClick={onReset}
          >
            Reset
          </MyButton>
          <MyButton type="submit" className="main-bg py-2 px-4 text-[14px]">
            Apply
          </MyButton>
        </div>
      </form>
    </Filters>
  );
};

export default FilterClientFiles;
