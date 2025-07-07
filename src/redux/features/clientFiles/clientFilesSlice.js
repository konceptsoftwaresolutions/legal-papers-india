import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    filters: {
        name: "",
        mobileNumber: "",
        leadId: "", // ✅ use camelCase consistently
    },
    currentPage: 1,
    perPage: 10,
};

const clientFilesSlice = createSlice({
    name: "clientFiles",
    initialState,
    reducers: {
        setClientFilePage: (state, action) => {
            state.currentPage = action.payload;
        },
        addClientFile: {
            reducer: (state, action) => {
                state.items.push(action.payload);
            },
            prepare: (data) => ({
                payload: {
                    id: nanoid(),
                    ...data,
                },
            }),
        },
        updateClientFile: (state, action) => {
            const index = state.items.findIndex(
                (item) => item.id === action.payload.id
            );
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        deleteClientFile: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        setClientFileFilters: (state, action) => {
            state.filters = action.payload;
            state.currentPage = 1; // optional: reset to first page on filter
        },
        resetClientFileFilters: (state) => {
            state.filters = {
                name: "",
                mobileNumber: "",
                leadId: "", // ✅ match default
            };
            state.currentPage = 1;
        },
    },
});

export const {
    setClientFilePage,
    addClientFile,
    updateClientFile,
    deleteClientFile,
    setClientFileFilters,
    resetClientFileFilters,
} = clientFilesSlice.actions;

export default clientFilesSlice.reducer;
