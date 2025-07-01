import axios from "axios";
import { toast } from "react-toastify";
import useStorage from "./useStorage";
import handleLogout from "../constants/handleLogout";

const useAxios = (config = {}) => {
    const {
        base = import.meta.env.VITE_SERVER_URL,
    } = config;

    const setCustomizedHeaders = (contentType = "application/json") => {
        const storage = useStorage(); // Ensure useStorage is correctly implemented
        const token = storage.get("legalPapers");
        return {
            "Content-Type": contentType,
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    };

    const axiosInstance = axios.create({
        baseURL: base,
        headers: setCustomizedHeaders(),
        credentials: "include",
        ...config,
    });

    let hasForbiddenErrorOccurred = false;

    // Request interceptor
    axiosInstance.interceptors.request.use(
        (requestConfig) => {
            const contentType =
                requestConfig.headers["Content-Type"] || "application/json";
            requestConfig.headers = setCustomizedHeaders(contentType);
            return requestConfig;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            console.log(error)
            if (error.response?.data === "No token provided." || error.response.data === 'Token is expired!') {
                toast.error("Token Expired, Login Now!"); // Show error message
                handleLogout();
            } else if (hasForbiddenErrorOccurred) {
                return new Promise(() => { }); // Prevent further processing
            }

            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default useAxios;
