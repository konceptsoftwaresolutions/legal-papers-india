import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import useAxios from "../../../hooks/useAxios";

const axiosInstance = useAxios();
const initialState = {
  empRevenue: null,
  empDateRevenue: null,
  categoryRevenue: null,
  categoryDateRevenue: null,
};

const revenueSlice = createSlice({
  name: "revenueDetails",
  initialState,
  reducers: {
    // Change this to setRevenue
    setRevenue: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        state[key] = action.payload[key];
      });
    },
  },
});

// Export setRevenue now since we changed it in the reducer
export const { setRevenue } = revenueSlice.actions;
export default revenueSlice.reducer;

export const getEmployeeWiseRevenue = (name = "", nameWithProfile = "", callback) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post(
        "/revenueRoutes/employeeWiseTotalRevenue",
        {
          name: name,
          nameWithProfile: nameWithProfile,
        }
      );
      if (response.status === 200) {
        const revenueData = response.data;
        dispatch(setRevenue({ empRevenue: revenueData })); // Dispatching setRevenue

        if (callback) {
          callback(null, revenueData); // Passing data to callback on success
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message);
      if (callback) {
        callback(error, null); // Passing error to callback on failure
      }
    }
  };
};


export const getSingleEmployeeWiseRevenue = (name = "", nameWithProfile = "", callback = () => { }) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post(
        "/revenueRoutes/employeeWiseTotalRevenue",
        {
          name: name,
          nameWithProfile: nameWithProfile,
        }
      );
      if (response.status === 200) {
        const revenueData = response.data;
        // dispatch(setRevenue({ empSingRevenue: revenueData })); // Dispatching setRevenue
        callback(revenueData); // Passing data to callback on success

      }
    } catch (error) {
      toast.error(error);
      // console.log(error);
    }
  };
};

export const getCategoryWiseRevenue = (
  serviceCategory = "",
  filterActive,
  filter = {}
) => {
  return async (dispatch) => {
    try {
      if (filterActive === "false") {
        const response = await axiosInstance.post(
          "/revenueRoutes/categoryWiseTotalRevenue",
          {
            serviceCategory: serviceCategory,
          }
        );
        if (response.status === 200) {
          const revenueData = response.data;
          dispatch(setRevenue({ categoryRevenue: revenueData })); // Dispatching setRevenue
        }
      }
      if (filterActive === "true") {
        const response = await axiosInstance.post(
          "revenueRoutes/dateFilterInCategory",
          {
            serviceCategory: serviceCategory,
            ...filter,
          }
        );
        if (response.status === 200) {
          const revenueData = response.data;
          dispatch(setRevenue({ categoryDateRevenue: revenueData })); // Dispatching setRevenue
        }
      }
    } catch (error) {
      toast.error(error);
      // console.log(error);
    }
  };
};

// revenueRoutes/dateFilterInRevenue

export const getDateFilterRevenue = (payload, callback = () => { }) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post(
        "revenueRoutes/dateFilterInRevenue", payload);
      if (response.status === 200) {
        const revenueData = response.data;
        if (callback) {
          callback(null, revenueData); // Passing data to callback on success
        }
        dispatch(
          setRevenue({ empDateRevenue: revenueData })
        ); // Dispatching setRevenue
      }
    } catch (error) {
      // Handle specific HTTP status codes
      if (callback) {
        callback(error, null); // Passing error to callback on failure
      }
      if (error.response?.status === 404) {
        console.log("404 Error: No data found", error.response);
        dispatch(setRevenue({ empDateRevenue: null }));
        toast.error(error.response.data.message)
      } else {
        // General error handling
        console.log(error)
        toast.error(error.response.data.message);
        dispatch(setRevenue({ empDateRevenue: null }));
      }
    }
  };
};


export const getSingDateFilterRevenue = (name, nameWithProfile, filterObject) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post(
        "revenueRoutes/dateFilterInRevenue",
        {
          ...filterObject,
          important: false,
          name: name,
          nameWithProfile: nameWithProfile,
        }
      );
      if (response.status === 200) {
        const revenueData = response.data;
        dispatch(
          setRevenue({ empSingDateRevenue: revenueData })
        ); // Dispatching setRevenue
      }
    } catch (error) {
      // Handle specific HTTP status codes
      if (error.response?.status === 404) {
        console.log("404 Error: No data found", error.response);
        dispatch(setRevenue({ empSingDateRevenue: null }));
        toast.error(error.response.data.message)
      } else {
        // General error handling
        console.log(error)
        toast.error(error.response.data.message);
        dispatch(setRevenue({ empSingDateRevenue: null }));
      }
    }
  };
};

export const getCategoryDateFilterRevenue = (payload, callback = () => { }) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post(
        "revenueRoutes/dateFilterInCategory", payload
      );

      if (response.status === 200) {
        const revenueData = response.data;
        dispatch(setRevenue({ categoryDateRevenue: revenueData }));
        if (callback) {
          callback(null, revenueData); // Passing data to callback on success
        }

      }
    } catch (error) {
      // Handle specific HTTP status codes
      if (callback) {
        callback(error, null); // Passing error to callback on failure
      }
      if (error.response?.status === 404) {
        console.log("404 Error: No data found", error.response);
        dispatch(setRevenue({ categoryDateRevenue: null }));
        toast.error(error.response.data.message)
      } else {
        // General error handling
        toast.error(error.message || "An error occurred");
      }
    }
  };
};

export const dateBasisLeadCount = (payload, callback = () => { }) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post(
        "revenueRoutes/dateBasisNoOfLeads", payload
      );

      if (response.status === 200) {
        const revenueData = response.data;
        if (callback) {
          callback(null, revenueData); // Passing data to callback on success
        }

      }
    } catch (error) {
      // Handle specific HTTP status codes
      if (callback) {
        callback(error, null); // Passing error to callback on failure
      }
      if (error.response?.status === 404) {
        console.log("404 Error: No data found", error.response);

        toast.error(error.response.data.message)
      } else {
        // General error handling
        toast.error(error.message || "An error occurred");
      }
    }
  }
}