import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import useAxios from "../../../hooks/useAxios";
import handleError from "../../../constants/handleError";

const axiosInstance = useAxios();
const initialState = {
  allSalesExecutive: null,
  addLeadLoader: false,
};

const leadsSlice = createSlice({
  name: "leadsDetails",
  initialState,
  reducers: {
    // Change this to setLeads
    setLeads: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        state[key] = action.payload[key];
      });
    },
  },
});

// Export setLeads now since we changed it in the reducer
export const { setLeads } = leadsSlice.actions;
export default leadsSlice.reducer;

export const getAllLeads = (currentPage, filter = false, filterObject = {}, callback = () => { }) => {
  return async (dispatch) => {
    try {
      dispatch(setLeads({ leadLoader: true }))
      const response = await axiosInstance.post("/leadRoutes/allLead", {
        page: currentPage,
        filter: filter,
        filterObject: filterObject,
      });
      if (response.status === 200) {
        const leadsData = response.data;
        callback(true, response.data)
        dispatch(setLeads(leadsData)); // Dispatching setLeads
        dispatch(setLeads({ leadLoader: false }))
      }
    } catch (error) {
      dispatch(setLeads({ leadLoader: true }))
      toast.error(error);
      // console.log(error);
    }
  };
};



export const getAllRenewals = (currentPage, filter = false, filterObject = {}) => {
  return async (dispatch) => {
    try {
      dispatch(setLeads({ leadLoader: true }))
      const response = await axiosInstance.post("/leadRoutes/allRenewals", {
        page: currentPage,
        filter: filter,
        filterObject: filterObject,
      });
      if (response.status === 200) {
        const leadsData = response.data;
        dispatch(setLeads({ renewalLeads: leadsData })); // Dispatching setLeads
        dispatch(setLeads({ leadLoader: false }))
      }
    } catch (error) {
      dispatch(setLeads({ leadLoader: true }))
      toast.error(error);
      // console.log(error);
    }
  };
};

export const addLead = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(setLeads({ addLeadLoader: true }))
      const response = await axiosInstance.post("/leadRoutes/manualLeads", {
        ...payload
      })
      if (response.status === 200) {
        const message = response.data.message || "Added successfully!";
        toast.success(message)
        dispatch(setLeads({ addLeadLoader: false }))
        dispatch(getAllLeads(1, false));
      }
    } catch (error) {
      dispatch(setLeads({ addLeadLoader: false }))
      let message = "ERROR"
      if (error.hasOwnProperty('response')) {
        message = error.response.data
        toast.error(message)
      }
    }
  }
}

export const editLead = (formData, callback = () => { }) => {
  return async (dispatch) => {
    try {
      // dispatch(setLeads({addLeadLoader : true}))
      const response = await axiosInstance.post("/leadRoutes/leadUpdate", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure proper headers
        },
      });
      console.log(response)
      if (response.status === 200) {
        const message = response.data || "Added successfully!";
        toast.success(message)
        callback(true)
        // dispatch(setLeads({addLeadLoader : false}))
      }
    } catch (error) {
      // dispatch(setLeads({addLeadLoader : false}))
      let message = "ERROR"
      if (error.hasOwnProperty('response')) {
        message = error.response.data
        toast.error(message)
      }
    }
  }
}

export const deleteLead = (payload, callback = () => { }) => {
  return async (dispatch) => {
    try {
      // dispatch(setLeads({addLeadLoader : true}))
      const response = await axiosInstance.post("/leadRoutes/delete", { leadId: payload });
      if (response.status === 200) {
        const message = response.data || "Deleted successfully!";
        toast.success(message)
        callback(true)
        // dispatch(setLeads({addLeadLoader : false}))
      }
    } catch (error) {
      // dispatch(setLeads({addLeadLoader : false}))
      let message = "ERROR"
      if (error.hasOwnProperty('response')) {
        message = error.response.data
        toast.error(message)
      }
    }
  }
}

export const byeByeThunkMiddleware = (formData) => {
  return async (dispatch) => {
    try {
      // dispatch(setLeads({addLeadLoader : true}))
      const response = await axiosInstance.post("/leadRoutes/mail", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure proper headers
        },
      });
      console.log(response)
      if (response.status === 200) {
        const message = response.data || "Successfull!";
        toast.success(message)
        // dispatch(setLeads({addLeadLoader : false}))
      }
    } catch (error) {
      // dispatch(setLeads({addLeadLoader : false}))
      let message = "ERROR"
      if (error.hasOwnProperty('response')) {
        message = error.response.data
        toast.error(message)
      }
    }
  }
}

