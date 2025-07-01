import React, { useState, useEffect, useRef } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdLogout } from "react-icons/md";
import SideLink from "./SideLink";
import TouchableOpacity from "../../components/buttons/TouchableOpacity";
import MyButton from "../../components/buttons/MyButton";
import { useDispatch, useSelector } from "react-redux";
import { persistor } from "../../redux/store";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../redux/features/auth";
import toastify from "../../constants/toastify";
import logo from "../../assets/logo.png";

const SidebarProvider = ({ collapse, onCollapse = () => {}, links = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Track URL changes
  const sidebarRef = useRef(null); // Ref for sidebar
  const buttonRef = useRef(null); // Ref for button

  const { userData } = useSelector((state) => state.user);
  const [btnClicked, setBtnClicked] = useState(false);

  // Handle collapse toggle
  const handleCollapse = () => onCollapse(!collapse);

  // Handle logout
  const handleLogout = () => {
    persistor.purge(); // Clears storage (localStorage, etc.)
    persistor.flush().then(() => {
      dispatch(logout()); // Optional if you have a logout action to clear the state
      toastify({ msg: "Logout Successfully ....", type: "success" });

      // Reload the app to reset the Redux store in memory
      window.location.reload();
    });
  };

  // Close sidebar when URL changes
  useEffect(() => {
    setBtnClicked(false);
  }, [location]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setBtnClicked(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const MainComponent = () => (
    <>
      {/* layer1 */}
      <section className="w-full main-black flex justify-between items-center py-4 main-text px-4">
        <h2
          className={`text-white transition-all ${
            collapse ? "w-0 overflow-hidden hidden" : "w-auto"
          }`}
        >
          {/* {userData?.name} */}
          <img src={logo} className="max-w-[180px]"/>
        </h2>
        <TouchableOpacity onClick={handleCollapse}>
          <RxHamburgerMenu size={22} />
        </TouchableOpacity>
      </section>
      {/* layer2 */}
      <section
        className={`flex flex-col my-3 ${
          collapse
            ? "w-[75%] overflow-hidden"
            : "w-[90%] overflow-y-scroll pr-2"
        } sidebar-scroll justify-start items-center h-full`}
      >
        {links.map(
          (
            { text = "", icon, active = false, excess = true, path = "" },
            index
          ) =>
            excess ? (
              <SideLink
                text={text}
                active={active}
                icon={icon}
                key={index}
                path={path}
                collapse={collapse}
              />
            ) : null
        )}
      </section>
      {/* layer3 */}
      <section className="w-full flex justify-center border-t border-solid border-t-gray-300 py-5 items-center flex-col">
        <MyButton
          onClick={handleLogout}
          title={collapse ? "Logout" : null}
          placement="right"
          className={`text-[14px] main-bg ${
            collapse ? "w-[75%]" : "w-[90%]"
          } transition-all px-0 flex justify-center items-center gap-x-2`}
        >
          <MdLogout size={18} />
          <span
            className={`${
              collapse ? "w-0 overflow-hidden hidden" : "w-auto"
            } transition-all`}
          >
            Logout
          </span>
        </MyButton>
      </section>
    </>
  );

  return (
    <>
      <button
        className="mob-slider-button top-5 text-white "
        ref={buttonRef} // Reference the button
        onClick={() => setBtnClicked(!btnClicked)}
      >
        <RxHamburgerMenu size={22} />
      </button>
      <section
        ref={sidebarRef} // Reference the sidebar
        className={`main-black-bg sidebar-div ${
          collapse ? "w-[5%]" : "w-[16%]"
        } ${btnClicked ? "show-sidebar-div" : ""}
        transition-all flex flex-col justify-center items-center h-screen sticky top-0 left-0`}
      >
        <MainComponent />
      </section>
    </>
  );
};

export default SidebarProvider;
