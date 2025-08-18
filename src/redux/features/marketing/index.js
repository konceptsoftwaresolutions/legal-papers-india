import { createSlice } from "@reduxjs/toolkit";
import useAxios from "../../../hooks/useAxios";
import toast from "react-hot-toast";

const axiosInstance = useAxios();

const initialState = {
    allWhatsAppTemplates: null,
    allInhouseTemplates: null,
    availableChannels: [],
    channelQR: null,
    channelDetails: null,
};

const marketingSlice = createSlice({
    name: "marketingDetails",
    initialState,
    reducers: {
        // Change this tosetMarketing
        setMarketing: (state, action) => {
            Object.keys(action.payload).forEach((key) => {
                state[key] = action.payload[key];
            });
        },
    },
});

// ExportsetMarketing now since we changed it in the reducer
export const { setMarketing } = marketingSlice.actions;
export default marketingSlice.reducer;


export const createWhatsAppTemplate = (payload, setIsLoading, callback = () => { }) => {
    return async (dispatch) => {
        try {
            setIsLoading(true)
            const response = await axiosInstance.post("/whatsappTemplate/create", payload);
            if (response.status === 201) {
                toast.success("Template Create Successfully ..")
                callback(true)
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false)
            let message = "Error";
            if (error.hasOwnProperty("response")) {
                message = error.response.data;
                toast.error(message);
            }
        } finally {
            setIsLoading(false)
        }
    };
};


export const deletWAtemplate = (payload, callback = () => { }) => {
    return async (dispatch) => {
        try {

            const response = await axiosInstance.post("/whatsappTemplate/delete", { id: payload });
            if (response.status === 200) {
                toast.success("Template Create Successfully ..")
                callback(true)

            }
        } catch (error) {

            let message = "Error";
            if (error.hasOwnProperty("response")) {
                message = error.response.data;
                toast.error(message);
            }
        } finally {

        }
    };
};

export const sendWASampleMessage = (payload, setIsLoading, callback = () => { }) => {
    return async (dispatch) => {
        try {
            setIsLoading(true)
            const response = await axiosInstance.post("/whatsappTemplate/sendSingleWhatsappFromNewVendor", payload);
            if (response.status === 200) {
                setIsLoading(false)
                toast.success("WhatsApp message queued")
                callback(true)
            }
        } catch (error) {
            setIsLoading(false)
            let message = "Error";
            if (error.hasOwnProperty("response")) {
                message = error.response.data;
                toast.error(message);
            }
        }
    };
};




export const getWATemplateById = (payload, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.post("/whatsappTemplate/getById", { id: payload });
            if (response.status === 200) {
                console.log(response.data)
                callback(true, response.data)

            }
        } catch (error) {
            callback(false)
            let message = "Error";
            if (error.hasOwnProperty("response")) {
                message = error.response.data;
                toast.error(message);
            }
        }
    };
};





export const getAllWhatsAppTemplates = (callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.get("/whatsappTemplate/getAll");
            if (response.status === 200) {
                callback(true)
                // console.log(response.data)
                const dataArray = response?.data?.map((item, index) => {
                    return {
                        label: item.name, value: item._id
                    }
                })
                // console.log(dataArray)
                callback(dataArray)
                dispatch(
                    setMarketing({ allWhatsAppTemplates: dataArray })
                )
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





export const getDropDownFieldsForVariables = () => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.get("/whatsappTemplate/fieldsForDropDownSelectionForVariables");
            if (response.status === 200) {

                const dropdownOptions = response?.data?.fields.map((item) => {
                    return { label: item, value: item }
                })
                dispatch(
                    setMarketing({ dropdownVar: dropdownOptions })
                )

            }
        } catch (error) {
            let message = "Error";
            if (error.hasOwnProperty("response")) {
                message = error.response.data;
                toast.error(message);
            }
        }
    };
}

export const getDropdownVariableValue = (payload, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.post("/whatsappTemplate/getValueBySingleHeader", payload);
            if (response.status === 200) {

                callback(true, response.data.value)

            }
        } catch (error) {
            callback(false)
            let message = "Error";
            if (error.hasOwnProperty("response")) {
                message = error.response.data;
                toast.error(message);
            }
        }
    };
};

export const getAllFilteredLeadIDs = (filterObject = {}, callback = () => { }, setLeadsLoading) => {
    return async (dispatch) => {
        try {
            setLeadsLoading(true)
            const response = await axiosInstance.post("/whatsappTemplate/filtered-lead-ids", {
                filterObject: filterObject,
            });
            if (response.status === 200) {
                setLeadsLoading(false)
                console.log(response)
                callback(true, response.data)
            }
        } catch (error) {
            setLeadsLoading(false)

            toast.error(error);
            // console.log(error);
        }
    };
};





