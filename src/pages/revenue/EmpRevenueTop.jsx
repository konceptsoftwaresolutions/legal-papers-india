import React, { useEffect, useMemo, useState } from "react";

// form
import { useForm } from "react-hook-form";

// card
import NumberCard from "../../components/cards/NumberCard";
import InputField from "../../components/fields/InputField";
import MyButton from "../../components/buttons/MyButton";
import { LuListFilter } from "react-icons/lu";
import TopFilter from "./TopFilter";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmployeeWiseRevenue,
  getSingleEmployeeWiseRevenue,
} from "../../redux/features/revenue";
import EmpRevenueFilter from "./EmpRevenueFilter";
import { getProfileBasedUser } from "../../redux/features/user";

const empSingRevenueTop = () => {
  const dispatch = useDispatch();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState({});
  const [empTilesData, setEmpTilesData] = useState();
  const [dateTilesData, setDateTilesData] = useState();

  const { userData, profileBaseUser } = useSelector((state) => state.user);
  const { role } = useSelector((state) => state.auth);

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

  //   getEmployeeWiseRevenu

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm();

  const { empSingRevenue, empSingDateRevenue } = useSelector(
    (state) => state.revenue
  );

  const selectedUser = watch("selectedUser");
  useEffect(() => {
    if (selectedUser) {
      handleSubmit(handleUserSubmit)();
    }
  }, [selectedUser]);

  const handleUserSubmit = (data) => {
    const selectedUserObj = userOptions.find(
      (user) => user.value === data.selectedUser
    );
    console.log("Selected User Object:", selectedUserObj);
    const payload = {
      name: selectedUserObj.value,
      nameWithProfile: selectedUserObj.label,
    };
    setSelectedUserData(payload);

    dispatch(
      getEmployeeWiseRevenue(
        payload.name,
        payload.nameWithProfile,
        (error, revenueData) => {
          if (error) {
            console.error("API Error:", error);
          } else {
            console.log("API Response:", revenueData);
            setEmpTilesData(revenueData);
            // You can perform additional actions with revenueData here
          }
        }
      )
    );
  };

  // if (empTilesData) {
  //   console.log(empTilesData);
  // }

  useEffect(() => {
    if (
      role === "salesTl" ||
      role === "salesExecutive" ||
      role === "operationsTl" ||
      role === "operationsExecutive"
    ) {
      dispatch(
        getEmployeeWiseRevenue(
          userData?.name,
          userData?.name + " " + "(" + role + ")",
          (error, revenueData) => {
            if (error) {
              console.error("API Error:", error);
            } else {
              console.log("API Response:", revenueData);
              setEmpTilesData(revenueData);
              // You can perform additional actions with revenueData here
            }
          }
        )
      );
    }
  }, [role]);

  return (
    <>
      <div className="w-full main-text py-2 flex flex-col justify-center border border-solid border-gray-200 items-center bg-white rounded-md shadow-md shadow-gray-200">
        <div className="py-2 px-4 w-full flex justify-between items-center flex-wrap gap-3">
          <div>
            {/* <h2 className="text-gray-800 font-medium text-[18px]">Revenue</h2> */}
            {isFilterActive && (
              <p className="text-white rounded-md p-2 main-bg">
                Filter is active ...
              </p>
            )}
          </div>

          <div className="flex">
            {["superAdmin"].includes(role) && (
              <form
                onSubmit={handleSubmit(handleUserSubmit)}
                className="w-full sm:w-[20rem] mr-2"
              >
                <InputField
                  name="selectedUser"
                  control={control}
                  options={userOptions}
                  type="option"
                  placeholder="Select Executive Names"
                  errors={errors}
                />
              </form>
            )}
            <MyButton
              className="main-bg py-2 flex justify-center items-center text-[15px] font-medium px-4 gap-x-1"
              onClick={() => setIsFilterOpen(true)}
            >
              <LuListFilter size={16} />
              <span>Filter</span>
            </MyButton>
          </div>
        </div>

        <div className="w-full h-[1px] my-2 bg-gray-300"></div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-3 py-2">
          <NumberCard
            title="Total Govt. Fees"
            number={empTilesData?.totalGovtFees?.toFixed(2)}
          />
          <NumberCard
            title="Total Tax Amount"
            number={empTilesData?.totalTaxAmount?.toFixed(2)}
          />
          <NumberCard
            title="Total Revenue"
            number={empTilesData?.totalAmountAfterGst?.toFixed(2)}
          />
          <NumberCard
            title="Total Turnover"
            number={empTilesData?.totalTurnOver?.toFixed(2)}
          />
          <NumberCard
            title="Current Month Revenue"
            number={empTilesData?.totalAmountAfterGstForCurrentMonth?.toFixed(
              2
            )}
          />
          <NumberCard
            title="Dated Revenue"
            number={dateTilesData?.datedFilter?.toFixed(2)}
          />
          <NumberCard
            title="Dated Govt. Fees"
            number={dateTilesData?.datedGovtFees?.toFixed(2)}
          />
          <NumberCard
            title="Dated Tax Amount"
            number={dateTilesData?.datedTaxAmount?.toFixed(2)}
          />
          <NumberCard
            title="Dated Turnover"
            number={dateTilesData?.datedTurnOver?.toFixed(2)}
          />
        </div>
      </div>
      <EmpRevenueFilter
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
        // name={selectedUserData?.name}
        name={role !== "superAdmin" ? userData?.name : selectedUserData?.name}
        // nameWithProfile={selectedUserData?.nameWithProfile}
        nameWithProfile={
          role !== "superAdmin"
            ? userData?.name + " " + "(" + role + ")"
            : selectedUserData?.nameWithProfile
        }
        setIsFilterActive={setIsFilterActive}
        type="single"
        setDateTilesData={setDateTilesData}
      />
    </>
  );
};

export default empSingRevenueTop;
