import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import useAxios from "../../../hooks/useAxios";

const axiosInstance = useAxios();

const initialState = {
    currentInvoiceNo: "",
    invoiceSettings: null,
    allPerformaInvoices: [],
    loading: false,
};

const performaSlice = createSlice({
    name: "performaDetails",
    initialState,
    reducers: {
        setPerforma: (state, action) => {
            Object.keys(action.payload).forEach((key) => {
                state[key] = action.payload[key];
            });
        },
        setPerformaInvoices: (state, action) => {
            state.allPerformaInvoices = action.payload;
        },
    },
});

export const { setPerforma, setPerformaInvoices } = performaSlice.actions;
export default performaSlice.reducer;

export const getInvoiceSettings = (module = "performa", callback = () => { }) => {
    return async (dispatch) => {
        try {
            dispatch(setPerforma({ loading: true }));

            const res = await axiosInstance.get(`/api/invoicesetting/get?module=${module}`);
            if (res.status === 200) {
                dispatch(setPerforma({ invoiceSettings: res.data, loading: false }));
                callback(true, res.data);
            }
        } catch (err) {
            dispatch(setPerforma({ loading: false }));
            toast.error(err.response?.data?.message || "Failed to get invoice settings");
            callback(false);
        }
    };
};

export const setInvoiceSettings = (payload, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.post(`/api/invoicesetting/set`, payload);
            if (res.status === 200) {
                toast.success(res.data.message || "Saved successfully");
                callback(true, res.data);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update invoice settings");
            callback(false);
        }
    };
};

export const incrementInvoice = (callback = () => { }) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.post(`/performa/invoiceincrement`);
            if (res.status === 200) {
                dispatch(setPerforma({ currentInvoiceNo: res.data.invoiceNo }));
                callback(true, res.data);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to increment invoice number");
            callback(false);
        }
    };
};

export const getAllPerformaInvoices = (leadId, callback = () => { }) => {
    return async (dispatch) => {
        try {
            dispatch(setPerforma({ loading: true }));
            const res = await axiosInstance.get(`/performa/getall?leadId=${leadId}`);
            if (res.status === 200) {
                dispatch(setPerformaInvoices(res.data));
                dispatch(setPerforma({ loading: false }));
                callback(true, res.data);
            }
        } catch (err) {
            dispatch(setPerforma({ loading: false }));
            toast.error(err.response?.data?.message || "Failed to fetch performa invoices");
            callback(false);
        }
    };
};

export const createPerformaInvoice = (payload, callback = () => { }) => {
    return async (dispatch) => {
        try {
            dispatch(setPerforma({ loading: true }));

            const res = await axiosInstance.post(`/performa/create`, payload);

            if (res.status === 200) {
                toast.success("Performa Invoice Created");
                dispatch(setPerforma({ loading: false }));

                // Optionally, fetch updated list for this lead
                if (payload.leadId) {
                    dispatch(getAllPerformaInvoices(payload.leadId));
                }

                callback(true, res.data);
            }
        } catch (err) {
            dispatch(setPerforma({ loading: false }));
            toast.error(err.response?.data?.message || "Failed to create invoice");
            callback(false);
        }
    };
};
