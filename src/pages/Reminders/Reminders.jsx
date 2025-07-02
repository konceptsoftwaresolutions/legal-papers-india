import React, { useContext, useState } from "react";
import "./reminders.scss";
import { IoMdClose } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import { IoMdAlarm } from "react-icons/io";
import { NotificationContext } from "../../context/notification";

const Reminders = () => {
  const { notifications, removeReminder } = useContext(NotificationContext);
  const [isReminderVisible, setReminderVisible] = useState(false);

  const handleRemove = (taskId) => {
    removeReminder(taskId);
  };

  return (
    <div>
      <div className="icon" onMouseEnter={() => setReminderVisible(true)}>
        <IoMdAlarm size={30} color="white" />
      </div>
      <div
        className={`reminders-container ${isReminderVisible ? "visible" : ""}`}
        onMouseLeave={() => setReminderVisible(false)}
      >
        {notifications?.reminder?.length > 0 ? (
          notifications?.reminder?.map((reminder) => (
            <div key={reminder.taskId} className="alert">
              <div className="alert-content">
                <div className="inner-icon">
                  <IoSettingsSharp size={20} />
                </div>
                <div className="alert-text">
                  <p className="alert-title">{reminder.subject}</p>
                  <p className="alert-meta">
                    <span className="time">{`${reminder.reminder.reminderDate}, ${reminder.reminder.reminderTime}`}</span>
                    <span className="hid">
                      &nbsp;&bull;{" "}
                      <span className="user">{reminder.clientEmail}</span>
                    </span>
                  </p>
                  <button
                    className="close-btn"
                    onClick={() => handleRemove(reminder.taskId)}
                  >
                    <IoMdClose />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-reminders">There is no reminder yet for you.</div>
        )}
      </div>
    </div>
  );
};

export default Reminders;
