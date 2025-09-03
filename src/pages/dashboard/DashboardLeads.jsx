// import React, { useEffect } from "react";

// // components
// import GrowthCard from "../../components/cards/GrowthCard";

// // icons
// import { CgCalendarToday } from "react-icons/cg"; // today
// import { BsCalendar3Week } from "react-icons/bs"; // weekly
// import { MdOutlineCalendarMonth } from "react-icons/md"; // monthly
// import { useDispatch, useSelector } from "react-redux";
// import { getDashTilesData } from "../../redux/features/dashboard";

// const DashboardLeads = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(getDashTilesData());
//   }, [dispatch]);

//   const { dailyLead, weekllyLead, monthlyLead } = useSelector(
//     (state) => state.dashboard
//   );

//   const currentDayLeads = dailyLead?.currentDayLeads;
//   const previousDayLeads = dailyLead?.previousDayLeads;

//   const percentageChange = (
//     ((currentDayLeads - previousDayLeads) / previousDayLeads) *
//     100
//   ).toFixed(2);

//   const percentageCalculator = (initial, previous) => {
//     if (previous === 0) {
//       return 100; // Return 100% when the previous value is 0
//     }
//     const percentageChange = (((initial - previous) / previous) * 100).toFixed(
//       2
//     );
//     return percentageChange;
//   };

//   //   console.log(`Lead Percentage Change: ${percentageChange.toFixed(2)}%`);

//   const MyIcon = ({ children, className = "" }) => {
//     return (
//       <div className={`rounded-full p-3 text-white ${className}`}>
//         {children}
//       </div>
//     );
//   };
//   return (
//     <>
//       <div className="w-full main-text py-2 flex flex-col justify-center border border-solid border-gray-200 items-center bg-white rounded-md shadow-md shadow-gray-200">
//         <div className="py-2 px-4 w-full">
//           <h2 className="text-gray-800 font-medium text-[18px]">Leads</h2>
//         </div>

//         <div className="w-full h-[1px] my-2 bg-gray-300"></div>

//         <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1  gap-x-3  gap-y-7 px-3 py-2">
//           <GrowthCard
//             title="Today's Leads"
//             number={dailyLead?.currentDayLeads}
//             percentage={percentageCalculator(
//               dailyLead?.currentDayLeads,
//               dailyLead?.previousDayLeads
//             )}
//             icon={
//               <MyIcon className="bg-yellow-700">
//                 <CgCalendarToday size={26} />
//               </MyIcon>
//             }
//           />

//           <GrowthCard
//             title="Weekly Leads"
//             number={weekllyLead?.currentWeekLeads}
//             percentage={percentageCalculator(
//               weekllyLead?.currentWeekLeads,
//               weekllyLead?.previousWeekLeads
//             )}
//             icon={
//               <MyIcon className="bg-rose-700">
//                 <BsCalendar3Week size={24} />
//               </MyIcon>
//             }
//           />

//           <GrowthCard
//             title="Monthly Leads"
//             number={monthlyLead?.currentMonthLeads}
//             percentage={percentageCalculator(
//               monthlyLead?.currentMonthLeads,
//               monthlyLead?.previousMonthLeads
//             )}
//             icon={
//               <MyIcon className="bg-green-700">
//                 <MdOutlineCalendarMonth size={25} />
//               </MyIcon>
//             }
//           />

//           <GrowthCard
//             title="Monthly Leads"
//             number="0"
//             // percentage={percentageCalculator(
//             //   monthlyLead?.currentMonthLeads,
//             //   monthlyLead?.previousMonthLeads
//             // )}
//             icon={
//               <MyIcon className="bg-green-700">
//                 <MdOutlineCalendarMonth size={25} />
//               </MyIcon>
//             }
//           />

//           <GrowthCard
//             title="Yesterday's NCBucket Leads

// "
//             number="0"
//             // percentage={percentageCalculator(
//             //   monthlyLead?.currentMonthLeads,
//             //   monthlyLead?.previousMonthLeads
//             // )}
//             icon={
//               <MyIcon className="bg-green-700">
//                 <MdOutlineCalendarMonth size={25} />
//               </MyIcon>
//             }
//           />

