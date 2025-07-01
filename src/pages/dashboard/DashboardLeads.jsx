import React, { useEffect } from "react";

// components
import GrowthCard from "../../components/cards/GrowthCard";

// icons
import { CgCalendarToday } from "react-icons/cg"; // today
import { BsCalendar3Week } from "react-icons/bs"; // weekly
import { MdOutlineCalendarMonth } from "react-icons/md"; // monthly
import { useDispatch, useSelector } from "react-redux";
import { getDashTilesData } from "../../redux/features/dashboard";

const DashboardLeads = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDashTilesData());
  }, [dispatch]);

  const { dailyLead, weekllyLead, monthlyLead } = useSelector(
    (state) => state.dashboard
  );

  const currentDayLeads = dailyLead?.currentDayLeads;
  const previousDayLeads = dailyLead?.previousDayLeads;

  const percentageChange = (
    ((currentDayLeads - previousDayLeads) / previousDayLeads) *
    100
  ).toFixed(2);

  const percentageCalculator = (initial, previous) => {
    if (previous === 0) {
      return 100; // Return 100% when the previous value is 0
    }
    const percentageChange = (((initial - previous) / previous) * 100).toFixed(
      2
    );
    return percentageChange;
  };

  //   console.log(`Lead Percentage Change: ${percentageChange.toFixed(2)}%`);

  const MyIcon = ({ children, className = "" }) => {
    return (
      <div className={`rounded-full p-3 text-white ${className}`}>
        {children}
      </div>
    );
  };
  return (
    <>
      <div className="w-full main-text py-2 flex flex-col justify-center border border-solid border-gray-200 items-center bg-white rounded-md shadow-md shadow-gray-200">
        <div className="py-2 px-4 w-full">
          <h2 className="text-gray-800 font-medium text-[18px]">Leads</h2>
        </div>

        <div className="w-full h-[1px] my-2 bg-gray-300"></div>

        <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1  gap-x-3  gap-y-7 px-3 py-2">
          <GrowthCard
            title="Today's Leads"
            number={dailyLead?.currentDayLeads}
            percentage={percentageCalculator(
              dailyLead?.currentDayLeads,
              dailyLead?.previousDayLeads
            )}
            icon={
              <MyIcon className="bg-yellow-700">
                <CgCalendarToday size={26} />
              </MyIcon>
            }
          />

          <GrowthCard
            title="Weekly Leads"
            number={weekllyLead?.currentWeekLeads}
            percentage={percentageCalculator(
              weekllyLead?.currentWeekLeads,
              weekllyLead?.previousWeekLeads
            )}
            icon={
              <MyIcon className="bg-rose-700">
                <BsCalendar3Week size={24} />
              </MyIcon>
            }
          />

          <GrowthCard
            title="Monthly Leads"
            number={monthlyLead?.currentMonthLeads}
            percentage={percentageCalculator(
              monthlyLead?.currentMonthLeads,
              monthlyLead?.previousMonthLeads
            )}
            icon={
              <MyIcon className="bg-green-700">
                <MdOutlineCalendarMonth size={25} />
              </MyIcon>
            }
          />

          <GrowthCard
            title="Monthly Leads"
            number="0"
            // percentage={percentageCalculator(
            //   monthlyLead?.currentMonthLeads,
            //   monthlyLead?.previousMonthLeads
            // )}
            icon={
              <MyIcon className="bg-green-700">
                <MdOutlineCalendarMonth size={25} />
              </MyIcon>
            }
          />

          <GrowthCard
            title="Yesterday's NCBucket Leads

"
            number="0"
            // percentage={percentageCalculator(
            //   monthlyLead?.currentMonthLeads,
            //   monthlyLead?.previousMonthLeads
            // )}
            icon={
              <MyIcon className="bg-green-700">
                <MdOutlineCalendarMonth size={25} />
              </MyIcon>
            }
          />

          <GrowthCard
            title="Monthly NCBucket Leads"
            number="0"
            // percentage={percentageCalculator(
            //   monthlyLead?.currentMonthLeads,
            //   monthlyLead?.previousMonthLeads
            // )}
            icon={
              <MyIcon className="bg-green-700">
                <MdOutlineCalendarMonth size={25} />
              </MyIcon>
            }
          />
        </div>
      </div>
    </>
  );
};

export default DashboardLeads;
