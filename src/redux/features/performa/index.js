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
            // Always store an array
            state.allPerformaInvoices = Array.isArray(action.payload)
                ? action.payload
                : action.payload?.data || [];
        },
    },
});

export const { setPerforma, setPerformaInvoices } = performaSlice.actions;
export default performaSlice.reducer;

export const getInvoiceSettings = (module = "Proforma", callback = () => { }) => {
    return async (dispatch) => {
        try {
            dispatch(setPerforma({ loading: true }));

            const res = await axiosInstance.post("/serviceRoutes/get-invoice-settings", { module });

            if (res.status === 200) {
                // Pick data from res.data.data if exists, otherwise res.data
                const invoiceData = res.data?.data || res.data;

                dispatch(setPerforma({ invoiceSettings: invoiceData, loading: false }));
                callback(true, invoiceData);
            }
        } catch (err) {
            dispatch(setPerforma({ loading: false }));
            toast.error(err.response?.data?.message || "Failed to get invoice settings");
            callback(false);
        }
    };
};

// Set / update invoice settings
export const setInvoiceSettings = (payload, callback = () => { }) => {
    return async (dispatch) => {
        try {
            // backend expects: { module, prefix, currentNumber }
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
export const incrementInvoice = (module = "Proforma", callback = () => { }) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.post("/serviceRoutes/invoice-settings-increment", { module });

            if (res.status === 200) {
                // Save current invoice number in Redux
                dispatch(setPerforma({ currentInvoiceNo: res.data.currentNumber || res.data.invoiceNo }));
                toast.success("Invoice number incremented");

                // Callback
                callback(true, res.data);

                // RETURN data so dispatch().unwrap() works
                return res.data;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to increment invoice number");
            callback(false);
            throw err; // Throw so .unwrap() can catch
        }
    };
};

export const getAllPerformaInvoices = (leadId, callback = () => { }) => {
    return async (dispatch) => {
        try {
            dispatch(setPerforma({ loading: true }));
            const res = await axiosInstance.get(`/serviceRoutes/get-all-proforma-invoice`);
            if (res.status === 200) {
                dispatch(setPerformaInvoices(res.data));
                dispatch(setPerforma({ loading: false }));
                callback(true, res.data || res.data.data);
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

            const res = await axiosInstance.post(`/serviceRoutes/create-proforma-invoice`, payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.status === 200 || res.status === 201) {
                toast.success("Performa Invoice Created");
                dispatch(setPerforma({ loading: false }));

                // Optionally refresh list
                if (payload.get?.("leadId")) { // FormData se leadId nikalna
                    dispatch(getAllPerformaInvoices(payload.get("leadId")));
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

// Get one invoice by ID
export const getOnePerformaInvoice = (id, callback = () => { }) => {
    return async () => {
        try {
            const res = await axiosInstance.post("/serviceRoutes/get-one-proforma-invoice", { id });
            callback(true, res.data?.data || res.data);
            return res.data?.data || res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch invoice");
            callback(false);
            throw err;
        }
    };
};

// Download invoice PDF by ID
export const downloadPerformaInvoicePDF = (id, callback = () => { }) => {
    return async () => {
        try {
            const res = await axiosInstance.post("/serviceRoutes/download-proforma-invoices-pdf", { id }, { responseType: "blob" });
            callback(true, res.data);
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to download PDF");
            callback(false);
            throw err;
        }
    };
};

// Edit performa invoice
export const editPerformaInvoice = (id, payload, callback = () => { }) => {
    return async (dispatch) => {
        try {
            dispatch(setPerforma({ loading: true }));
            const res = await axiosInstance.post(
                `/serviceRoutes/edit-proforma-invoice`,
                payload, // send the FormData as is
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (res.status === 200) {
                toast.success("Invoice updated successfully");
                dispatch(setPerforma({ loading: false }));
                callback(true, res.data?.data || res.data);

                // Optionally refresh list
                dispatch(getAllPerformaInvoices());
            }
        } catch (err) {
            dispatch(setPerforma({ loading: false }));
            toast.error(err.response?.data?.message || "Failed to edit invoice");
            callback(false);
        }
    };
};

// Delete performa invoice
export const deletePerformaInvoice = (id, callback = () => { }) => {
    return async (dispatch) => {
        try {
            dispatch(setPerforma({ loading: true }));

            const res = await axiosInstance.post("/serviceRoutes/delete-proforma-invoice", { id });

            if (res.status === 200) {
                toast.success(res.data?.message || "Invoice deleted successfully");
                dispatch(setPerforma({ loading: false }));

                // Refresh list
                dispatch(getAllPerformaInvoices());

                callback(true, res.data);
            }
        } catch (err) {
            dispatch(setPerforma({ loading: false }));
            toast.error(err.response?.data?.message || "Failed to delete invoice");
            callback(false);
        }
    };
};
