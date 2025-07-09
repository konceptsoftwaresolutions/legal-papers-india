import React, { useEffect, useMemo } from "react";
import Filters from "../../components/sliders/Filters";
import { useForm } from "react-hook-form";
import InputField from "../../components/fields/InputField";
import { useDispatch, useSelector } from "react-redux";
import { filterOptions, serviceCategoryOption } from "../../constants/options";

import {
  dateBasisLeadCount,
  getDateFilterRevenue,
  getEmployeeWiseRevenue,
  getSingDateFilterRevenue,
  setRevenue,
} from "../../redux/features/revenue";
import { getProfileBasedUser } from "../../redux/features/user";
import MyButton from "../../components/buttons/MyButton";

const leadSourceOptions = [
  {
    value: "fssairegistrationportal.org",
    label: "fssairegistrationportal.org",
  },
  {
    value: "fssairegistration-portal.org",
    label: "fssairegistration-portal.org",
  },
  {
    value: "ieccode-portal.org",
    label: "ieccode-portal.org",
  },
  { value: "ieccode-india.org", label: "ieccode-india.org" },
  { value: "iecode-india.org", label: "iecode-india.org" },
  {
    label: "fssai-registrationportal.org",
    value: "fssai-registrationportal.org",
  },
  { value: "fssailicenseportal.org", label: "fssailicenseportal.org" },
  { value: "website", label: "Website" },
  { value: "meta", label: "Meta" },
  { value: "legalpapersindia.com", label: "legalpapersindia.com" },
  {
    value: "fssaicertificateportal.org",
    label: "fssaicertificateportal.org",
  },
  { value: "selfGeneratedLead", label: "Self Generated Lead" },
];

const TopFilter = ({
  isOpen = false,
  setIsOpen = () => {},
  setIsFilterActive,
  name,
  nameWithProfile,
  setTilesData,
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

    dispatch(setRevenue({ empDateRevenue: null }));
    setTilesData(null);
    setIsFilterActive(false);
  };

  const { profileBaseUser } = useSelector((state) => state.user);

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

  const onSubmit = (data) => {
    console.log(data);

    const filteredUsers = profileBaseUser?.filter((userObj) =>
      userObj.nameWithProfile.includes(data?.user)
    );

    console.log("Filtered Users:", filteredUsers);
    const payload = {
      ...data,
      name: filteredUsers[0]?.name,
      nameWithProfile: filteredUsers[0]?.nameWithProfile,
    };
    delete payload.user;

    setIsFilterActive(true);

    console.log("xxxxxx", payload);

    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).filter(
        ([_, value]) => value !== "" && value !== undefined && value !== null
      )
    );

    dispatch(
      dateBasisLeadCount(cleanedPayload, (error, data) => {
        if (error) {
          console.error("API Error:", error);
        } else {
          console.log("API Response:", data);
          setTilesData(data);
          // You can perform additional actions with revenueData here
        }
      })
    );
    setIsOpen(false);
    // const filterObject = Object.fromEntries(
    //   Object.entries(data).filter(
    //     ([_, value]) => value !== undefined && value !== ""
    //   )
    // );
    // if (data) {
    //   setIsFilterActive(true);
    //   // if (type === "single") {
    //   //   dispatch(getSingDateFilterRevenue(name, nameWithProfile, filterObject));
    //   // } else {
    //   dispatch(getDateFilterRevenue(name, nameWithProfile, data));
    //   // }
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
        <InputField
          type="option"
          control={control}
          errors={errors}
          label="Select User"
          name="user"
          mode="single"
          options={userOptions}
        />
        <InputField
          control={control}
          errors={errors}
          label="Select Category"
          type="option"
          options={serviceCategoryOption}
          name="serviceCategory"
        />
        <InputField
          control={control}
          errors={errors}
          label="Lead Source"
          name="leadSource"
          type="select"
          options={leadSourceOptions}
        />
        <p className="text-xs italic font-semibold">
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

export default TopFilter;
