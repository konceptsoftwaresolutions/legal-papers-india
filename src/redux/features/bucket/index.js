import { createSlice } from "@reduxjs/toolkit";
import handleError from "../../../constants/handleError";
import useAxios from "../../../hooks/useAxios";

const axios = useAxios();

const initialState = {
    serviceCategoryStatusQuantity: null,
    serviceCategoryStatusLeadsData: null,
    serviceCategoryStatusQuantityTotalLeads: null,
    serviceCategoryStatusLeadsDataTotal: null,
    serviceCategoryQuantityTotalLeads: null,
    serviceCategoryStatusLeadsDataTotalLeads: null,
}

const bucketSlice = createSlice({
    name: 'bucket',
    initialState,
    reducers: {
        setBucket: (state, { payload }) => {
            Object.keys(payload).forEach((item) => {
                state[item] = payload[item];
            })
        }
    }
});

export const { setBucket } = bucketSlice.actions;
export default bucketSlice.reducer;

// functions
export const getServiceCategoryStatusQuantityThunkMiddleware = (serviceCategory) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('/noClaimBucketRoutes/getServiceCategoryStatusQuantity', { serviceCategory });
            if (response.status === 200) {
                const data = response.data?.result;
                dispatch(setBucket({ serviceCategoryStatusQuantity: data }));
            }
        } catch (error) {
            handleError(error);
        }
    }
}

export const getServiceCategoryStatusQuantityThreeMonthsThunkMiddleware = (serviceCategory) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('/noClaimBucketRoutes/getServiceCategoryStatusQuantityThreeMonths', { serviceCategory });
            if (response.status === 200) {
                const data = response.data?.result;
                dispatch(setBucket({ serviceCategoryStatusQuantityThreeMonths: data }));
            }
        } catch (error) {
            handleError(error);
        }
    }
}

export const getServiceCategoryStatusLeadsDataThunkMiddleware = (payload) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('/noClaimBucketRoutes/getServiceCategoryStatusLeadsData', payload);
            if (response.status === 200) {
                dispatch(setBucket({ serviceCategoryStatusLeadsData: response.data }));
            }
        } catch (error) {
            handleError(error);
        }
    }
}

export const getServiceCategoryStatusLeadsDataThreeMonthsThunkMiddleware = (payload) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('/noClaimBucketRoutes/getServiceCategoryStatusLeadsDataThreeMonths', payload);
            if (response.status === 200) {
                dispatch(setBucket({ serviceCategoryStatusLeadsDataThreeMonths: response.data }));
            }
        } catch (error) {
            handleError(error);
        }
    }
}

export const getServiceCategoryQuantityTotalThunkMiddleware = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`/noClaimBucketRoutes/getServiceCategoryQuantityTotal`);
            if (response.status === 200) {
                let data = response.data?.result;
                dispatch(setBucket({ serviceCategoryQuantityTotal: data }));
            }
        } catch (error) {
            handleError(error);
        }
    }
}

export const getServiceCategoryStatusQuantityTotalLeadsThunkMiddleware = (payload) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(`/noClaimBucketRoutes/getServiceCategoryStatusQuantityTotalLeads`, payload);
            if (response.status === 200) {
                let data = response.data?.result;
                dispatch(setBucket({ serviceCategoryStatusQuantityTotalLeads: data }));
            }
        } catch (error) {
            handleError(error);
        }
    }
}

export const getServiceCategoryStatusQuantityTotalThunk = (payload) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(`/noClaimBucketRoutes/getServiceCategoryStatusQuantityTotal`, payload);
            if (response.status === 200) {
                let data = response.data?.result;

                dispatch(setBucket({ totalBucketDetailsPageData: data }));
            }
        } catch (error) {
            handleError(error);
        }
    }
}

export const getServiceCategoryStatusLeadsDataTotalThunkMiddleware = (payload) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(`/noClaimBucketRoutes/getServiceCategoryStatusLeadsDataTotal`, payload);
            if (response.status === 200) {
                let data = response.data;
                dispatch(setBucket({ serviceCategoryStatusLeadsDataTotal: data }));
            }
        } catch (error) {
            handleError(error);
        }
    }
}

export const getServiceCategoryQuantityTotalLeadsThunkMiddleware = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`/noClaimBucketRoutes/getServiceCategoryQuantityTotalLeads`);
            if (response.status === 200) {
                let data = response.data?.result;
                dispatch(setBucket({ serviceCategoryQuantityTotalLeads: data }));
            }
        } catch (error) {
            handleError(error);
        }
    }
}

export const getServiceCategoryStatusLeadsDataTotalLeadsThunkMiddleware = (payload) => {
    return async (dispatch) => {

        try {
            const response = await axios.post(`/noClaimBucketRoutes/getServiceCategoryStatusLeadsDataTotalLeads`, payload);
            if (response.status === 200) {
                let data = response.data;
                dispatch(setBucket({ serviceCategoryStatusLeadsDataTotalLeads: data }));
            }
        } catch (error) {
            handleError(error);
        }
    }
}


export const getAdminBucketDetails = ({ payload }) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(`/noClaimBucketRoutes/getServiceCategoryStatusQuantity`, { payload });
            if (response.status === 200) {
                let data = response.data;
                dispatch(setBucket({ serviceCategoryStatusLeadsDataTotalLeads: data }));
            }
        } catch (error) {
            handleError(error);
        }
    }
}







export const assignLeadBySearchNCBucket = (payload , callback = () => { }) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(`/noClaimBucketRoutes/assignBucketLeadByLeadIds`, payload );
            if (response.status === 200) {
                let data = response.data;
                callback(true)
                // dispatch(setBucket({ serviceCategoryStatusLeadsDataTotalLeads: data }));
            }
        } catch (error) {
            handleError(error);
        }
    }
}