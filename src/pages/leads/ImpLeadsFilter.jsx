import React from "react";
import Filters from "../../components/sliders/Filters";
import { useForm } from "react-hook-form";
import InputField from "../../components/fields/InputField";
import { useDispatch, useSelector } from "react-redux";
import { filterOptions, serviceCategoryOption } from "../../constants/options";
import MyButton from "../../components/buttons/MyButton";

const ImpLeadsFilter = ({
  isOpen = false,
  setIsOpen = () => {},
  onFilterSubmit,
  setIsFilterActive,
  filterData,
  resetFilter,
}) => {
  const dispatch = useDispatch();

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const onReset = () => {
    reset();
    resetFilter();
    setIsOpen(false);
    setIsFilterActive(false);
  };

  const onSubmit = (data) => {
    const filterObject = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );
    if (filterObject) {
      filterData(filterObject);
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
      onFilterCancel={() => onFilterSubmit(1, false, {})}
      className="space-y-4 font-extrabold"
      onSubmit={handleSubmit(onSubmit)}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
        <InputField
          control={control}
          errors={errors}
          label="Service Category"
          name="serviceCategory"
          type="select"
          mode="single"
          options={serviceCategoryOption}
        />

        <InputField
          control={control}
          errors={errors}
          label="Client Email"
          type="email"
          name="emailId"
        />
        <InputField
          control={control}
          errors={errors}
          label="Lead Date"
          name="date"
          type="option"
          options={filterOptions}
        />
        <div className="grid grid-cols-2 gap-x-2">
          <InputField
            control={control}
            errors={errors}
            label="From"
            name="fromDate"
            type="date"
          />
          <InputField
            control={control}
            errors={errors}
            label="To"
            name="toDate"
            type="date"
          />
        </div>

        <InputField
          control={control}
          errors={errors}
          label="Client Mobile Number"
          name="mobileNumber"
          type="number"
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

export default ImpLeadsFilter;
