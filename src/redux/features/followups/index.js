import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import useAxios from "../../../hooks/useAxios";

const axiosInstance = useAxios();
const initialState = {
  followUpData: null,
};

const followupSlice = createSlice({
  name: "followupDetails",
  initialState,
  reducers: {
    // Change this to setFollowUp
    setFollowUp: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        state[key] = action.payload[key];
      });
    },
  },
});

// Export setFollowUp now since we changed it in the reducer
export const { setFollowUp } = followupSlice.actions;
export default followupSlice.reducer;

export const getOperationsFollowUpLead = (currentPage='1', filter = false, filterObject = {}) => {
  return async (dispatch) => {
    try {
      dispatch(setFollowUp({followUpLoader:true}))
      const response = await axiosInstance.post("/leadRoutes/allOperationsFollowUpLead", {
        page: currentPage,
        filter: filter,
        filterObject: filterObject,
      });
      if (response.status === 200) {
        const followUpData = response.data;
        dispatch(setFollowUp({followUpData:followUpData})); // Dispatching setFollowUp
        dispatch(setFollowUp({followUpLoader:false}))
      }
    } catch (error) {
      toast.error(error);
      dispatch(setFollowUp({followUpLoader:false}))
      // console.log(error);
    }
  };
};