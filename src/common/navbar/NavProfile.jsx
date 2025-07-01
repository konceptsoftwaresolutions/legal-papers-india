import React, { useState, useEffect } from "react";
import { Dropdown, Menu } from "antd";

// icons
import {
  MdEmail,
  MdLogout,
  MdOutlineKeyboardArrowDown,
  MdOutlinePassword,
  MdOutlinePayment,
} from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";

// components
import OpacityButton from "../../components/buttons/OpacityButton";
import MyLink from "../../components/links/MyLink";
import ProfileModal from "./ProfileModal";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AddUserModal from "../../pages/user/AddUserModal";
import ChangePassModal from "./ChangePassModal";
import EmailConfigModal from "./EmailConfigModal";
import { HiUsers } from "react-icons/hi";
import { ImUserPlus } from "react-icons/im";
import { FaUpload } from "react-icons/fa6";

const NavProfile = ({
  image = "https://cdn-icons-png.flaticon.com/512/9703/9703596.png",
}) => {
  const navigate = useNavigate();

  const { role } = useSelector((state) => state.auth);
  const { userData } = useSelector((state) => state.user);

  // State for visibility of the dropdown menu
  const [visible, setVisible] = useState(false);
  const [showQuotation, setShowQuotation] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [passModal, setPassModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);

  // State for scroll position
  const [scrollY, setScrollY] = useState(0);

  // Handle menu click
  const handleMenuClick = () => {
    setVisible(!visible);
  };

  const ProfileButton = ({ icon, text, to = null }) => {
    return (
      <MyLink to={to}>
        <div className="flex justify-center items-center text-[15px] py-2 gap-x-2">
          {icon}
          <span>{text}</span>
        </div>
      </MyLink>
    );
  };

  // Define dropdown menu items
  const menu = (
    <ul className="w-[280px] rounded-md main-text bg-white shadow-md p-2">
      <li
        key="1"
        className="py-2 px-3 flex items-center gap-x-2 cursor-pointer hover:bg-gray-100 rounded-md"
        onClick={() => setShowQuotation(!showQuotation)}
      >
        <FaRegUser size={16} />
        <span>Profile</span>
      </li>
      {!(role === "salesExecutive" || role === "operationsExecutive") && (
        <>
          <NavLink
            key="2"
            to={`/${role}/all-users`}
            className="py-2 px-3 flex items-center gap-x-2 cursor-pointer hover:bg-gray-100 rounded-md"
          >
            <li
              // to={`/${role}/all-users`}
              className={`flex justify-center items-center gap-2 !h:text-[#000000e0]`}
            >
              <HiUsers size={16} />
              <span>All Users</span>
            </li>
          </NavLink>
        </>
      )}
      {!(
        role === "salesTl" ||
        role === "operationsTl" ||
        role === "salesExecutive" ||
        role === "operationsExecutive"
      ) && (
        <>
          <li
            key="3"
            className="py-2 px-3 flex items-center gap-x-2 cursor-pointer hover:bg-gray-100 rounded-md"
            onClick={() => setUserModal(!userModal)}
          >
            <ImUserPlus size={16} />
            <span>Add User</span>
          </li>
        </>
      )}
      {!(
        role === "salesTl" ||
        role === "operationsTl" ||
        role === "salesExecutive" ||
        role === "operationsExecutive"
      ) && (
        <>
          <li
            key="4"
            className="py-2 px-3 flex items-center gap-x-2 cursor-pointer hover:bg-gray-100 rounded-md"
            onClick={() => setPassModal(!passModal)}
          >
            <MdOutlinePassword size={16} />
            <span>Change Password</span>
          </li>
        </>
      )}

      <li
        key="5"
        className="py-2 px-3 flex items-center gap-x-2 cursor-pointer hover:bg-gray-100 rounded-md"
        onClick={() => setEmailModal(!emailModal)}
      >
        <MdEmail size={16} />
        <span>Email Configuration</span>
      </li>

      {/* {!(role === "salesTl" || role === "operationsTl" || role === "salesExecutive" || role === "operationsExecutive") && (
        <>
          <li
            key="6"
            className="py-2 px-3 flex items-center gap-x-2 cursor-pointer hover:bg-gray-100 rounded-md"
          >
            <FaUpload size={16} />
            <span>Upload Old Data</span>
          </li>
        </>
      )} */}
      {!(
        role === "salesTl" ||
        role === "operationsTl" ||
        role === "salesExecutive" ||
        role === "operationsExecutive"
      ) && (
        <>
          <NavLink
            key="7"
            target="_blank" // Open external link in a new tab
            to="https://legalpapers-payments.onrender.com/view/initiate_payment.html"
            className="py-2 px-3 flex items-center gap-x-2 cursor-pointer hover:bg-gray-100 rounded-md"
          >
            <li
              className={`flex justify-center items-center gap-2 !h:text-[#000000e0]`}
            >
              <MdOutlinePayment size={16} />
              <span>Payments</span>
            </li>
          </NavLink>
        </>
      )}
      {!(
        role === "salesTl" ||
        role === "superAdmin" ||
        role === "salesExecutive"
      ) && (
        <NavLink
          key="8"
          to={`/${role}/important-leads`}
          className="py-2 px-3 flex items-center gap-x-2 cursor-pointer hover:bg-gray-100 rounded-md"
        >
          <li
            className={`flex justify-center items-center gap-2 !h:text-[#000000e0]`}
          >
            <HiUsers size={16} />
            <span>Important Leads</span>
          </li>
        </NavLink>
      )}
    </ul>
  );

  // Track the scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the scroll event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Dropdown
        overlay={menu}
        trigger={["click"]}
        visible={visible}
        onVisibleChange={(flag) => setVisible(flag)}
        overlayClassName="main-nav-dropdown"
        overlayStyle={{
          top: `${62 + scrollY}px`, // Adjust the top position based on scroll
          right: "10px", // Adjust the left position
          zIndex: 1000, // Optional, to ensure dropdown is above other elements
        }}
      >
        <OpacityButton
          onClick={handleMenuClick}
          className="rounded-full flex justify-center items-center gap-x-1 p-1 px-1.5"
        >
          <span className="text-white capitalize text-[14px]">
            {" "}
            Welcome, {userData?.name}
          </span>

          <img src={image} alt="Profile" className="w-7 h-7 rounded-full" />
          <MdOutlineKeyboardArrowDown size={20} />
        </OpacityButton>
      </Dropdown>
      <ProfileModal
        showQuotation={showQuotation}
        setShowQuotation={setShowQuotation}
      />
      <AddUserModal userModal={userModal} setUserModal={setUserModal} />
      <ChangePassModal passModal={passModal} setPassModal={setPassModal} />
      <EmailConfigModal emailModal={emailModal} setEmailModal={setEmailModal} />
    </>
  );
};

export default NavProfile;
