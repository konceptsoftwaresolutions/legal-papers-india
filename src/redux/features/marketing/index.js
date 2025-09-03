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
    dropdownVar: [],
    record: {},
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
        setVariableRecord: (state, action) => {
            state.record = action.payload;
        },
        resetChannelInfo: (state) => {
            state.channelQR = null;
            state.channelDetails = null;
        },
        removeChannelFromState: (state, action) => {
      state.availableChannels = state.availableChannels.filter(
        (ch) => ch.id !== action.payload
      );
    },
    },
});

// ExportsetMarketing now since we changed it in the reducer
export const { setMarketing, setVariableRecord, resetChannelInfo, removeChannelFromState } = marketingSlice.actions;
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
        setIsLoading(true);
        try {
            const response = await axiosInstance.post(
                "/api/legalpapers/create-whatsapp-template-inhouse",
                payload
            );
            console.log("Create template response:", response);

            if (response.status === 200 || response.status === 201) {
                toast.success("Template created successfully!");
                callback(true);
            } else {
                toast.error("Failed to create template");
                callback(false);
            }
        } catch (error) {
            const message = error.response?.data?.message || error.response?.data || "Something went wrong";
            toast.error(message);
            callback(false);
        } finally {
            setIsLoading(false);
        }
    };
};


export const deleteWAInHouseTemplate = (payload, callback = () => { }) => {
    return async (dispatch) => {
        try {

            const response = await axiosInstance.post("/api/legalpapers/delete-whatsapp-inhouse-template", { id: payload });
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

export const sendWAInHouseSampleMessage = (payload, setIsLoading, callback = () => {}) => {
  return async (dispatch) => {
    try {
      setIsLoading(true);

      const config = {};

      // Agar payload FormData hai, axios automatically 'multipart/form-data' set karega
      if (payload instanceof FormData) {
        config.headers = { "Content-Type": "multipart/form-data" };
      }

      const response = await axiosInstance.post(
        "/api/legalpapers/send-single-whatsapp",
        payload,
        config
      );

      if (response.status === 200) {
        setIsLoading(false);
        toast.success("WhatsApp message queued");
        callback(true);
      }
    } catch (error) {
      setIsLoading(false);

      let message = "Error";

      if (error.response) {
        if (typeof error.response.data === "string") {
          message = error.response.data;
        } else if (error.response.data?.message) {
          message = error.response.data.message;
        } else {
          message = JSON.stringify(error.response.data, null, 2);
        }
      } else if (error.message) {
        message = error.message;
      }

      toast.error(message);
      callback(false);
    }
  };
};

export const getWAInHouseTemplateById = (payload, callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.post("/api/legalpapers/get-by-id-whatsapp-inhouse-templates", { id: payload });
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
            const response = await axiosInstance.get(
                "/api/legalpapers/whatsapp-inhouse-templates"
            );

            if (response.status === 200) {
                const dataArray = response?.data?.data?.map((item) => ({
                    label: item.message,  // 👈 use message as template name
                    value: item._id,
                }));

                console.log("Transformed Inhouse Templates:", dataArray);

                dispatch(setMarketing({ allInhouseTemplates: dataArray }));
                callback(dataArray);
            }
        } catch (error) {
            const message = error.response?.data || "Error";
            toast.error(message);
        }
    };
};

export const getDropDownFieldsForVariablesInHouse = (payload) => {
    return async (dispatch) => {
        try {
            console.log("Fetching dropdown fields...", payload);

            const response = await axiosInstance.post(
                "/api/legalpapers/random-participant",
                payload
            );

            const record = response.data?.record || {};

            // Redux me store
            dispatch(setVariableRecord(record));

            // Return the full response so component can await
            return { record };
        } catch (error) {
            console.error("Error fetching dropdown fields:", error);
            return { record: {} };
        }
    };
};


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

export const whatsAppInHouseTemplateSaveSend = (
    payload,
    setSavesendLoading,
    callback = () => { }
) => {
    return async (dispatch) => {
        try {
            setSavesendLoading(true);

            const formData = new FormData();

            // File (if uploaded)
            if (payload.file) {
                formData.append("file", payload.file);
            }

            // Required fields
            formData.append("campaignName", payload.campaignName || "");
            formData.append("channelId", payload.channelId || "");
            formData.append("message", payload.message || "");

            // Type (normal/excel)
            if (payload.type) {
                formData.append("type", payload.type);
            }

            // Template details (arrays)
            if (Array.isArray(payload.templateId) && payload.templateId.length > 0) {
                formData.append("templateId", JSON.stringify(payload.templateId));
            }
            if (Array.isArray(payload.templateName) && payload.templateName.length > 0) {
                formData.append("templateName", JSON.stringify(payload.templateName));
            }

            // Variables (object)
            if (payload.variables && Object.keys(payload.variables).length > 0) {
                formData.append("variables", JSON.stringify(payload.variables));
            }

            // Records (array)
            if (payload.records) {
                formData.append("records", JSON.stringify(payload.records));
            }

            // Optional image
            if (payload.image) {
                formData.append("image", payload.image);
            }

            // Debug log
            console.log("🚀 FormData to backend:");
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const response = await axiosInstance.post(
                "/api/legalpapers/send-bulk-template-leads",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (response.status === 200) {
                toast.success(response.data.message || "Bulk WhatsApp messages sent successfully");
                callback(true);
            }

            setSavesendLoading(false);
        } catch (error) {
            setSavesendLoading(false);
            console.log(error);
            const message =
                error?.response?.data?.message || "Something went wrong while sending messages";
            toast.error(message);
            callback(false);
        }
    };
};


// ✅ GET /whatsappInHouseTemplate/available-channels
export const getAvailableChannels = (callback = () => { }, setLoading) => {
    return async (dispatch) => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(
                "/api/legalpapers/channels/available"
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
            const res = await axiosInstance.get(`/api/legalpapers/channels/qr/${channelId}`);
            if (res.status === 200) {
                dispatch(setMarketing({ channelQR: res.data }));
                callback(true, res.data);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            // toast.error(error?.response?.data?.message || "Failed to fetch channel QR");
            callback(false, error);
        }
    };
};

// ✅ POST /channels/add
export const addChannel = (payload, callback = () => { }, setLoading) => {
    return async (dispatch) => {
        try {
            if (setLoading) setLoading(true);
            const res = await axiosInstance.post("/api/legalpapers/channels/add", payload);
            if (res.status === 200 || res.status === 201) {
                toast.success("Channel added successfully");
                callback(true, res.data);
                dispatch(getAvailableChannels(() => { }, () => { }));
            }
            if (setLoading) setLoading(false);
        } catch (error) {
            if (setLoading) setLoading(false);
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
            const res = await axiosInstance.get(`/api/legalpapers/channels/${channelId}`);
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

export const deleteChannel = (payload, callback) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await axios.post("/delete-channel", payload);
      if (res.status === 200) {
        toast.success(res.data.message || "Channel deleted");

        // Remove from local state
        dispatch(removeChannelFromState(payload.id));

        // Optional: dispatch to refresh channels if needed
        // dispatch(getChannels());

        // Call the callback if provided
        if (callback && typeof callback === "function") {
          callback(res.data);
        }
      }
      dispatch(setLoading(false));
      return res.data;
    } catch (error) {
      dispatch(setError(error));
      toast.error(error?.message || "Something went wrong");
      dispatch(setLoading(false));
      throw error;
    }
  };
};