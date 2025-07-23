import React from "react";
import { useForm } from "react-hook-form";
import Filters from "../../components/sliders/Filters";
import InputField from "../../components/fields/InputField";
import MyButton from "../../components/buttons/MyButton";

const FilterServices = ({
  isOpen,
  setIsOpen,
  setIsFilterActive,
  filterServices,
  resetServices,
}) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: "", hsnCode: "", price: "" },
  });

  const onSubmit = (data) => {
    const filterObject = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v.trim() !== "")
    );
    if (Object.keys(filterObject).length > 0) {
      filterServices(filterObject);
      setIsFilterActive(true);
      setIsOpen(false);
    }
  };

  const onReset = () => {
    reset();
    resetServices();
    setIsFilterActive(false);
    setIsOpen(false);
  };

  return (
    <Filters isOpen={isOpen} setIsOpen={setIsOpen} title="Filter Services">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-between h-full"
      >
        <div className="space-y-4 px-2">
          <InputField control={control} errors={errors} name="name" label="Name" />
          <InputField control={control} errors={errors} name="hsnCode" label="HSN Code" />
          <InputField control={control} errors={errors} name="price" label="Price" />
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

export default FilterServices;
