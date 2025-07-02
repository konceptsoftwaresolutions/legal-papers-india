import React from "react";
import Filters from "../../components/sliders/Filters";
import { useForm } from "react-hook-form";
import InputField from "../../components/fields/InputField";
import { useDispatch, useSelector } from "react-redux";
import { filterOptions } from "../../constants/options";

import {
  getDateFilterRevenue,
  getEmployeeWiseRevenue,
  getSingDateFilterRevenue,
  setRevenue,
} from "../../redux/features/revenue";
import toastify from "../../constants/toastify";
import MyButton from "../../components/buttons/MyButton";

const EmpRevenueFilter = ({
  isOpen = false,
  setIsOpen = () => {},
  setIsFilterActive,
  name,
  type,
  nameWithProfile,
  setDateTilesData,
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
    setIsOpen(false);
    setDateTilesData(null);
    if (type === "single") {
      dispatch(setRevenue({ empSingDateRevenue: null }));
    } else {
      dispatch(setRevenue({ empDateRevenue: null }));
    }
    setIsFilterActive(false);
  };

  const onSubmit = (data) => {
    console.log(data);
    const payload = {
      ...data,
      important: false,
      name: name,
      nameWithProfile: nameWithProfile,
    };
    console.log(payload);
    setIsFilterActive(true);
    if (!name && !nameWithProfile) {
      toastify({ msg: "Select the executive first...", type: "error" });
    } else {
      dispatch(
        getDateFilterRevenue(payload, (error, dateData) => {
          if (error) {
            console.error("API Error:", error);
            setDateTilesData(null);
          } else {
            console.log("API Response:", dateData);
            setDateTilesData(dateData);
            // You can perform additional actions with revenueData here
          }
        })
      );
    }
    setIsOpen(false);
    // const filterObject = Object.fromEntries(
    //   Object.entries(data).filter(
    //     ([_, value]) => value !== undefined && value !== ""
    //   )
    // );
    // if (filterObject) {
    //   setIsFilterActive(true);
    //   if (type === "single") {
    //     dispatch(getSingDateFilterRevenue(name, nameWithProfile, filterObject));
    //   } else {
    //     dispatch(getDateFilterRevenue(name, nameWithProfile, filterObject));
    //   }

    //   setIsOpen(false);
    // }
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
        </div>{" "}
        <p className="text-xs font-semibold italic">
          ** NOTE - For optimal results when using the 'From-To' date filter,
          please select the day prior as the start date. For example, setting
          the filter from 21/01/2025 to 22/01/2025 will only display leads for
          22/01/2025.
        </p>
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

export default EmpRevenueFilter;
