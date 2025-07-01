import React from "react";
import { Outlet } from "react-router-dom";
import ScreenView from "./ScreenView";

const DashboardLayout = () => {
    return <>
        <ScreenView>
            <Outlet />
        </ScreenView>
    </>
}

export default DashboardLayout;