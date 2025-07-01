import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import useAxios from "../../../hooks/useAxios";
// import { toast } from "react-toastify";


const axiosInstance = useAxios();


const initialState = {
    leadsPagination:null,
};

const paginationSlice = createSlice({
    name: "paginationDetails",
    initialState,
    reducers: {
        setPagination: (state, action) => {
            Object.keys(action.payload).forEach((key) => {
                state[key] = action.payload[key];
            });
        },
    },
});

export const { setPagination } = paginationSlice.actions;
export default paginationSlice.reducer;