export const whatsAppTemplateSaveSend = (payload, setSavesendLoading, callback = () => { }) => {
    return async (dispatch) => {
        try {
            setSavesendLoading(true)
            const response = await axiosInstance.post("/whatsappTemplate/sendMultiWhatsapp", payload);
            if (response.status === 200) {
                setSavesendLoading(false)
                // console.log(response)
                toast.success(response.data.message)
                callback(true)
            }
        } catch (error) {
            setSavesendLoading(false)
            console.log(error)
            let message = error.response.data.message;
            toast.error(message);
            // callback(false)
            // let message = "Error";
            // if (error.hasOwnProperty("response")) {

            // }
        }
    };
};



export const createEmailTemplate = (payload, setIsLoading, callback = () => { }) => {
    return async (dispatch) => {
        try {
            setIsLoading(true)
            const response = await axiosInstance.post("/emailTemplate/create", payload);
            if (response.status === 201) {
                toast.success("Template Create Successfully ..")
                callback(true)
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false)
            let message = "Error";
            if (error.hasOwnProperty("response")) {
                message = error.response.data;
                toast.error(message);
            }
        } finally {
            setIsLoading(false)
        }
    };
};



export const getAllEmailTemplates = (callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.get("/emailTemplate/getAll");
            if (response.status === 200) {
                callback(true)
                // console.log(response.data)
                const dataArray = response?.data?.map((item, index) => {
                    return {
                        label: item.name, value: item._id
                    }
                })
                // console.log(dataArray)
                callback(dataArray)
                dispatch(
                    setMarketing({ allEmailTemplates: dataArray })
                )
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




export const deleteEmailtemplate = (payload, callback = () => { }) => {
    return async (dispatch) => {
        try {

            const response = await axiosInstance.post("/emailTemplate/delete", { id: payload });
            if (response.status === 200) {
                toast.success("Template Deleted Successfully ..")
                callback(true)

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
export const getEmailTemplateById = (payload, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.post("/emailTemplate/getById", { id: payload });
            if (response.status === 200) {
                console.log(response.data)
                callback(true, response.data)

            }
        } catch (error) {
            callback(false)
            let message = "Error";
            if (error.hasOwnProperty("response")) {
                message = error.response.data;
                toast.error(message);
            }
        }
    };
};



export const getDropDownFieldsForEmailVariables = () => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.get("/emailTemplate/fieldsForDropDownSelectionForVariables");
            if (response.status === 200) {

                const dropdownOptions = response?.data?.fields.map((item) => {
                    return { label: item, value: item }
                })
                dispatch(
                    setMarketing({ dropdownEmailVar: dropdownOptions })
                )

            }
        } catch (error) {
            let message = "Error";
            if (error.hasOwnProperty("response")) {
                message = error.response.data;
                toast.error(message);
            }
        }
    };
}


export const getEmailDropdownVariableValue = (payload, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.post("/emailTemplate/getValueBySingleHeader ", payload);
            if (response.status === 200) {

                callback(true, response.data.value)

            }
        } catch (error) {
            callback(false)
            let message = "Error";
            if (error.hasOwnProperty("response")) {
                message = error.response.data;
                toast.error(message);
            }
        }
    };
};



export const sendEmailSampleMessage = (payload, setIsLoading, callback = () => { }) => {
    return async (dispatch) => {
        try {
            setIsLoading(true)
            const response = await axiosInstance.post("/emailTemplate/sendSingleEmailCampaign", payload);
            if (response.status === 200) {
                setIsLoading(false)
                toast.success("Email is queued")
                callback(true)
            }
        } catch (error) {
            setIsLoading(false)
            let message = "Error";
            if (error.hasOwnProperty("response")) {
                message = error.response.data;
                toast.error(message);
            }
        }
    };
};



export const getAllEmailFilteredLeadIDs = (filterObject = {}, callback = () => { }, setLeadsLoading) => {
    return async (dispatch) => {
        try {
            setLeadsLoading(true)
            const response = await axiosInstance.post("/emailTemplate/filtered-lead-ids", {
                filterObject: filterObject,
            });
            if (response.status === 200) {
                setLeadsLoading(false)
                console.log(response)
                callback(true, response.data)
            }
        } catch (error) {
            setLeadsLoading(false)

            toast.error(error);
            // console.log(error);
        }
    };
};



