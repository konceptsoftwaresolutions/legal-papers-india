// import React, { useState, useEffect, useRef } from "react";
// import { RxHamburgerMenu } from "react-icons/rx";
// import { MdLogout } from "react-icons/md";
// import SideLink from "./SideLink";
// import TouchableOpacity from "../../components/buttons/TouchableOpacity";
// import MyButton from "../../components/buttons/MyButton";
// import { useDispatch, useSelector } from "react-redux";
// import { persistor } from "../../redux/store";
// import { useNavigate, useLocation } from "react-router-dom";
// import { logout } from "../../redux/features/auth";
// import toastify from "../../constants/toastify";
// import logo from "../../assets/legalpaperslogo.jpeg";

// const SidebarProvider = ({ collapse, onCollapse = () => {}, links = [] }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation(); // Track URL changes
//   const sidebarRef = useRef(null); // Ref for sidebar
//   const buttonRef = useRef(null); // Ref for button

//   const { userData } = useSelector((state) => state.user);
//   const [btnClicked, setBtnClicked] = useState(false);

//   // Handle collapse toggle
//   const handleCollapse = () => onCollapse(!collapse);

//   // Handle logout
//   const handleLogout = () => {
//     persistor.purge(); // Clears storage (localStorage, etc.)
//     persistor.flush().then(() => {
//       dispatch(logout()); // Optional if you have a logout action to clear the state
//       toastify({ msg: "Logout Successfully ....", type: "success" });

//       // Reload the app to reset the Redux store in memory
//       window.location.reload();
//     });
//   };

//   // Close sidebar when URL changes
//   useEffect(() => {
//     setBtnClicked(false);
//   }, [location]);

//   // Close sidebar when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         sidebarRef.current &&
//         !sidebarRef.current.contains(event.target) &&
//         buttonRef.current &&
//         !buttonRef.current.contains(event.target)
//       ) {
//         setBtnClicked(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const MainComponent = () => (
//     <>
//       {/* layer1 */}
//       <section className="w-full bg-black flex items-center px-2 py-2 text-white">
//         {/* Logo */}
//         {!collapse && (
//           <div className="w-auto transition-all duration-300 ease-in-out">
//             <img
//               src={logo}
//               alt="Logo"
//               className="rounded object-fit"
//               style={{ height: 70, width: 200 }}
//             />
//           </div>
//         )}

//         {/* Spacer for center alignment */}
//         <div className={`flex-1 flex justify-${collapse ? "center" : "end"}`}>
//           <button
//             onClick={handleCollapse}
//             className="text-white p-2 rounded hover:bg-white/10 transition"
//           >
//             <RxHamburgerMenu size={22} />
//           </button>
//         </div>
//       </section>

//       {/* layer2 */}
//       <section
//         className={`flex flex-col my-3 ${
//           collapse
//             ? "w-[75%] overflow-hidden"
//             : "w-[90%] overflow-y-scroll pr-2"
//         } sidebar-scroll justify-start items-center h-full`}
//       >
//         {links.map(
//           (
//             { text = "", icon, active = false, excess = true, path = "" },
//             index
//           ) =>
//             excess ? (
//               <SideLink
//                 text={text}
//                 active={active}
//                 icon={icon}
//                 key={index}
//                 path={path}
//                 collapse={collapse}
//               />
//             ) : null
//         )}
//       </section>
//       {/* layer3 */}
//       <section className="w-full flex justify-center border-t border-solid border-t-gray-300 py-5 items-center flex-col">
//         <MyButton
//           onClick={handleLogout}
//           title={collapse ? "Logout" : null}
//           placement="right"
//           className={`text-[14px] main-bg ${
//             collapse ? "w-[75%]" : "w-[90%]"
//           } transition-all px-0 flex justify-center items-center gap-x-2`}
//         >
//           <MdLogout size={18} />
//           <span
//             className={`${
//               collapse ? "w-0 overflow-hidden hidden" : "w-auto"
//             } transition-all`}
//           >
//             Logout
//           </span>
//         </MyButton>
//       </section>
//     </>
//   );

