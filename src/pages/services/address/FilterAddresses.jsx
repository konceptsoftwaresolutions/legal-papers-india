import React from "react";
import { useForm } from "react-hook-form";
import Filters from "../../../components/sliders/Filters";
import InputField from "../../../components/fields/InputField";
import MyButton from "../../../components/buttons/MyButton";

const FilterAddresses = ({
  isOpen,
  setIsOpen,
  setIsFilterActive,
  filterAddresses,
  resetAddresses,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { addressLine1: "" },
  });

  const onSubmit = (data) => {
    if (data.addressLine1.trim() !== "") {
      filterAddresses({ addressLine1: data.addressLine1 });
      setIsFilterActive(true);
      setIsOpen(false);
    }
  };

  const onReset = () => {
    reset();
    resetAddresses();
    setIsFilterActive(false);
    setIsOpen(false);
  };

  return (
    <Filters isOpen={isOpen} setIsOpen={setIsOpen} title="Filter Addresses">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-between h-full"
      >
        <div className="space-y-4 px-2">
          <InputField
            control={control}
            errors={errors}
            name="addressLine1"
            label="Address Line 1"
          />
        </div>
        <div className="flex justify-end items-center py-3 gap-2 mt-6 px-2 border-t bg-white sticky bottom-0">
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

export default FilterAddresses;
