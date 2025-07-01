import React, { useEffect } from "react";

// components
import DashboardLeads from "./DashboardLeads";
import AreaChart from "../../components/charts/AreaChart";
import UserList from "../../components/lists/UserList";
import {
  getDashboardData,
  getDashTilesData,
} from "../../redux/features/dashboard";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationData } from "../../redux/features/notification";

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDashboardData());
    dispatch(getNotificationData());
  }, [dispatch]);

  const { dashboardData } = useSelector((state) => state.dashboard);
  const { role } = useSelector((state) => state.auth);

  // let series1 = [
  //   100, 500, 700, 1000, 1500, 1800, 2000, 2500, 2200, 2700, 3000, 3500,
  // ];

  let series1 = dashboardData?.monthWiseLead?.map(
    (item) => Object.values(item)[0]
  );

  let series2 = dashboardData?.monthClosure?.map(
    (item) => Object.values(item)[0]
  );

  return (
    <>
      <div className="w-full p-3">
        <DashboardLeads />

        <div className="w-full grid overflow-hidden md:grid-cols-2 grid-cols-1 gap-x-4 gap-y-6 my-5 py-3">
          <AreaChart
            title="Month On Month Leads"
            series={series1}
            areaColor="#2196f3"
          />
          {console.log(series1)}

          {!(role === "operationsTl" || role === "operationsExecutive") && (
            <AreaChart
              title="Month On Month Closure"
              series={series2}
              areaColor="#4caf50"
            />
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
