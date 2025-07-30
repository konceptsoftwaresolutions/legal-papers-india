import React, { useEffect, useState } from "react";
import "./reminders.scss";
import { IoMdClose } from "react-icons/io";
import { IoMdAlarm } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { removeReminder } from "../../redux/features/notification";

const Reminders = () => {
  const dispatch = useDispatch();
  const [isReminderVisible, setReminderVisible] = useState(false);

  const { notificationData } = useSelector((state) => state.notification);

  // Auto-show when new data is present
  useEffect(() => {
    if (notificationData?.taskReminder?.length > 0) {
      setReminderVisible(true);
    }
  }, [notificationData?.taskReminder]);

  const handleRemove = (id) => {
    dispatch(removeReminder(id));
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
        {notificationData?.taskReminder?.length > 0 ? (
          notificationData.taskReminder.map((reminder) => (
            <div key={reminder.taskId} className="alert">
              <div className="reminder-card">
                <div className="card-header">
                  🔔 Reminder
                  <span className="badge">{reminder.nameOfBusinessEntity}</span>
                </div>

                <button
                  className="close-btn"
                  onClick={() => handleRemove(reminder.taskId)}
                >
                  <IoMdClose />
                </button>

                <p>
                  <strong>Subject:</strong> {reminder.subject}
                </p>
                <p>
                  <strong>Email:</strong> {reminder.emailId}
                </p>
                <p>
                  <strong>Mobile:</strong> {reminder.mobileNumber}
                </p>
                <p>
                  <strong>Lead ID:</strong> {reminder.leadId}
                </p>
                <p>
                  <strong>Date:</strong> {reminder.reminder.reminderDate}
                </p>
                <p>
                  <strong>Time:</strong> {reminder.reminder.reminderTime}
                </p>
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
