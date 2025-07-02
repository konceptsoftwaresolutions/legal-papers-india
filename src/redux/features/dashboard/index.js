import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import useAxios from "../../../hooks/useAxios";
// import { toast } from "react-toastify";


const axiosInstance = useAxios();


const initialState = {

};

const dashboardSlice = createSlice({
    name: "dashboardDetails",
    initialState,
    reducers: {
        setDashboard: (state, action) => {
            Object.keys(action.payload).forEach((key) => {
                state[key] = action.payload[key];
            });
        },
    },
});

export const { setDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;

export const getDashboardData = () => {
    return async (dispatch) => {
        try {
            // dispatch(setLoader({ isCustomerLoading: true }));
            // dispatch(setCustomers({ allCustomers: null, filterCustomers: null }));
            const response = await axiosInstance.get("/masterDashboard");
            console.log(response)
            if (response.status === 200) {
                const dashboardData = response.data;
                dispatch(setDashboard({ dashboardData }))
            }
        } catch (error) {
            console.log(error);
            // dispatch(setLoader({ isCustomerLoading: false }));
        } finally {
            console.log("fina")
            // dispatch(setLoader({ isCustomerLoading: false }));
        }
    };
};

export const getDashTilesData = () => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.get("/leadRoutes/leadReport");
            if (response.status === 200) {
                const tilesData = response.data;
                dispatch(setDashboard(tilesData))
            }
        } catch (error) {
            toast.error(error)
        }
    }
}



export const getDashboardGraphData = (selectedYear, callback = () => { }) => {
    return async (dispatch) => {
        try {

            const response = await axiosInstance.post("/getDashboardMetrics", { year: selectedYear });
            // console.log(response)
            if (response.status === 200) {
                const dashboardData = response.data;
                // console.log(dashboardData)
                callback(true, dashboardData)
                // dispatch(setDashboard({ dashboardData }))
            }
        } catch (error) {
            callback(false)
            toast.error(error?.response?.data?.message)
            // console.log(error); 
        } finally {
            console.log("fina")
        }
    };
};



export const getTheRemainderTaskNotifications = (selectedYear, callback = () => { }) => {
    return async (dispatch) => {
        try {

            const response = await axiosInstance.post("/taskRoutes/remainderTask", { year: selectedYear });

            if (response.status === 200) {
                const dashboardData = response.data;
                callback(true, dashboardData)
            }
        } catch (error) {
            callback(false)
            toast.error(error?.response?.data?.message)
        } finally {
            console.log("fina")
        }
    };
};