export const emailTemplateSaveSend = (payload, setSavesendLoading, callback = () => { }) => {
    return async (dispatch) => {
        try {
            setSavesendLoading(true)
            const response = await axiosInstance.post("/emailTemplate/sendMultiEmail", payload);
            if (response.status === 200) {
                setSavesendLoading(false)
                // console.log(response)
                toast.success(response.data.message)
                callback(true)
            }
        } catch (error) {
            setSavesendLoading(false)
            console.log(error)
            let message = error.response.data.message;
            toast.error(message);
            // callback(false)
            // let message = "Error";
            // if (error.hasOwnProperty("response")) {

            // }
        }
    };
};





export const getWhatsAppTemplateLogs = (callback = () => { }) => {
    return async (dispatch) => {
        try {
            // setSavesendLoading(true)
            const response = await axiosInstance.post("/whatsappTemplate/logs");
            if (response.status === 200) {
                console.log(response.data.logs)
                // setSavesendLoading(false)
                // console.log(response)
                // toast.success(response.data.message)
                callback(true, response.data.logs)
            }
        } catch (error) {
            // setSavesendLoading(false)
            console.log(error)
            let message = error.response.data.message;
            toast.error(message);
            // callback(false)
            // let message = "Error";
            // if (error.hasOwnProperty("response")) {

            // }
        }
    };
};


export const getEmailTemplateLogs = (callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.post("/emailTemplate/logs",);
            if (response.status === 200) {
                console.log(response.data)
                callback(true, response.data.logs)
            }
        } catch (error) {
            console.log(error)
            let message = error.response.data.message;
            toast.error(message);
        }
    };
};

export const getSingleWhatsAppCampaignLogs = (payload, callback = () => { }) => {
    return async (dispatch) => {
        try {
            // setSavesendLoading(true)
            const response = await axiosInstance.post("/whatsappTemplate/logById", { id: payload });
            if (response.status === 200) {
                console.log(response.data)
                callback(true, response?.data?.logs)
            }
        } catch (error) {
            console.log(error)
            let message = error.response.data.message;
            toast.error(message);
        }
    };
};


export const getSingleEmailCampaignLogs = (payload, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.post("/logById", { id: payload });
            if (response.status === 200) {
                console.log(response.data)
                callback(true)
            }
        } catch (error) {
            console.log(error)
            let message = error.response.data.message;
            toast.error(message);
        }
    };
};


// whatsapp in house 
export const createInHouseWhatsAppTemplate = (payload, setIsLoading, callback = () => { }) => {
    return async (dispatch) => {
        try {
            setIsLoading(true)
            const response = await axiosInstance.post("/whatsappInHouseTemplate/create", payload);
            if (response.status === 201) {
                toast.success("Template Create Successfully ..")
                callback(true)
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false)
            let message = "Error";
            if (error.hasOwnProperty("response")) {
                message = error.response.data;
                toast.error(message);
            }
        } finally {
            setIsLoading(false)
        }
    };
};

export const deleteWAInHouseTemplate = (payload, callback = () => { }) => {
    return async (dispatch) => {
        try {

            const response = await axiosInstance.post("/whatsappInHouseTemplate/delete", { id: payload });
            if (response.status === 200) {
                toast.success("Template Create Successfully ..")
                callback(true)

            }
        } catch (error) {

            let message = "Error";
            if (error.hasOwnProperty("response")) {
                message = error.response.data;
                toast.error(message);
            }
        } finally {

        }
    };
};

export const sendWAInHouseSampleMessage = (payload, setIsLoading, callback = () => { }) => {
    return async (dispatch) => {
        try {
            setIsLoading(true)
            const response = await axiosInstance.post("/whatsappInHouseTemplate/sendSingleWhatsappFromNewVendor", payload);
            if (response.status === 200) {
                setIsLoading(false)
                toast.success("WhatsApp message queued")
                callback(true)
            }
        } catch (error) {
            setIsLoading(false)
            let message = "Error";
            if (error.hasOwnProperty("response")) {
                message = error.response.data;
                toast.error(message);
            }
        }
    };
};

export const getWAInHouseTemplateById = (payload, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.post("/whatsappInHouseTemplate/getById", { id: payload });
            if (response.status === 200) {
                console.log(response.data)
                callback(true, response.data)

            }
        } catch (error) {
            callback(false)
            let message = "Error";
            if (error.hasOwnProperty("response")) {
                message = error.response.data;
                toast.error(message);
            }
        }
    };
};

