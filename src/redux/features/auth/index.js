// authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import useStorage from "../../../hooks/useStorage";
import handleToken from "../../../constants/handleToken";

const storage = useStorage();

const initialState = {
  token: storage.get("legalPapers") || null,
  isAuthenticated: storage.find("legalPapers"),
  role: storage.get("role"),
  user: handleToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setAuth(state, action) {
      const { token, isAuthenticated, role, user } = action.payload;
      state.token = token;
      state.isAuthenticated = isAuthenticated;
      state.role = role;
      state.user = user,

      storage.set("legalPapers", token);
      storage.set("role", role);
      storage.set("isAuthenticated", isAuthenticated);
    },
    logout(state) {
      // Clear state
      state.token = null;
      state.isAuthenticated = null;
      state.role = null;
      state.user = null;

      // Clear localStorage
      storage.clear(); // Clears all data from localStorage

      // Optionally, you can also clear specific localStorage items if you don't want to clear everything
      // storage.remove("legalPapers");
      // storage.remove("role");
      // storage.remove("isAuthenticated");
    },
  },
});

export const { setAuth  , logout} = authSlice.actions;
export default authSlice.reducer;
