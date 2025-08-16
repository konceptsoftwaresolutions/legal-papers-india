import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
import authReducer from "./features/auth";
import dashboardReducer from "./features/dashboard";
import leadReducer from "./features/leads";
import taskReducer from "./features/tasks";
import paginationReducer from "./features/pagination";
import userReducer from "./features/user";
import followUpReducer from "./features/followups";
import revenueReducer from "./features/revenue";
import notificationReducer from './features/notification'
import masterReducer from './features/masterSearch'
import bucketReducer from "./features/bucket";
import marketingReducer from './features/marketing'
import clientFilesReducer from './features/clientFiles/clientFilesSlice'
import serviceReducer from './features/services'
import performaDetails from './features/performa'
import taxReducer from './features/tax'
import { thunk } from "redux-thunk";

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  pagination: paginationReducer,
  followUps: followUpReducer,
  tasks: taskReducer,
  revenue: revenueReducer,
  leads: leadReducer,
  user: userReducer,
  notification: notificationReducer,
  master: masterReducer,
  bucket: bucketReducer,
  marketing: marketingReducer,
  clientFiles: clientFilesReducer,
  services: serviceReducer,
  tax: taxReducer,
  performaDetails: performaDetails,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "auth",
    "marketing",
    "dashboard",
    "user",
    "leads",
    "pagination",
    "revenue",
    "tasks",
    "followUps",
    "notification",
    "master",
    "clientFiles",
    "services",
    "tax",
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(thunk),
});

export const persistor = persistStore(store);