//           <GrowthCard
//             title="Monthly NCBucket Leads"
//             number="0"
//             // percentage={percentageCalculator(
//             //   monthlyLead?.currentMonthLeads,
//             //   monthlyLead?.previousMonthLeads
//             // )}
//             icon={
//               <MyIcon className="bg-green-700">
//                 <MdOutlineCalendarMonth size={25} />
//               </MyIcon>
//             }
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// export default DashboardLeads;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashTilesData } from "../../redux/features/dashboard";
import AnniversarySplash from "../../common/anniversary/AnniversarySplash";
import { motion } from "framer-motion";
import {
  CalendarDays,
  BarChartBig,
  CalendarClock,
  FlameKindling,
  Medal,
  TrendingUp,
} from "lucide-react";

const DashboardLeads = () => {
  const dispatch = useDispatch();
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    dispatch(getDashTilesData());
  }, [dispatch]);

  const { dailyLead, weekllyLead, monthlyLead } = useSelector(
    (state) => state.dashboard
  );

  const percentageCalculator = (current, previous) => {
    if (!previous || previous === 0) return "100.00";
    return (((current - previous) / previous) * 100).toFixed(2);
  };

  const leadCards = [
    {
      title: "Today's Leads",
      number: dailyLead?.currentDayLeads || 0,
      percentage: percentageCalculator(
        dailyLead?.currentDayLeads || 0,
        dailyLead?.previousDayLeads || 0
      ),
      icon: <CalendarDays size={28} strokeWidth={2.2} />,
      bg: "from-yellow-400 to-orange-500",
    },
    {
      title: "Weekly Leads",
      number: weekllyLead?.currentWeekLeads || 0,
      percentage: percentageCalculator(
        weekllyLead?.currentWeekLeads || 0,
        weekllyLead?.previousWeekLeads || 0
      ),
      icon: <BarChartBig size={28} strokeWidth={2.2} />,
      bg: "from-pink-500 to-rose-600",
    },
    {
      title: "Monthly Leads",
      number: monthlyLead?.currentMonthLeads || 0,
      percentage: percentageCalculator(
        monthlyLead?.currentMonthLeads || 0,
        monthlyLead?.previousMonthLeads || 0
      ),
      icon: <CalendarClock size={28} strokeWidth={2.2} />,
      bg: "from-green-400 to-emerald-600",
    },
    {
      title: "Last Month's Leads",
      number: 0,
      icon: <TrendingUp size={28} strokeWidth={2.2} />,
      bg: "from-indigo-500 to-blue-700",
    },
    {
      title: "Yesterday's NC Leads",
      number: 0,
      icon: <FlameKindling size={28} strokeWidth={2.2} />,
      bg: "from-purple-500 to-fuchsia-600",
    },
    {
      title: "Total NC Leads",
      number: 0,
      icon: <Medal size={28} strokeWidth={2.2} />,
      bg: "from-teal-500 to-cyan-600",
    },
  ];

  return (
    <>
      {!showDashboard && (
        <AnniversarySplash onFinish={() => setShowDashboard(true)} />
      )}

      {showDashboard && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="relative w-full rounded-3xl bg-white shadow-2xl border border-gray-100 p-8 overflow-hidden"
        >

          <div className="pt-4">
            <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
              {leadCards.map((card, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="relative p-6 rounded-2xl shadow-lg bg-white border border-gray-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  <div
                    className={`absolute inset-0 -z-10 blur-xl opacity-30 rounded-2xl bg-gradient-to-tr ${card.bg}`}
                  ></div>

                  <div className="flex items-center justify-between">
                    <div
                      className={`text-white rounded-full p-3 bg-gradient-to-br ${card.bg} shadow-md`}
                    >
                      {card.icon}
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        {card.title}
                      </p>
                      <h3 className="text-2xl font-extrabold text-gray-800">
                        {card.number}
                      </h3>
                      {card.percentage && (
                        <p
                          className={`text-sm font-semibold mt-1 ${
                            parseFloat(card.percentage) >= 0
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {parseFloat(card.percentage) >= 0 ? "▲" : "▼"}{" "}
                          {Math.abs(card.percentage)}%
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default DashboardLeads;
