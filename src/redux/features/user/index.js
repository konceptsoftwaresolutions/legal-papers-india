import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { setDashboard } from "../dashboard";
import { setFollowUp } from "../followups";
import { setLeads } from "../leads";
import { setNotifications } from "../notification";
import { setRevenue } from "../revenue";
import { setTasks } from "../tasks";
import handleToken from "../../../constants/handleToken";
import useAxios from "../../../hooks/useAxios";

// import { toast } from "react-hot-toast";
// import { setLoader } from "../loader";

// import { persistor } from "../../store";

const axiosInstance = useAxios();

const initialState = {
  user: handleToken(),
  userData: null,
  allUsers: null,
  userdetailToShow: null,
  profileBaseUser: null,
  addUserLoader: false,
  updateUserLoader: false,
  userPassUpdateLoader: false,
  userDeleteLoader: false,
  loggedPassResetLoader: false,
  emailConfigSaveLoader: false,
  emailTestLoader: false,
};

const userSlice = createSlice({
  name: "userDetails",
  initialState: initialState,
  reducers: {
    setUser(state, action) {
      Object.keys(action.payload).forEach((key) => {
        state[key] = action.payload[key];
      });
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;

export const getProfileBasedUser = () => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get("/userRoutes/profileBaseUser");
      if (response.status === 200) {
        const data = response.data;
        dispatch(setUser({ profileBaseUser: data }));
      }
    } catch (error) {
      let message = "Error";
      if (error.hasOwnProperty("response")) {
        message = error.response.data;
        toast.error(message);
      }
    }
  };
};

export const getUserExecutives = () => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get("/userRoutes/userExecutives");
      if (response.status === 200) {
        const data = response.data;
        dispatch(setUser({ userExecutives: data }));
      }
    } catch (error) {
      let message = "Error";
      if (error.hasOwnProperty("response")) {
        message = error.response.data;
        toast.error(message);
      }
    }
  };
};


export const getCallLogs = (payload) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post("/callLogRoutes/callLogsCrm", {
        email: payload
      });
      if (response.status === 200) {
        const data = response.data;
        return data;
      }
    } catch (error) {
      let message = "Error";
      if (error.hasOwnProperty("response")) {
        message = error.response.data;
        toast.error(message);
      }
    }
  };
};

export const addNewUser = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(setUser({ addUserLoader: true }))
      const response = await axiosInstance.post("/userRoute", payload)
      if (response.status === '200') {
        const message = response.data.message || "User added successfully!";
        toast.success(message)
        dispatch(setUser({ addUserLoader: false }))
      }
    } catch (error) {
      dispatch(setUser({ addUserLoader: false }))
      let message = "Error";
      if (error.hasOwnProperty("response")) {
        message = error.response.data;
        toast.error(message)
      }
    }
  }
}




export const changeLoggedInUserPass = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(setUser({ loggedPassResetLoader: true }))
      const response = await axiosInstance.post("userRoutes/resetPassword", payload)
      if (response.status === '200') {
        const message = response.data.message || "User added successfully!";
        toast.success(message)
        dispatch(setUser({ loggedPassResetLoader: false }))
      }
    } catch (error) {
      dispatch(setUser({ loggedPassResetLoader: false }))
      let message = "Error";
      if (error.hasOwnProperty("response")) {
        message = error.response.data;
        toast.error(message)
      }
    }
  }
}


export const updateUserDetails = (payload, setUpdateLoader) => {
  return async (dispatch) => {
    try {
      // dispatch(setUser({ updateUserLoader: true }))
      setUpdateLoader(true)
      const response = await axiosInstance.post("/userRoutes/update", payload)
      if (response.status === 200) {
        setUpdateLoader(false)
        const message = response.data.message || " Updated successfully!";
        toast.success(message)
        // dispatch(setUser({ updateUserLoader: false }))
      }
    } catch (error) {
      setUpdateLoader(false)
      // dispatch(setUser({ updateUserLoader: false }))
      let message = "Error";
      if (error.hasOwnProperty("response")) {
        message = error.response.data;
        toast.error(message)
      }
    }
  }
}

export const updateUserPassword = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(setUser({ userPassUpdateLoader: true }))
      const response = await axiosInstance.post("/userRoutes/changeTeamPassword", payload)
      if (response.status === '200') {
        const message = response.data.message || " Updated successfully!";
        toast.success(message)
        dispatch(setUser({ userPassUpdateLoader: false }))
      }
    } catch (error) {
      dispatch(setUser({ userPassUpdateLoader: false }))
      let message = "Error";
      if (error.hasOwnProperty("response")) {
        message = error.response.data;
        toast.error(message)
      }
    }
  }
}

export const userDelete = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(setUser({ userDeleteLoader: true }))
      const response = await axiosInstance.post("/userRoutes/delete", { email: payload })
      if (response.status === '200') {
        const message = response.data.message || " Deleted successfully!";
        toast.success(message)
        dispatch(setUser({ userDeleteLoader: false }))
      }
    } catch (error) {
      dispatch(setUser({ userDeleteLoader: false }))
      let message = "Error";
      if (error.hasOwnProperty("response")) {
        message = error.response.data;
        toast.error(message)
      }
    }
  }
}

// await axiosInstance.post("/userRoutes/byeEmailConfig", data);
// reset();
// toggleEmailConfigure();
// handleData();

export const byeEmailConfigSave = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(setUser({ emailConfigSaveLoader: true }))
      const response = await axiosInstance.post("/userRoutes/", payload)
      if (response.status === '200') {
        const message = response.data.message || " Deleted successfully!";
        toast.success(message)
        dispatch(setUser({ emailConfigSaveLoader: false }))
      }
    } catch (error) {
      dispatch(setUser({ emailConfigSaveLoader: false }))
      let message = "Error";
      if (error.hasOwnProperty("response")) {
        message = error.response.data;
        toast.error(message)
      }
    }
  }
}

// await axiosInstance.post("/userRoutes/testEmail", formData);
export const testEmailConfig = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(setUser({ emailTestLoader: true }))
      const response = await axiosInstance.post("/userRoutes/testEmail", payload)
      if (response.status === '200') {
        const message = response.data.message || " Deleted successfully!";
        toast.success(message)
        dispatch(setUser({ emailTestLoader: false }))
      }
    } catch (error) {
      dispatch(setUser({ emailTestLoader: false }))
      let message = "Error";
      if (error.hasOwnProperty("response")) {
        message = error.response.data;
        toast.error(message)
      }
    }
  }
}



export const logoutThunkMiddleware = (persistor, navigate) => {
  return async (dispatch) => {
    try {
      persistor.purge();
      localStorage.clear();
      dispatch(
        setToken({
          token: null,
          isAuthenticated: false,
          role: null,
          ability: null,
        })
      );
      dispatch(setUser({ user: null }));
      // dispatch(setBooks({ allBooks: null }))
      // dispatch(setTeamMembers({ allUsers: null }))
      // dispatch(setOrder({ allOrders: null }))
      navigate("/");
    } catch (error) {
      let message = "ERROR";
      if (error.hasOwnProperty("response")) {
        message = error.response.data;
      }
      toast.error(message);
    }
  };
};