import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import useAxios from "../../../hooks/useAxios";

const axiosInstance = useAxios();

const initialState = {
    services: [],
    loading: false,
};

const servicesSlice = createSlice({
    name: "services",
    initialState,
    reducers: {
        setServices: (state, action) => {
            Object.keys(action.payload).forEach((key) => {
                state[key] = action.payload[key];
            });
        },
    },
});

export const { setServices } = servicesSlice.actions;
export default servicesSlice.reducer;

// ------------------- CRUD Actions -------------------

// ✅ Create Service
export const createService = (payload, callback = () => { }) => {
    return async (dispatch) => {
        try {
            dispatch(setServices({ loading: true }));
            const res = await axiosInstance.post("/api/services/create", payload);
            if (res.status === 201) {
                toast.success("Service created successfully");
                callback(true, res.data);
                dispatch(getAllServices()); // Refresh list
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create service");
            callback(false);
        } finally {
            dispatch(setServices({ loading: false }));
        }
    };
};

// ✅ Get All Services
export const getAllServices = (callback = () => { }) => {
    return async (dispatch) => {
        try {
            dispatch(setServices({ loading: true }));
            const res = await axiosInstance.get("/api/services");
            if (res.status === 200) {
                dispatch(setServices({ services: res.data, loading: false }));
                callback(true, res.data);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch services");
            dispatch(setServices({ loading: false }));
            callback(false);
        }
    };
};

// ✅ Update Service
export const updateService = (id, payload, callback = () => { }) => {
    return async (dispatch) => {
        try {
            dispatch(setServices({ loading: true }));
            const res = await axiosInstance.put(`/api/services/${id}`, payload);
            if (res.status === 200) {
                toast.success("Service updated successfully");
                callback(true, res.data);
                dispatch(getAllServices());
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update service");
            callback(false);
        } finally {
            dispatch(setServices({ loading: false }));
        }
    };
};

// ✅ Delete Service
export const deleteService = (id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            dispatch(setServices({ loading: true }));
            const res = await axiosInstance.delete(`/api/services/${id}`);
            if (res.status === 200) {
                toast.success("Service deleted successfully");
                callback(true);
                dispatch(getAllServices());
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete service");
            callback(false);
        } finally {
            dispatch(setServices({ loading: false }));
        }
    };
};
