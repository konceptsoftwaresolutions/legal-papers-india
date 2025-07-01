import { jwtDecode } from "jwt-decode";
import useStorage from "../hooks/useStorage";

const storage = useStorage();

const handleToken = () => {
    try {
        if (storage.find("legalPapers")) {
            const token = storage.get("legalPapers");
            const { foundUser } = jwtDecode(token);
            return foundUser;
        } else {
            return null;
        }
    } catch (error) {
        // return null;
        localStorage.clear();
        window.location.replace("/login");
    }
}

export default handleToken;