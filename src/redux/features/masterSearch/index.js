
import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import useAxios from "../../../hooks/useAxios";

const axiosInstance = useAxios();
const initialState = {
    masterSearchLeads: null,
    masterLoader: false,
};

const masterSlice = createSlice({
    name: "masterDetails",
    initialState,
    reducers: {
        // Change this to setMasterSearch
        setMasterSearch: (state, action) => {
            Object.keys(action.payload).forEach((key) => {
                state[key] = action.payload[key];
            });
        },
    },
});

// Export setMasterSearch now since we changed it in the reducer
export const { setMasterSearch } = masterSlice.actions;
export default masterSlice.reducer;

export const fireMasterSearch = (payload) => {
    console.log(payload)
    return async (dispatch) => {
        try {
            dispatch(setMasterSearch({ masterLoader: true }))
            const response = await axiosInstance.post("/leadRoutes/universalSearch", { ...payload });
            if (response.status === 200) {
                const data = response.data;
                dispatch(setMasterSearch({ masterSearchLeads: data.reverse() })); // Dispatching setMasterSearch
                dispatch(setMasterSearch({ masterLoader: false }))
            }
        } catch (error) {
            dispatch(setMasterSearch({ masterLoader: false }))
            let message = "ERROR"
            if (error.hasOwnProperty('response')) {
                message = error.response.data
                toast.error(message)
            }
        }
    }




}