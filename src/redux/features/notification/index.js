import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import useAxios from "../../../hooks/useAxios";

const axiosInstance = useAxios();
const initialState = {
    notificationData: {
        taskReminder: [],
    }

};

const notificationSlice = createSlice({
    name: "notificationDetails",
    initialState,
    reducers: {
        // Change this to setNotifications
        setNotifications: (state, action) => {
            Object.keys(action.payload).forEach((key) => {
                state[key] = action.payload[key];
            });
        },
        removeReminder: (state, action) => {
            const idToRemove = action.payload;
            if (state.notificationData?.taskReminder) {
                state.notificationData.taskReminder = state.notificationData.taskReminder.filter(
                    (item) => item.taskId !== idToRemove
                );
            }
        },
    },
});

// Export setNotifications now since we changed it in the reducer
export const { setNotifications, removeReminder } = notificationSlice.actions;
export default notificationSlice.reducer;


export const getNotificationData = () => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.get("/taskRoutes/remainderTask");
            const data = response.data;
            console.log(data);
            dispatch(setNotifications({ notificationData: data }))
        } catch (err) {
            console.log(err)
        }
    }
}
export const approveLocationReq = (data) => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.post("/notificationRoutes/superAdminApproval", {
                label: 'approve',
                notification: data,
            });
            if (response.status === 200) {
                // let message = response.data.message || "Access Granted";
                let message = "Access Granted";
                toast.success(message);
                dispatch(getNotificationData());
            }
        } catch (error) {
            let message = "ERROR"
            if (error.hasOwnProperty("response")) {
                message = error.response.data;
                toast.error(message)
            }
        }
    }
}

export const rejectLocationNotification = (data) => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.post("/notificationRoutes/operationsRejection", {
                notificationId: data._id
            });
            if (response.status === 200) {
                // let message = response.data.message || "Access Rejected";
                let message = "Access Rejected";
                toast.success(message);
                dispatch(getNotificationData())
            }
        } catch (error) {
            let message = "ERROR";
            if (error.hasOwnProperty("response")) {
                message = error.response.data;
                toast.error(message);
            }
        }
    }
}

export const removeLeadNotification = (data) => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.post("/notificationRoutes/operationsRejection", {
                notificationId: data,
            });
            if (response.status === 200) {
                let message = response.data.message || "Success"
                toast.success(message);
                dispatch(getNotificationData())
            }
        } catch (error) {
            let message = "ERROR";
            if (error.hasOwnProperty("response")) {
                message = error.response.data;
                toast.error(message);
            }
        }
    }
}