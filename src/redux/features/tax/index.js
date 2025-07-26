// redux/features/tax/taxSlice.js
import { createSlice } from "@reduxjs/toolkit";

const taxSlice = createSlice({
    name: "tax",
    initialState: {
        taxEntries: [], // holds all tax data
        allTaxEntries: [], // used for filtered display (like AllTaxInvoices)
    },
    reducers: {
        // Add a new tax entry
        createTaxEntry: (state, action) => {
            state.taxEntries.push(action.payload);
        },

        // Load all tax entries (mock, frontend only)
        getAllTaxEntries: (state, action) => {
            // Simply copy data from taxEntries to allTaxEntries
            state.allTaxEntries = state.taxEntries;
        },
    },
});

export const { createTaxEntry, getAllTaxEntries } = taxSlice.actions;
export default taxSlice.reducer;
