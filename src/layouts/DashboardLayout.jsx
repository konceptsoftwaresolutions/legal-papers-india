import React from "react";
import { Outlet } from "react-router-dom";
import ScreenView from "./ScreenView";
import Reminders from "../pages/Reminders/Reminders";
import AnniversaryAnimations from "../common/anniversary/AnniversaryAnimations";

const DashboardLayout = () => {
  return (
    <>
      {/* <AnniversaryAnimations /> */}
      <ScreenView>
        <Outlet />
        <Reminders />
      </ScreenView>
    </>
  );
};

export default DashboardLayout;