export const handleMoveNCBucket = (payload, callback = () => { }) => {
  return async (dispatch) => {
    try {
      // dispatch(setLeads({addLeadLoader : true}))
      const response = await axiosInstance.post("leadRoutes/moveToNoClaimBucket", { leadId: payload });
      if (response.status === 200) {
        callback(true)
        const message = response.data.message || " Successfully!";
        toast.success(message)
        // dispatch(setLeads({addLeadLoader : false}))
      }
    } catch (error) {
      // dispatch(setLeads({addLeadLoader : false}))
      callback(false)
      let message = "ERROR"
      if (error.hasOwnProperty('response')) {
        message = error.response.data
        toast.error(message)
      }
    }
  }
}

export const getAllLeadsUsingFilter = (
  currentPage = "1",
  filter,
  filterObject
) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post("/leadRoutes/allLead", {
        page: currentPage,
        filter: filter,
        filterObject: filterObject,
      });
      if (response.status === 200) {
        const leadsData = response.data;
        dispatch(setLeads(leadsData)); // Dispatching setLeads
      }
    } catch (error) {
      toast.error(error);
      // console.log(error);
    }
  };
};

export const getAllSalesExecutive = () => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get("/userRoutes/allSalesExecutive");
      if (response.status === 200) {
        const data = response.data;
        dispatch(setLeads({ allSalesExecutive: data }));
      }
    } catch (error) {
      let message = "ERROR";
      if (error.hasOwnProperty("response")) {
        message = error.response.data;
      }
      toast.error(message);
    }
  };
};

export const getOpenNCBucketLeadsData = () => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get(
        "/noClaimBucketRoutes/getServiceCategoryQuantity"
      );
      if (response.status === 200) {
        const data = response.data.result;
        dispatch(setLeads({ openNCBucketLeads: data ? [...data]?.reverse() : [] }));
      }
    } catch (error) {
      toast.error(error);
    }
  };
};

export const getOpenNCBucketLeadsThreeMonthsData = () => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get(
        "/noClaimBucketRoutes/getServiceCategoryQuantitythreemonths"
      );
      if (response.status === 200) {
        const data = response.data.result;
        dispatch(setLeads({ openNCBucketLeadsThreeMonths: data ? [...data]?.reverse() : [] }));
      }
    } catch (error) {
      toast.error(error);
    }
  };
};

export const getUsedNCBucketLeadsThreeMonthsData = (callback = () => { }) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get(
        "/noClaimBucketRoutes/getServiceCategoryQuantityUsedNCBucket"
      );
      if (response.status === 200) {
        const data = response.data.result;
        console.log(data)
        callback(true, data)
        // dispatch(setLeads({ openNCBucketLeadsThreeMonths: data ? [...data]?.reverse() : [] }));
      }
    } catch (error) {
      callback(false)
      // console.log(error)
      toast.error(error.response.data);
    }
  };
};

export const getAssignedNCBucketLeadsData = (
  page = "1",
  filter,
  filterObject
) => {
  return async (dispatch) => {
    try {
      dispatch(setLeads({ assignedNCLoader: true }))
      const response = await axiosInstance.post(
        "noClaimBucketRoutes/allNCBucketLead",
        {
          page: page,
          filter: filter,
          filterObject: filterObject,
        }
      );
      if (response.status === 200) {
        const data = response.data;
        dispatch(setLeads({ assignedNCBucketLeads: data }));
        dispatch(setLeads({ assignedNCLoader: false }))
      }
    } catch (error) {
      toast.error(error);
      dispatch(setLeads({ assignedNCLoader: false }))
    }
  };
};


export const getIECRenewalLeads = (
  page = "1",
  filter,
  filterObject
) => {
  return async (dispatch) => {
    try {
      dispatch(setLeads({ assignedNCLoader: true }))
      const response = await axiosInstance.post(
        "/leadRoutes/getOpenManualIecLeads",
        {
          page: page,
          filter: filter,
          filterObject: filterObject,
        }
      );
      if (response.status === 200) {
        const data = response.data;
        dispatch(setLeads({ iecRenewalLeads: data }));
        dispatch(setLeads({ assignedNCLoader: false }))
      }
    } catch (error) {
      toast.error(error);
      dispatch(setLeads({ assignedNCLoader: false }))
    }
  };
};