export const getAllWhatsAppInHouseTemplates = (callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.get("/whatsappInHouseTemplate/getAll");
            if (response.status === 200) {
                callback(true)
                // console.log(response.data)
                const dataArray = response?.data?.map((item, index) => {
                    return {
                        label: item.name, value: item._id
                    }
                })
                // console.log(dataArray)
                callback(dataArray)
                dispatch(
                    setMarketing({ allWhatsAppTemplates: dataArray })
                )
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

export const getDropDownFieldsForVariablesInHouse = () => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.get("/whatsappInHouseTemplate/fieldsForDropDownSelectionForVariables");
            if (response.status === 200) {

                const dropdownOptions = response?.data?.fields.map((item) => {
                    return { label: item, value: item }
                })
                dispatch(
                    setMarketing({ dropdownVar: dropdownOptions })
                )

            }
        } catch (error) {
            let message = "Error";
            if (error.hasOwnProperty("response")) {
                message = error.response.data;
                toast.error(message);
            }
        }
    };
}

export const getInHouseDropdownVariableValue = (payload, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.post("/whatsappInHouseTemplate/getValueBySingleHeader", payload);
            if (response.status === 200) {

                callback(true, response.data.value)

            }
        } catch (error) {
            callback(false)
            let message = "Error";
            if (error.hasOwnProperty("response")) {
                message = error.response.data;
                toast.error(message);
            }
        }
    };
};

export const getAllFilteredLeadID = (filterObject = {}, callback = () => { }, setLeadsLoading) => {
    return async (dispatch) => {
        try {
            setLeadsLoading(true)
            const response = await axiosInstance.post("/whatsappInHouseTemplate/filtered-lead-ids", {
                filterObject: filterObject,
            });
            if (response.status === 200) {
                setLeadsLoading(false)
                console.log(response)
                callback(true, response.data)
            }
        } catch (error) {
            setLeadsLoading(false)

            toast.error(error);
            // console.log(error);
        }
    };
};

export const whatsAppInHouseTemplateSaveSend = (payload, setSavesendLoading, callback = () => { }) => {
    return async (dispatch) => {
        try {
            setSavesendLoading(true)
            const response = await axiosInstance.post("/whatsappInHouseTemplate/sendMultiWhatsapp", payload);
            if (response.status === 200) {
                setSavesendLoading(false)
                // console.log(response)
                toast.success(response.data.message)
                callback(true)
            }
        } catch (error) {
            setSavesendLoading(false)
            console.log(error)
            let message = error.response.data.message;
            toast.error(message);
            // callback(false)
            // let message = "Error";
            // if (error.hasOwnProperty("response")) {

            // }
        }
    };
};

// ✅ GET /whatsappInHouseTemplate/available-channels
export const getAvailableChannels = (callback = () => { }, setLoading) => {
    return async (dispatch) => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(
                "/whatsappInHouseTemplate/available-channels"
            );
            if (res.status === 200) {
                dispatch(setMarketing({ availableChannels: res.data }));
                callback(true, res.data);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error(error?.response?.data?.message || "Failed to fetch channels");
            callback(false, error);
        }
    };
};

// ✅ GET /channels/qr/:channelId
export const getChannelQR = (channelId, callback = () => { }, setLoading) => {
    return async (dispatch) => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/channels/qr/${channelId}`);
            if (res.status === 200) {
                dispatch(setMarketing({ channelQR: res.data }));
                callback(true, res.data);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error(error?.response?.data?.message || "Failed to fetch channel QR");
            callback(false, error);
        }
    };
};

// ✅ POST /channels/add
export const addChannel = (payload, callback = () => { }, setLoading) => {
    return async (dispatch) => {
        try {
            setLoading(true);
            const res = await axiosInstance.post("/channels/add", payload);
            if (res.status === 200 || res.status === 201) {
                toast.success("Channel added successfully");
                callback(true, res.data);
                // refresh channel list
                dispatch(getAvailableChannels(() => { }, () => { }));
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error(error?.response?.data?.message || "Failed to add channel");
            callback(false, error);
        }
    };
};

// ✅ GET /channels/:channelId
export const getChannelById = (channelId, callback = () => { }, setLoading) => {
    return async (dispatch) => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/channels/${channelId}`);
            if (res.status === 200) {
                dispatch(setMarketing({ channelDetails: res.data }));
                callback(true, res.data);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error(error?.response?.data?.message || "Failed to fetch channel details");
            callback(false, error);
        }
    };
};
