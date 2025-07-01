import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import useAxios from "../../../hooks/useAxios";

const axiosInstance = useAxios();
const initialState = {
};

const taskSlice = createSlice({
  name: "taskDetails",
  initialState,
  reducers: {
    // Change this to setTasks
    setTasks: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        state[key] = action.payload[key];
      });
    },
  },
});

// Export setTasks now since we changed it in the reducer
export const { setTasks } = taskSlice.actions;
export default taskSlice.reducer;


export const getAllTasks = () => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get("/taskRoutes/allTasks");
      if (response.status === 200) {
        const data = response.data;
        console.log("sdsdssd", data)
        dispatch(setTasks({ allTasks: data }));
      }
      if (response.status === 400) {
        // const data = response.data;
        // console.log("sdsdssd",data)
        dispatch(setTasks({ allTasks: null }));
      }
    } catch (error) {
      let message = "ERROR"
      if (error.hasOwnProperty("response")) {
        message = error.response.data;
        toast.error(message)
      }
    }
  };
};

// const deleteTask = async (taskId) => {
//   await axiosInstance.post("/taskRoutes/delete", { taskId });
//   handleData();
// };

export const deleteTask = (payload) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post("/taskRoutes/delete", {
        taskId: payload
      })
      if (response.status === 200) {
        const message = response.data.message || "Deleted successfully!";
        toast.success(message)
      }
    } catch (error) {
      let message = "ERROR"
      if (error.hasOwnProperty('response')) {
        message = error.response.data
        toast.error(message)
      }
    }
  }
}

export const createTask = (payload) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post("/taskRoutes", payload)
      if (response.status === 200) {
        const message = response.data.message || "Added successfully!";
        toast.success(message)
      }
    } catch (error) {
      let message = "ERROR"
      if (error.hasOwnProperty('response')) {
        message = error.response.data
        toast.error(message)
      }
    }
  }
}