import React, { useEffect } from "react";

// revenue components
import RevenueTop from "./RevenueTop";
import RevenueBottom from "./RevenueBottom";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationData } from "../../redux/features/notification";
import EmpRevenueTop from "./EmpRevenueTop";

const Revenue = () => {
  const dispatch = useDispatch();

  const { role } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   dispatch(getNotificationData());
  // }, [dispatch]);
  return (
    <>
      <div className="p-3 space-y-5">
        {/* {!(role === "") && (<EmpRevenueTop />) }
        {!(role === "operationsExecutive" || role === "salesExecutive") && <RevenueTop />}
        {!(role === "operationsExecutive" || role === "salesExecutive" || role ==="operationsTl" || role === "salesTl") && <RevenueBottom />} */}
        {<EmpRevenueTop />}
        {/* {(role !== "salesExecutive" || role !== 'operationsExecutive' || role === 'superAdmin') && <RevenueBottom />} */}

        {["superAdmin", "salesTl", "operationsTl"].includes(role) && (
          <RevenueBottom />
        )}

        {/* {["superAdmin"].includes(role) && <RevenueTop />} */}
      </div>
    </>
  );
};

export default Revenue;
