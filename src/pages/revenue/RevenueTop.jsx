import React, { useEffect, useState, useMemo } from "react";

// form
import { useForm } from "react-hook-form";

// card
import NumberCard from "../../components/cards/NumberCard";
import InputField from "../../components/fields/InputField";
import MyButton from "../../components/buttons/MyButton";
import { LuListFilter } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeWiseRevenue } from "../../redux/features/revenue";
import TopFilter from "./TopFilter";

const RevenueTop = () => {
  const dispatch = useDispatch();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [tilesData, setTilesData] = useState();
  const { profileBaseUser } = useSelector((state) => state.user);
  const { empRevenue, empDateRevenue } = useSelector((state) => state.revenue);
  const { role } = useSelector((state) => state.auth);

  const {
    control,
    formState: { errors },
    watch,
  } = useForm();

  // Memoizing options to prevent unnecessary recalculations
  const salesExecutiveOptions = useMemo(() => {
    return profileBaseUser?.map((executive) => ({
      label: executive.name,
      value: executive.nameWithProfile,
    }));
  }, [profileBaseUser]);

  const selectedExecutiveValue = watch("executive");

  useEffect(() => {
    if (selectedExecutiveValue) {
      const selectedExecutive = salesExecutiveOptions?.find(
        (executive) => executive.value === selectedExecutiveValue
      );
      if (selectedExecutive) {
        setSelectedOption(selectedExecutive);
        dispatch(
          getEmployeeWiseRevenue(
            selectedExecutive.label,
            selectedExecutive.value
          )
        );
      }
    }
  }, [dispatch, selectedExecutiveValue, salesExecutiveOptions]);

  return (
    <>
      <div className="w-full main-text py-2 flex flex-col justify-center border border-solid border-gray-200 items-center bg-white rounded-md shadow-md shadow-gray-200">
        <div className="py-2 px-4 w-full flex justify-between items-center flex-wrap gap-3">
          <div>
            {/* <h2 className="text-gray-800 font-medium text-[18px]">
              Sales Executive Revenues
            </h2> */}
            {isFilterActive && (
              <p className="text-white rounded-md p-2 main-bg">
                Filter is active ...
              </p>
            )}
          </div>
          <div className="flex justify-center items-start gap-x-2">
            <form className="flex gap-x-2">
              {/* <div className="w-[200px]">
                <InputField
                  control={control}
                  errors={errors}
                  placeholder="Select Executive Name"
                  type="option"
                  name="executive"
                  options={salesExecutiveOptions}
                />
              </div> */}
              <MyButton
                className="main-bg py-2 flex justify-center items-center text-[15px] font-medium px-4 gap-x-1"
                onClick={() => setIsFilterOpen(true)}
              >
                <LuListFilter size={16} />
                <span>Filter</span>
              </MyButton>
            </form>
          </div>
        </div>

        <div className="w-full h-[1px] my-2 bg-gray-300"></div>

        {/* <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-3 py-2">
          {!(role === "operationsTl" || role === "salesTl") && (
            <NumberCard
              title="Total Tax Amount"
              number={empRevenue ? empRevenue?.totalTaxAmount.toFixed(2) : "0"}
            />
          )}

          <NumberCard
            title="Total Revenue"
            number={
              empRevenue ? empRevenue?.totalAmountAfterGst.toFixed(2) : "0"
            }
          />
          {!(role === "operationsTl" || role === "salesTl") && (
            <NumberCard
              title="Total Turnover"
              number={empRevenue ? empRevenue?.totalTurnOver.toFixed(2) : "0"}
            />
          )}
          <NumberCard
            title="Current Month Revenue"
            number={
              empRevenue
                ? empRevenue?.totalAmountAfterGstForCurrentMonth.toFixed(2)
                : "0"
            }
          />
          <NumberCard
            title="Dated Revenue"
            number={
              empDateRevenue ? empDateRevenue?.datedFilter.toFixed(2) : "0"
            }
          />
          {!(role === "operationsTl" || role === "salesTl") && (
            <NumberCard
              title="Dated Govt. Fees"
              number={
                empDateRevenue ? empDateRevenue?.datedGovtFees.toFixed(2) : "0"
              }
            />
          )}

          {!(role === "operationsTl" || role === "salesTl") && (
            <NumberCard
              title="Dated Tax Amount"
              number={
                empDateRevenue ? empDateRevenue?.datedTaxAmount.toFixed(2) : "0"
              }
            />
          )}

          {!(role === "operationsTl" || role === "salesTl") && (
            <NumberCard
              title="Dated Turnover"
              number={
                empDateRevenue ? empDateRevenue?.datedTurnOver.toFixed(2) : "0"
              }
            />
          )}
        </div> */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-3 py-2">
          {/* <NumberCard
            title="No. of Auto Lead Assigned"
            showSign={false}
            number={
              tilesData?.totalAutoLeadAssigned
                ? tilesData.totalAutoLeadAssigned
                : "0"
            }
          />
          <NumberCard
            title="No. of Leads"
            showSign={false}
            number={
              tilesData?.totalLeadsAdded ? tilesData.totalLeadsAdded : "0"
            }
          />

          <NumberCard
            title="No. of NC Bucket Leads"
            showSign={false}
            number={
              tilesData?.totalNoClaimBucket ? tilesData.totalNoClaimBucket : "0"
            }
          />

          <NumberCard
            title="No of Today's NCBucket Leads"
            showSign={false}
            number={
              tilesData?.totalTodayNcBucketLead
                ? tilesData.totalTodayNcBucketLead
                : "0"
            }
          />
          <NumberCard
            title="Leads transferred from NC Bucket"
            showSign={false}
            number={
              tilesData?.leadsTransferredFromNCB
                ? tilesData.leadsTransferredFromNCB
                : "0"
            }
          />

          <NumberCard
            title="Work done on different leads"
            showSign={false}
            number={
              tilesData?.workDoneOnDifferentLeads
                ? tilesData.workDoneOnDifferentLeads
                : "0"
            }
          /> */}

          <NumberCard
            title="Total Leads (Fresh & Self generated)"
            showSign={false}
            number={tilesData?.totalLeadsAll || "0"} // ✅ totalLeadsAll
          />

          <NumberCard
            title="Fresh Leads (Facebook & Sites)"
            showSign={false}
            number={tilesData?.freshLeads || "0"} // ✅ freshLeads
          />

          <NumberCard
            title="Self generated (manual)"
            showSign={false}
            number={tilesData?.selfGeneratedLeads || "0"} // ✅ selfGeneratedLeads
          />

          <NumberCard
            title="Lead Page to NC Bucket"
            showSign={false}
            number={tilesData?.ncBucketMoved || "0"} // ✅ ncBucketMoved
          />

          <NumberCard
            title="NC Data transfer"
            showSign={false}
            number={tilesData?.bucketTransferredByTL || "0"} // ✅ bucketTransferredByTL
          />

          <NumberCard
            title="NC Page to Bucket"
            showSign={false}
            number={tilesData?.ncBucketTransferredByTL || "0"} // ✅ ncBucketTransferredByTL
          />

          <NumberCard
            title="NC Activity"
            showSign={false}
            number={tilesData?.ncActivityByTL || "0"} // ✅ ncActivityByTL
          />

          <NumberCard
            title="Lead Page Activity"
            showSign={false}
            number={tilesData?.otherLeadsActivity || "0"} // ✅ otherLeadsActivity
          />

          <NumberCard
            title="Renewal page Activity"
            showSign={false}
            number={tilesData?.renewalLeadsActivity || "0"} // ✅ otherLeadsActivity
          />
          <NumberCard
            title="All Page activity"
            showSign={false}
            number={tilesData?.totalUniqueActivity || "0"} // ✅ otherLeadsActivity
          />
        </div>
      </div>
      <TopFilter
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
        name={selectedOption?.label || ""}
        nameWithProfile={selectedOption?.value || ""}
        setIsFilterActive={setIsFilterActive}
        setTilesData={setTilesData}
      />
    </>
  );
};

export default RevenueTop;
