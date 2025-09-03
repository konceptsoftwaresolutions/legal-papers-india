import React from "react";

// sidebar/components
import SidebarProvider from "./SidebarProvider";

// icons
import { RxDashboard } from "react-icons/rx"; // dashboard
import { FaListUl } from "react-icons/fa"; // leads
import { TbBucket } from "react-icons/tb"; // bucket
import { RiShareForwardLine } from "react-icons/ri"; // follow ups
import { GiReceiveMoney } from "react-icons/gi"; // revenue
import { FaTasks } from "react-icons/fa"; // tasks
import { RiListCheck2 } from "react-icons/ri";

// hooks
import usePath from "../../hooks/usePath";
import { useSelector } from "react-redux";
import {
  MdBuild,
  MdDescription,
  MdMessage,
  MdReceiptLong,
} from "react-icons/md";

const Sidebar = ({ collapse = false, onCollapse = () => {} }) => {
  const path = usePath();

  const { role } = useSelector((state) => state.auth);

  const links = [
    {
      text: "Dashboard",
      path: "dashboard",
      icon: <RxDashboard size={"18px"} />,
      active: path.endPoint === "dashboard",
    },
    {
      text: "Leads",
      path: "leads",
      icon: <FaListUl size={"18px"} />,
      active: path.endPoint === "leads",
    },
    ...(!(role === "operationsTl" || role === "operationsExecutive")
      ? [
          {
            text: "No Claim Bucket",
            path: "bucket",
            icon: <TbBucket size={"18px"} />,
            active: path.pathname.match("bucket"),
          },
        ]
      : []),

    ...(!(role === "salesTl" || role === "salesExecutive")
      ? [
          {
            text: "Follow Ups",
            path: "follow-ups",
            icon: <RiShareForwardLine size={"18px"} />,
            active: path.endPoint === "follow-ups",
          },
        ]
      : []),
    {
      text: "Revenue",
      path: "revenue",
      icon: <GiReceiveMoney size={"18px"} />,
      active: path.endPoint === "revenue",
    },

    {
      text: "Renewal",
      path: "renewal",
      icon: <RiListCheck2 size={"18px"} />,
      active: path.endPoint === "renewal",
    },
    ...(!(role === "salesExecutive" || role === "operationsExecutive")
      ? [
          {
            text: "Employee Activity Tracker",
            path: "employeeactivitytracker",
            icon: <RiListCheck2 size={"18px"} />,
            active: path.endPoint === "employeeactivitytracker",
          },
        ]
      : []),

    // {
    //     text: "Renewal",
    //     path: "renewal",
    //     icon: <RiListCheck2 size={"18px"} />,
    //     active: (path.endPoint === "renewal"),
    // },
    {
      text: "Tasks",
      path: "tasks",
      icon: <FaTasks size={"18px"} />,
      active: path.endPoint === "tasks",
    },
    ...(role === "superAdmin"
      ? [
          {
            text: "Marketing",
            path: "marketing",
            icon: <MdMessage size={"18px"} />,
            active: path.endPoint === "marketing",
          },
          {
            text: "Marketing Analytics",
            path: "marketing-analytics",
            icon: <MdMessage size={"18px"} />,
            active: path.endPoint === "marketing-analytics",
          },
          {
            text: "Client Files",
            path: "clientfiles",
            icon: <MdMessage size={"18px"} />,
            active: path.endPoint === "clientfiles",
          },
          {
            text: "Services",
            path: "services",
            icon: <MdBuild size={"18px"} />, // Or any other icon you prefer
            active: path.endPoint === "services",
          },
        ]
      : []),
    ...(!(
      role === "salesExecutive" ||
      role === "operationsExecutive" ||
      role === "operationsTl"
    )
      ? [
          {
            text: "Proforma Invoice No",
            path: "proformainvoice",
            icon: <MdDescription size={"18px"} />,
            active: path.endPoint === "proformainvoice",
          },
          {
            text: "Tax Invoice No",
            path: "taxinvoice",
            icon: <MdReceiptLong size={"18px"} />,
            active: path.endPoint === "taxinvoice",
          },
        ]
      : []),
  ];

  return (
    <>
      <SidebarProvider
        collapse={collapse}
        onCollapse={onCollapse}
        links={links}
      />
    </>
  );
};

export default Sidebar;
