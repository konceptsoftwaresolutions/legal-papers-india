import React, { useEffect, useMemo } from "react";
import Filters from "../../components/sliders/Filters";
import { useForm } from "react-hook-form";
import InputField from "../../components/fields/InputField";
import { useDispatch, useSelector } from "react-redux";
import { filterOptions } from "../../constants/options";

import {
  getCategoryDateFilterRevenue,
  getCategoryWiseRevenue,
  getEmployeeWiseRevenue,
  setRevenue,
} from "../../redux/features/revenue";
import { getProfileBasedUser } from "../../redux/features/user";
import toastify from "../../constants/toastify";
import MyButton from "../../components/buttons/MyButton";

const BottomFilter = ({
  isOpen = false,
  setIsOpen = () => {},
  setIsFilterActive,
  category,
  setDateTilesData,
}) => {
  const dispatch = useDispatch();

  const { profileBaseUser } = useSelector((state) => state.user);
  console.log(profileBaseUser);
  const { role } = useSelector((state) => state.auth);

  // ---new ---
  useEffect(() => {
    dispatch(getProfileBasedUser());
  }, []);

  const userOptions = useMemo(() => {
    if (profileBaseUser) {
      return profileBaseUser?.map(({ nameWithProfile, name }) => ({
        label: nameWithProfile,
        value: name,
      }));
    }
  }, [profileBaseUser]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const onReset = () => {
    reset();
    dispatch(setRevenue({ categoryDateRevenue: null }));
    setIsFilterActive(false);
  };

  const onSubmit = (data) => {
    setIsFilterActive(true);
    console.log(data);

    // Filtering based on the names in the 'user' array from the form data
    const filteredUsers = profileBaseUser?.filter((userObj) =>
      data?.user?.includes(userObj.name)
    );

    console.log("Filtered Users:", filteredUsers);
    const payload = {
      ...data,
      user: filteredUsers,
      important: false,
      serviceCategory: category,
    };

    console.log(payload);
    if (!category && role === "superAdmin") {
      toastify({ msg: "Select the category first...", type: "error" });
    } else {
      dispatch(
        getCategoryDateFilterRevenue(payload, (error, dateData) => {
          if (error) {
            console.error("API Error:", error);
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
    //   dispatch(getCategoryDateFilterRevenue(category, filterObject));
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
        {role === "superAdmin" && (
          <InputField
            type="select"
            control={control}
            errors={errors}
            label="Select User"
            options={userOptions}
            name="user"
          />
        )}
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

export default BottomFilter;