//   return (
//     <>
//       <button
//         className="mob-slider-button top-5 text-white "
//         ref={buttonRef} // Reference the button
//         onClick={() => setBtnClicked(!btnClicked)}
//       >
//         <RxHamburgerMenu size={22} />
//       </button>
//       <section
//         ref={sidebarRef} // Reference the sidebar
//         className={`main-black-bg sidebar-div ${
//           collapse ? "w-[5%]" : "w-[16%]"
//         } ${btnClicked ? "show-sidebar-div" : ""}
//         transition-all flex flex-col justify-center items-center h-screen sticky top-0 left-0`}
//       >
//         <MainComponent />
//       </section>
//     </>
//   );
// };

// export default SidebarProvider;

import React, { useState, useEffect, useRef } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdLogout } from "react-icons/md";
import SideLink from "./SideLink";
import MyButton from "../../components/buttons/MyButton";
import { useDispatch, useSelector } from "react-redux";
import { persistor } from "../../redux/store";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../redux/features/auth";
import toastify from "../../constants/toastify";
import logo from "../../assets/legalpaperslogo.jpeg";

const SidebarProvider = ({ collapse, onCollapse = () => {}, links = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const buttonRef = useRef(null);

  const { userData } = useSelector((state) => state.user);
  const [btnClicked, setBtnClicked] = useState(false);

  // Handle collapse toggle
  const handleCollapse = () => onCollapse(!collapse);

  // Handle logout
  const handleLogout = () => {
    persistor.purge();
    persistor.flush().then(() => {
      dispatch(logout());
      toastify({ msg: "Logout Successfully ....", type: "success" });
      window.location.reload();
    });
  };

  // Close sidebar when URL changes
  useEffect(() => {
    setBtnClicked(false);
  }, [location]);

  // Close sidebar when clicking outside (mobile only)
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
      {/* Header Section */}
      <section className="w-full bg-black flex items-center px-2 py-2 text-white">
        {/* Logo */}
        {!collapse && (
          <div className="w-auto transition-all duration-300 ease-in-out">
            <img
              src={logo}
              alt="Logo"
              className="rounded object-fit"
              style={{ height: 70, width: 200 }}
            />
          </div>
        )}

        {/* Desktop Toggle Button */}
        <div
          className={`flex-1 flex justify-${
            collapse ? "center" : "end"
          } hidden md:flex`}
        >
          <button
            onClick={handleCollapse}
            className="text-white p-2 rounded hover:bg-white/10 transition"
          >
            <RxHamburgerMenu size={22} />
          </button>
        </div>

        {/* Mobile Close Button */}
        <div className="flex-1 flex justify-end md:hidden">
          <button
            onClick={() => setBtnClicked(false)}
            className="text-white p-2 rounded hover:bg-white/10 transition text-xl font-bold"
          >
            ✕
          </button>
        </div>
      </section>

      {/* Navigation Links */}
      <section
        className={`flex flex-col my-3 ${
          collapse ? "w-[75%] overflow-hidden" : "w-[90%] overflow-y-auto pr-2"
        } sidebar-scroll justify-start items-center flex-1`}
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

      {/* Logout Section */}
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
      {/* Mobile Toggle Button - Only visible on mobile */}
      <button
        className={`
          fixed top-3 left-2.5 z-50 
          text-white p-2 rounded-lg
          transition-all duration-300 ease-in-out
          md:hidden 
          ${
            btnClicked
              ? "opacity-0 pointer-events-none translate-x-80"
              : "opacity-100 translate-x-0"
          }
        `}
        ref={buttonRef}
        onClick={() => setBtnClicked(!btnClicked)}
      >
        <RxHamburgerMenu size={22} />
      </button>

      {/* Mobile Overlay - Only show on mobile when sidebar is open */}
      {btnClicked && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300"
          onClick={() => setBtnClicked(false)}
        />
      )}

      {/* Sidebar */}
      <section
        ref={sidebarRef}
        className={`
          main-black-bg transition-all duration-300 ease-in-out
          flex flex-col justify-start items-center h-screen
          
          
          md:sticky md:top-0 md:left-0 md:translate-x-0 md:z-auto
          ${collapse ? "md:w-[5%]" : "md:w-[16%]"}
          
         
          fixed top-0 left-0 z-40 w-80
          ${btnClicked ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <MainComponent />
      </section>
    </>
  );
};

export default SidebarProvider;
