import React from "react";
import { Outlet } from "react-router-dom";
import ScreenView from "./ScreenView";
import Reminders from "../pages/Reminders/Reminders";

const DashboardLayout = () => {
  return (
    <>
      <ScreenView>
        <Outlet />
        <Reminders />
      </ScreenView>
    </>
  );
};

export default DashboardLayout;