export const getTotalNCBucketLeadsData = (page = "1", filter, filterObject) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get(
        "noClaimBucketRoutes/getServiceCategoryQuantityTotal",
        {
          page: page,
          filter: filter,
          filterObject: filterObject,
        }
      );
      if (response.status === 200) {
        const data = response.data.result;
        dispatch(setLeads({ totalNCBucketLeads: data }));
      }
    } catch (error) {
      toast.error(error);
    }
  };
};

export const getTotalBucketLeadsData = () => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get(
        "noClaimBucketRoutes/getServiceCategoryQuantityTotalLeads"
      );
      if (response.status === 200) {
        const data = response.data;
        dispatch(setLeads({ totalBucketLeads: data }));
      }
    } catch (error) {
      toast.error(error);
    }
  };
};

export const getOldLeadsData = () => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get("/leadRoutes/getOldLeads");
      if (response.status === 200) {
        const data = response.data;
        dispatch(setLeads({ oldLeads: data }));
      }
    } catch (error) {
      toast.error(error);
    }
  };
};

export const getLeaByID = (payload) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post(`/leadRoutes/leadById`, {
        leadId: payload,
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      toast.error(error);
    }
  };
};


export const getImportantLeads = () => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get("/leadRoutes/getImportantAutoOperation");
      if (response.status === 200) {
        const data = response.data;
        dispatch(setLeads({ impLeads: data.reverse() })); // Dispatching setLeads
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

export const handleBulkSalesAssign = (payload) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post("/leadRoutes/leadAssignBulk", payload)
      if (response.status === 200) {
        const message = response.data.message || "Assigned successfully!";
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

export const handleBulkSalesAssignNormalLeads = (payload) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post("/leadRoutes/leadAssignBulkNormalLeads", payload)
      if (response.status === 200) {
        const message = response.data.message || "Assigned successfully!";
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

export const handleIECBulkSalesAssign = (payload) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post("/leadRoutes/leadAssignBulkIecLeads", payload)
      if (response.status === 200) {
        const message = response.data.message || "Assigned successfully!";
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


export const handleLeadForward = (payload) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post("/leadRoutes/autoOperation", {
        leadId: payload
      })
      if (response.status === 200) {
        const message = response.data.message || "Forward successfully!";
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

export const handleManualIECLeadForward = (payload) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post("/leadRoutes/autoOperationManualIEC", {
        leadId: payload
      })
      if (response.status === 200) {
        const message = response.data.message || "Forward successfully!";
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


export const handleImpLeadForward = (payload) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post("/leadRoutes/importantAutoOperation", {
        leadId: payload
      })
      if (response.status === 200) {
        const message = response.data.message || "Forward successfully!";
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

export const removeRenewalLead = (payload, page, filters, filterObject) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post("/leadRoutes/setRenewalPageTrue", {
        leadId: payload
      })
      if (response.status === 200) {
        const message = response.data.message || "Successfully!";
        toast.success(message)
        dispatch(getAllRenewals(page, filters, filterObject));
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

// noClaimBucketRoutes/getAllSalesExecutives
export const getAllSalesExecutivesThunkMiddleware = () => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get('/noClaimBucketRoutes/getAllSalesExecutives');
      if (response.status === 200) {
        dispatch(setLeads({ allSalesExecutive: response.data?.result }));
      }
    } catch (error) {
      handleError(error);
    }
  }
}


// userRoutes/allOperationsExecutive
export const getAllOperationsExecutive = () => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get('/userRoutes/allOperationsExecutive');
      if (response.status === 200) {
        dispatch(setLeads({ allOperationsExecutive: response.data }));
      }
    } catch (error) {
      handleError(error);
    }
  }
}

export const adminBucketNCLeadShare = (payload) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post("/noClaimBucketRoutes/assignBucketLeadByInput", payload)
      if (response.status === 200) {
        const message = response.data.message || "Successfully!";
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

export const bulkUploadLeads = (excelData, callback = () => {}) => {
  return async (dispatch) => {
    try {
      dispatch(setLeads({ leadLoader: true }));

      const response = await axiosInstance.post("/leadRoutes/bulkUpload", {
        leads: excelData, // assuming backend expects array under "leads"
      });

      if (response.status === 200) {
        toast.success("Leads uploaded successfully");
        callback(true, response.data);
        dispatch(setLeads({ leadLoader: false }));
      }
    } catch (error) {
      dispatch(setLeads({ leadLoader: false }));
      toast.error("Failed to upload leads");
      console.error("Bulk upload error:", error);
    }
  };
};