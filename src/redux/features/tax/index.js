// redux/features/tax/taxSlice.js
import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import useAxios from "../../../hooks/useAxios";

const axiosInstance = useAxios();

const initialState = {
    currentInvoiceNo: "",
    invoiceSettings: null,
    allTaxInvoices: [],
    loading: false,
    singleInvoice: null, // for getOne
};

const taxSlice = createSlice({
    name: "taxDetails",
    initialState,
    reducers: {
        setTax: (state, action) => {
            Object.keys(action.payload).forEach((key) => {
                state[key] = action.payload[key];
            });
        },
        setTaxInvoices: (state, action) => {
            state.allTaxInvoices = action.payload;
        },
        setSingleTaxInvoice: (state, action) => {
            state.singleInvoice = action.payload;
        },
    },
});

export const { setTax, setTaxInvoices, setSingleTaxInvoice } = taxSlice.actions;
export default taxSlice.reducer;

/* =======================
   ASYNC ACTIONS
======================= */

// Get Tax Invoice Settings
export const getInvoiceSettings = (module = "TaxInvoice", callback = () => { }) => {
    return async (dispatch) => {
        try {
            dispatch(setTax({ loading: true }));

            const res = await axiosInstance.post("/serviceRoutes/get-invoice-settings", { module });

            if (res.status === 200) {
                const invoiceData = res.data?.data || res.data;
                dispatch(setTax({ invoiceSettings: invoiceData, loading: false }));
                callback(true, invoiceData);
            }
        } catch (err) {
            dispatch(setTax({ loading: false }));
            toast.error(err.response?.data?.message || "Failed to get invoice settings");
            callback(false);
        }
    };
};

// Set / update invoice settings
export const setInvoiceSettings = (payload, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.post("/serviceRoutes/set-invoice-settings", payload);

            if (res.status === 200) {
                toast.success(res.data.message || "Invoice settings saved successfully");
                callback(true, res.data);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update invoice settings");
            callback(false);
        }
    };
};

// Increment invoice number
export const incrementInvoice = (module = "TaxInvoice", callback = () => { }) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.post("/serviceRoutes/invoice-settings-increment", { module });

            if (res.status === 200) {
                dispatch(setTax({ currentInvoiceNo: res.data.currentNumber || res.data.invoiceNo }));
                toast.success("Invoice number incremented");
                callback(true, res.data);
                return res.data;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to increment invoice number");
            callback(false);
            throw err;
        }
    };
};

// Get All Tax Invoices
export const getAllTaxInvoices = (leadId, callback = () => { }) => {
    return async (dispatch) => {
        try {
            dispatch(setTax({ loading: true }));
            const res = await axiosInstance.get(`/serviceRoutes/get-all-tax-invoice`);
            if (res.status === 200) {
                dispatch(setTaxInvoices(res.data || res.data.data || []));
                dispatch(setTax({ loading: false }));
                callback(true, res.data || res.data.data);
            }
        } catch (err) {
            dispatch(setTax({ loading: false }));
            toast.error(err.response?.data?.message || "Failed to fetch tax invoices");
            callback(false);
        }
    };
};

// Get One Tax Invoice
export const getOneTaxInvoice = (id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            dispatch(setTax({ loading: true }));
            const res = await axiosInstance.post(`/serviceRoutes/get-one-tax-invoice`, { id });
            if (res.status === 200) {
                dispatch(setSingleTaxInvoice(res.data || res.data.data || null));
                dispatch(setTax({ loading: false }));
                callback(true, res.data || res.data.data);
            }
        } catch (err) {
            dispatch(setTax({ loading: false }));
            toast.error(err.response?.data?.message || "Failed to fetch tax invoice");
            callback(false);
        }
    };
};

// Download Tax Invoice PDF
export const downloadTaxInvoicePDF = (id, callback = () => { }) => {
    return async () => {
        try {
            const res = await axiosInstance.post(`/serviceRoutes/download-tax-invoice-pdf`, { id }, { responseType: "blob" });
            if (res.status === 200) {
                callback(true, res.data);
                return res.data; // blob
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to download PDF");
            callback(false);
        }
    };
};

// Create Tax Invoice
export const createTaxInvoice = (payload, callback = () => { }) => {
    return async (dispatch) => {
        try {
            dispatch(setTax({ loading: true }));
            const res = await axiosInstance.post(`/serviceRoutes/create-tax-invoice`, payload, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.status === 200) {
                toast.success("Tax Invoice Created");
                dispatch(setTax({ loading: false }));

                const leadId = payload.get?.("leadId");
                if (leadId) {
                    dispatch(getAllTaxInvoices(leadId));
                }
                callback(true, res.data || res.data.data);
            }
        } catch (err) {
            dispatch(setTax({ loading: false }));
            toast.error(err.response?.data?.message || "Failed to create tax invoice");
            callback(false);
        }
    };
};

// Update Tax Invoice
export const updateTaxInvoice = (id, payload, callback = () => { }) => {
    return async (dispatch) => {
        try {
            dispatch(setTax({ loading: true }));
            const res = await axiosInstance.post(`/serviceRoutes/update-tax-invoice`, payload, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.status === 200) {
                toast.success("Tax Invoice Updated");
                dispatch(setTax({ loading: false }));

                const leadId = payload.get?.("leadId");
                if (leadId) {
                    dispatch(getAllTaxInvoices(leadId));
                }
                callback(true, res.data || res.data.data);
            }
        } catch (err) {
            dispatch(setTax({ loading: false }));
            toast.error(err.response?.data?.message || "Failed to update tax invoice");
            callback(false);
        }
    };
};
