import React, { useEffect, useState } from "react";

// components
import DashboardLeads from "./DashboardLeads";
import AreaChart from "../../components/charts/AreaChart";
import UserList from "../../components/lists/UserList";
import {
  getDashboardData,
  getDashboardGraphData,
  getDashTilesData,
} from "../../redux/features/dashboard";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationData } from "../../redux/features/notification";
import { DatePicker } from "antd";
import moment from "moment";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [chartData, setChartData] = useState();
  useEffect(() => {
    dispatch(getDashboardData());
    // dispatch(getNotificationData());
  }, [dispatch]);

  const { dashboardData } = useSelector((state) => state.dashboard);
  const { role } = useSelector((state) => state.auth);

  const currentYear = moment().year(); // e.g., 2025

  const [selectedYear, setSelectedYear] = useState(moment().format("YYYY"));

  let series1 = chartData?.monthWiseLead?.map((item) => Object.values(item)[0]);

  let series2 = chartData?.monthClosure?.map((item) => Object.values(item)[0]);

  useEffect(() => {
    console.log(series1, series2);
  }, [series1, series2]);

  useEffect(() => {
    if (selectedYear) {
      dispatch(
        getDashboardGraphData(selectedYear, (success, data) => {
          if (success) {
            setChartData(data);
          }
        })
      );
    }
  }, [selectedYear]);

  return (
    <>
      <div className="w-full p-3">
        <DashboardLeads />

        <div className="flex  border-t-[1px] w-full border-gray-300 mt-8">
          <div className="w-52 mb-3 mt-4 ">
            <label
              htmlFor="year"
              className={"font-medium ml-0.5 text-[#000000]"}
            >
              Select Year
            </label>
            <DatePicker
              picker="year"
              placeholder="Select Year"
              className="w-full text-[#000000] px-2.5 py-[7.5px] text-sm font-poppins placeholder:text-[#6E6E6E] bg-white border rounded-sm"
              onChange={(date, dateString) => setSelectedYear(dateString)}
              value={selectedYear ? moment(selectedYear, "YYYY") : null}
              format="YYYY"
              disabledDate={(current) =>
                current && current.year() > currentYear
              }
            />
          </div>
        </div>
        <div className="w-full grid overflow-hidden md:grid-cols-2 grid-cols-1 gap-x-4 gap-y-6 mb-5 pb-3">
          <AreaChart
            title="Month On Month Leads"
            series={series1}
            areaColor="#2196f3"
          />

          {!(role === "operationsTl" || role === "operationsExecutive") && (
            <div className="flex flex-col gap-2">
              <AreaChart
                title={`Month On Month Closure `}
                series={series2}
                areaColor="#4caf50"
              />
            </div>
          )}
        </div>

        <div className="w-full grid overflow-hidden md:grid-cols-2 grid-cols-1 gap-x-4 gap-y-6 py-3">
          {!(role === "operationsTl" || role === "operationsExecutive") && (
            <UserList
              title="Sales Team Leader"
              list={dashboardData?.dashboardTable?.salesTLArray}
            />
          )}
          {!(role === "operationsTl" || role === "operationsExecutive") && (
            <UserList
              title="Sales Executive Team"
              list={dashboardData?.dashboardTable?.salesExecutiveArray}
            />
          )}

          {!(role === "salesTl" || role === "salesExecutive") && (
            <UserList
              title="Operations Team Leader"
              list={dashboardData?.dashboardTable?.operationTLArray}
            />
          )}

          {!(role === "salesTl" || role === "salesExecutive") && (
            <UserList
              title="Operations Executive Team"
              list={dashboardData?.dashboardTable?.operationExecutiveArray}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import moment from "moment";
// import { DatePicker } from "antd";
// import {
//   getDashboardData,
//   getDashboardGraphData,
// } from "../../redux/features/dashboard";

// import DashboardLeads from "./DashboardLeads";
// import AreaChart from "../../components/charts/AreaChart";
// import UserList from "../../components/lists/UserList";
// import { Sparkles, LineChart, Users } from "lucide-react";
// import { motion } from "framer-motion";
// import AnniversaryBanner from "../../common/anniversary/AnniversaryBanner";

// const Dashboard = () => {
//   const dispatch = useDispatch();
//   const [chartData, setChartData] = useState();
//   const currentYear = moment().year();
//   const [selectedYear, setSelectedYear] = useState(moment().format("YYYY"));

//   const { dashboardData } = useSelector((state) => state.dashboard);
//   const { role } = useSelector((state) => state.auth);

//   let series1 = chartData?.monthWiseLead?.map((item) => Object.values(item)[0]);
//   let series2 = chartData?.monthClosure?.map((item) => Object.values(item)[0]);

//   useEffect(() => {
//     dispatch(getDashboardData());
//   }, [dispatch]);

//   useEffect(() => {
//     if (selectedYear) {
//       dispatch(
//         getDashboardGraphData(selectedYear, (success, data) => {
//           if (success) {
//             setChartData(data);
//           }
//         })
//       );
//     }
//   }, [selectedYear]);

//   return (
//     <div className="w-full p-5 bg-gradient-to-br from-[#fdfbff] to-[#fff7f1] overflow-hidden">
//       <AnniversaryBanner />
//       {/* 🎯 Lead Summary Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.3 }}
//         className="mb-10"
//       >
//         <div className="flex items-center gap-2 mb-3 animate-bounce">
//           <Sparkles className="text-yellow-500" />
//           <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//             3rd Anniversary - Leads Summary
//           </h2>
//         </div>
//         <DashboardLeads />
//       </motion.div>

//       {/* 📊 Chart Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.5 }}
//         className="mb-10"
//       >
//         <div className="flex items-center justify-between flex-wrap border-t pt-6 border-gray-300 mb-3">
//           <div className="flex items-center gap-2">
//             <LineChart className="text-blue-500" />
//             <h2 className="text-xl font-semibold text-gray-800">
//               📊 Monthly Trends & Closures
//             </h2>
//           </div>
//           <div className="w-52">
//             <label className="font-medium text-gray-700">Select Year</label>
//             <DatePicker
//               picker="year"
//               placeholder="Select Year"
//               className="w-full text-[#000000] px-2.5 py-[7.5px] text-sm font-poppins placeholder:text-[#6E6E6E] bg-white border rounded-md"
//               onChange={(date, dateString) => setSelectedYear(dateString)}
//               value={selectedYear ? moment(selectedYear, "YYYY") : null}
//               format="YYYY"
//               disabledDate={(current) =>
//                 current && current.year() > currentYear
//               }
//             />
//           </div>
//         </div>

//         <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
//           <AreaChart
//             title="Month On Month Leads"
//             series={series1}
//             areaColor="#2196f3"
//           />
//           {!(role === "operationsTl" || role === "operationsExecutive") && (
//             <AreaChart
//               title="Month On Month Closure"
//               series={series2}
//               areaColor="#4caf50"
//             />
//           )}
//         </div>
//       </motion.div>

//       {/* 👥 Teams Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.7 }}
//         className="mb-6"
//       >
//         <div className="flex items-center gap-2 mb-3 border-t pt-6 border-gray-300">
//           <Users className="text-teal-600" />
//           <h2 className="text-xl font-semibold text-gray-800">
//             👥 Team Performance Overview
//           </h2>
//         </div>

//         <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
//           {!(role === "operationsTl" || role === "operationsExecutive") && (
//             <UserList
//               title="Sales Team Leader"
//               list={dashboardData?.dashboardTable?.salesTLArray}
//             />
//           )}
//           {!(role === "operationsTl" || role === "operationsExecutive") && (
//             <UserList
//               title="Sales Executive Team"
//               list={dashboardData?.dashboardTable?.salesExecutiveArray}
//             />
//           )}
//           {!(role === "salesTl" || role === "salesExecutive") && (
//             <UserList
//               title="Operations Team Leader"
//               list={dashboardData?.dashboardTable?.operationTLArray}
//             />
//           )}
//           {!(role === "salesTl" || role === "salesExecutive") && (
//             <UserList
//               title="Operations Executive Team"
//               list={dashboardData?.dashboardTable?.operationExecutiveArray}
//             />
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Dashboard;
