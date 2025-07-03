import { createContext, useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";

export const NotificationContext = createContext({
  notifications: { admin: [], reminder: [], general: [] },
});

export const NotificationProvider = ({ children }) => {
  const axiosInstance = useAxios();

  const [notifications, setNotifications] = useState({
    admin: [],
    reminder: [],
    general: [],
  });

  const removeReminder = (taskId) => {
    setNotifications((prevNotifications) => ({
      ...prevNotifications,
      reminder: prevNotifications.reminder.filter(
        (reminder) => reminder.taskId !== taskId
      ),
    }));
  };

  const getNotifications = async () => {
    console.log("Fetching notifications..."); // ✅ Add this

    const token = localStorage.getItem("legalPapers");
    if (!token) {
      return;
    }
    const response = await axiosInstance.get("/taskRoutes/remainderTask");
    setNotifications({
      admin: response?.superAdminNotification,
      reminder: response?.taskReminder,
      general: response?.general,
    });
  };
  useEffect(() => {
    // getNotifications();
    // const interval = setInterval(getNotifications, 3000);
    // return () => {
    //   clearInterval(interval);
    // };
    // eslint-disable-next-line
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, removeReminder, getNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
