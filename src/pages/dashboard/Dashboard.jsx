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
    dispatch(getNotificationData());
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
                title={`Month On Month Closure - ${selectedYear}`}
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
