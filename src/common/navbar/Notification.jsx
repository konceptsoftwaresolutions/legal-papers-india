import React, { useEffect, useState } from "react";
import OpacityButton from "../../components/buttons/OpacityButton";
import { Dropdown, Menu } from "antd";

// icons
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { MdOutlineNotificationsOff } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import MyButton from "../../components/buttons/MyButton";
import { TbArrowElbowLeft } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import {
  approveLocationReq,
  getNotificationData,
  rejectLocationNotification,
  removeLeadNotification,
} from "../../redux/features/notification";
import { IoNotificationsOffCircle } from "react-icons/io5";
import { useLocation } from "react-router-dom";

const Notification = ({
  image = "https://cdn-icons-png.flaticon.com/512/9703/9703596.png",
}) => {
  const dispatch = useDispatch();

  const location = useLocation();

  const { notificationData } = useSelector((state) => state.notification);
  const { role } = useSelector((state) => state.auth);
  const totalNotificationCount = notificationData
    ? Object.values(notificationData).reduce((total, value) => {
        return total + (Array.isArray(value) ? value.length : 0);
      }, 0)
    : 0; // Default to 0 if notificationData is null or undefined

  // State for visibility of the dropdown menu
  const [visible, setVisible] = useState(false);

  // State for scroll position
  const [scrollY, setScrollY] = useState(0);

  const handleApproval = (data) => {
    if (data) {
      dispatch(approveLocationReq(data));
    }
  };

  const handleRejection = (data) => {
    if (data) {
      console.log("rejection called");
      dispatch(rejectLocationNotification(data));
    }
  };

  const removeNotificationHandler = (data) => {
    if (data) {
      console.log("remove called", data);
      dispatch(removeLeadNotification(data));
    }
  };

  const NotificationCard = () => {
    if (notificationData)
      console.log("rec", notificationData.superAdminNotification);

    return (
      <>
        <div className="test">
          {/* {notificationData?.superAdminNotification && role === "superAdmin" ? ( */}
          {notificationData?.superAdminNotification &&
          (role === "superAdmin" || role === "salesTl") ? (
            <>
              {notificationData?.superAdminNotification?.map(
                (notification, index) => {
                  return (
                    <>
                      <div
                        key={index}
                        className="p-4 shadow-md mb-3 rounded-md hover:scale-[1.02] ease-in-out duration-300"
                      >
                        <p className="text-[17px] font-semibold">
                          {notification.message}
                        </p>
                        <p>
                          <span className="font-semibold ">
                            Employee Name :{" "}
                          </span>
                          {notification.employeeName}
                        </p>
                        <p>
                          <span className="font-semibold ">Email : </span>
                          {notification.employeeEmail}
                        </p>
                        <p>
                          <span className="font-semibold ">
                            Notification :{" "}
                          </span>
                          {notification.notificationType}
                        </p>
                        <div className="flex justify-center gap-2 mt-2">
                          <MyButton
                            className="flex justify-center items-center gap-2 h-[35px] hover:shadow-md bg-[#198754]"
                            onClick={() => handleApproval(notification)}
                          >
                            <TbArrowElbowLeft /> Approve
                          </MyButton>
                          <MyButton
                            className="flex justify-center items-center gap-2 h-[35px] hover:shadow-md bg-[#dc3545] "
                            onClick={() => handleRejection(notification)}
                          >
                            <RxCross2 />
                            Reject
                          </MyButton>
                        </div>
                      </div>
                    </>
                  );
                }
              )}
            </>
          ) : (
            <>
              {/* <div className="flex justify-center items-center gap-2">
                <IoNotificationsOffCircle size={30} />
                <p className="text-xl font-semibold text-center">
                  No new notifications !!!
                </p>
              </div> */}
            </>
          )}

          {notificationData?.general && role != "superAdmin" ? (
            <>
              {notificationData?.general?.map((notification, index) => {
                return (
                  <>
                    <div
                      key={index}
                      className="p-4 shadow-md mb-3 rounded-md hover:scale-[1.02] ease-in-out duration-300"
                    >
                      <p className="text-[17px] font-semibold">
                        {notification.message}
                      </p>
                      <p>
                        <span className="font-semibold ">Lead ID : </span>
                        {notification.leadId}
                      </p>
                      <p>
                        <span className="font-semibold ">Name : </span>
                        {notification.operationsExecutiveName}
                      </p>
                      <p>
                        <span className="font-semibold ">Email : </span>
                        {notification.operationsExecutiveEmail}
                      </p>
                      <div className="flex justify-center pt-2">
                        <MyButton
                          className="flex justify-center items-center gap-2 h-[35px] hover:shadow-md bg-[#dc3545] "
                          onClick={() =>
                            removeNotificationHandler(
                              notification.notificationId
                            )
                          }
                        >
                          <RxCross2 />
                          Remove
                        </MyButton>
                      </div>
                    </div>
                  </>
                );
              })}
            </>
          ) : (
            <div className="flex justify-center items-center gap-2">
              {/* <IoNotificationsOffCircle size={30} />
              <p className="text-xl font-semibold text-center">
                No new notifications !!!
              </p> */}
            </div>
          )}

          {/* {(notificationData?.superAdminNotification).length === 0 &&
          role === "superAdmin" ? ( */}
          {(notificationData?.superAdminNotification).length === 0 &&
          (role === "superAdmin" || role === "salesTl") ? (
            <>
              <div className="flex justify-center items-center gap-2 pb-3">
                <IoNotificationsOffCircle size={30} />
                <p className="text-xl font-semibold text-center">
                  No new notifications !!!
                </p>
              </div>
            </>
          ) : (
            ""
          )}
          {(notificationData?.general).length === 0 && role != "superAdmin" ? (
            <>
              <div className="flex justify-center items-center gap-2 pb-3">
                <IoNotificationsOffCircle size={30} />
                <p className="text-xl font-semibold text-center">
                  No new notifications !!!
                </p>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </>
    );
  };

  useEffect(() => {
    dispatch(getNotificationData());
  }, [location]);

  // Define dropdown menu items
  const menu = (
    <Menu className="w-[500px] main-text rounded-md main-text max-h-[25rem]">
      <h2 className="py-2 px-3 font-medium">Notifications</h2>

      {/* <div className="h-[200px] text-[18px] flex gap-x-2 justify-center items-center">
                <MdOutlineNotificationsOff size={22} />
                <h2 className="">No Notifications!</h2>
            </div> */}

      <div className="p-3">
        <NotificationCard />
      </div>

      {/* <Menu.Item key="1">
                <ProfileButton
                    text="Profile"
                    icon={<FaRegUser size={16} />}
                    to={"profile"}
                />
            </Menu.Item> */}
    </Menu>
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
          // right: "10px",  // Adjust the left position
          zIndex: 1000, // Optional, to ensure dropdown is above other elements
        }}
      >
        <OpacityButton
          className="rounded-full "
          update={true}
          count={totalNotificationCount}
        >
          <IoMdNotificationsOutline size={22} />
        </OpacityButton>
      </Dropdown>
    </>
  );
};

export default Notification;
