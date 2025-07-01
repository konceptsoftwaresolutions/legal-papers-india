import React, { useEffect, useMemo, useState } from "react";

// icons
import { GrMoney } from "react-icons/gr";
import { GiMoneyStack } from "react-icons/gi";
import { GiTakeMyMoney } from "react-icons/gi";
import { GiReceiveMoney } from "react-icons/gi";

// form
import { useForm } from "react-hook-form";

// card
import NumberCard from "../../components/cards/NumberCard";
import InputField from "../../components/fields/InputField";
import MyButton from "../../components/buttons/MyButton";
import { LuListFilter } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategoryWiseRevenue,
  getSingleEmployeeWiseRevenue,
} from "../../redux/features/revenue";
import { serviceCategoryOption } from "../../constants/options";
import BottomFilter from "./BottomFilter";
import { getProfileBasedUser } from "../../redux/features/user";
import EmpRevenueFilter from "./EmpRevenueFilter";

const RevenueBottom = () => {
  const dispatch = useDispatch();
  const [category, setCategory] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [singleFilterOpen, setSingleFilteOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [dateTilesData, setDateTilesData] = useState();
  const [singleTilesData, setSingleTilesData] = useState();

  const [singleEmpData, setSingleEmpData] = useState();
  const [singleUserObj, setSingleUserObj] = useState({});

  useEffect(() => {
    dispatch(getCategoryWiseRevenue(category, "false"));
  }, [dispatch, category]);

  const { categoryRevenue, categoryDateRevenue } = useSelector(
    (state) => state.revenue
  );
  const { userData, profileBaseUser } = useSelector((state) => state.user);
  const { role } = useSelector((state) => state.auth);

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
    watch,
  } = useForm();

  // component
  const MyIcon = ({ children, className = "" }) => {
    return (
      <div className={`rounded-full p-3 text-white ${className}`}>
        {children}
      </div>
    );
  };

  const selectedCategory = watch("category");
  if (selectedCategory) {
    console.log(selectedCategory);
  }
  useEffect(() => {
    if (selectedCategory) {
      setCategory(selectedCategory);
    } else {
      setCategory("");
    }
  }, [selectedCategory]);

  const handleUserSubmit = (data) => {
    console.log(data);
    console.log(userOptions);
    const selectedUserObj = userOptions.find((user) => user.value === data);
    console.log("Selected User Object:", selectedUserObj);
    setSingleUserObj(selectedUserObj);
    dispatch(
      getSingleEmployeeWiseRevenue(
        selectedUserObj?.value,
        selectedUserObj?.label,
        (data) => {
          if (data) {
            console.log(data);
            setSingleEmpData(data);
          }
        }
      )
    );
  };

  if (singleTilesData) {
    console.log(singleTilesData);
  }

  return (
    <>
      <div className="w-full main-text py-2 flex flex-col justify-center border border-solid border-gray-200 items-center bg-white rounded-md shadow-md shadow-gray-200">
        <div className="py-2 px-4 w-full flex justify-between items-center flex-wrap gap-3">
          <div>
            {/* <h2 className="text-gray-800 font-medium text-[18px]">
              Sales Category Revenue
            </h2> */}
            {isFilterActive && (
              <p className="text-white rounded-md p-2 main-bg">
                Filter is active ...
              </p>
            )}
          </div>
          <div className="flex justify-end items-start gap-x-2 w-full">
            {role === "superAdmin" && (
              <div className="w-[200px]">
                <InputField
                  control={control}
                  errors={errors}
                  placeholder="Select Service Category"
                  type="option"
                  options={serviceCategoryOption}
                  name="category"
                />
              </div>
            )}
            {role !== "superAdmin" && (
              <form
                onSubmit={handleSubmit(handleUserSubmit)}
                className="w-[15rem] mr-2"
              >
                <InputField
                  name="selectedUser"
                  control={control}
                  options={userOptions}
                  type="option"
                  placeholder="Select Executive Names"
                  errors={errors}
                  onSelectChange={handleUserSubmit}
                />
              </form>
            )}

            {role === "superAdmin" && (
              <MyButton
                className="main-bg py-2 flex justify-center items-center text-[15px] font-medium px-4 gap-x-1"
                onClick={() => setIsFilterOpen(true)}
              >
                <LuListFilter size={16} />
                <span>Filter</span>
              </MyButton>
            )}
            {role !== "superAdmin" && (
              <MyButton
                className="main-bg py-2 flex justify-center items-center text-[15px] font-medium px-4 gap-x-1"
                onClick={() => setSingleFilteOpen(true)}
              >
                <LuListFilter size={16} />
                <span>Filter</span>
              </MyButton>
            )}
          </div>
          <div></div>
        </div>

        <div className="w-full h-[1px] my-2 bg-gray-300"></div>

        {role === "superAdmin" && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-3 py-2">
            <NumberCard
              title="Total Govt. Fees"
              number={categoryRevenue?.totalGovtFees.toFixed(2)}
            />

            <NumberCard
              title="Total Tax Amount"
              number={categoryRevenue?.totalTaxAmount.toFixed(2)}
            />

            <NumberCard
              title="Total Revenue"
              number={categoryRevenue?.totalAmountAfterGst.toFixed(2)}
            />

            <NumberCard
              title="Total Turnover"
              number={categoryRevenue?.totalTurnOver.toFixed(2)}
            />
            <NumberCard
              title="Current Month Revenue"
              number={categoryRevenue?.totalAmountAfterGstForCurrentMonth.toFixed(
                2
              )}
            />
            <NumberCard
              title="Dated Revenue"
              number={dateTilesData?.datedFilter.toFixed(2)}
            />
            <NumberCard
              title="Dated Govt. Fees"
              number={dateTilesData?.datedGovtFees.toFixed(2)}
            />
            <NumberCard
              title="Dated Tax Amount"
              number={dateTilesData?.datedTaxAmount.toFixed(2)}
            />

            <NumberCard
              title="Dated Turnover"
              number={dateTilesData?.datedTurnOver.toFixed(2)}
            />
            <NumberCard title="All Revenue" number={0} />
          </div>
        )}

        {role !== "superAdmin" && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-3 py-2">
            <NumberCard
              title="Total Revenue"
              number={singleEmpData?.totalAmountAfterGst.toFixed(2)}
            />
            <NumberCard
              title="Current Month Revenue"
              number={singleEmpData?.totalAmountAfterGstForCurrentMonth.toFixed(
                2
              )}
            />
            <NumberCard
              title="Dated Revenue"
              number={singleTilesData?.datedFilter.toFixed(2)}
            />
          </div>
        )}
      </div>
      <BottomFilter
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
        category={category}
        setIsFilterActive={setIsFilterActive}
        setDateTilesData={setDateTilesData}
      />
      <EmpRevenueFilter
        isOpen={singleFilterOpen}
        setIsOpen={setSingleFilteOpen}
        // name={selectedUserData?.name}
        name={role !== "superAdmin" ? userData?.name : null}
        // nameWithProfile={selectedUserData?.nameWithProfile}
        nameWithProfile={
          role !== "superAdmin" ? userData?.name + " " + "(" + role + ")" : null
        }
        setIsFilterActive={setIsFilterActive}
        type="single"
        setDateTilesData={setSingleTilesData}
      />
    </>
  );
};

export default RevenueBottom;
