import { setAuth } from "../redux/features/auth";
import { store } from "../redux/store";

const handleLogout = () => {
    console.log("iniside logoiut")
    store.dispatch(setAuth({
        token: null,
        role: null,
        user: null,
        isAuthentication: null,
    }))
    localStorage.clear();
    window.location.replace("/login");
}

export default handleLogout;