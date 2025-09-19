// AnniversaryLoginPage.jsx
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import InputField from "../../components/fields/InputField";
// import { Spinner } from "@material-tailwind/react";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import toast from "react-hot-toast";
// import Swal from "sweetalert2";
// import "./login.scss";

// import logo from "../../assets/logo.png";
// import MyButton from "../../components/buttons/MyButton";
// import { setAuth } from "../../redux/features/auth";
// import { setUser } from "../../redux/features/user";
// import { useDispatch } from "react-redux";
// import useAxios from "../../hooks/useAxios";
// import OTPModal from "./OTPModal";

// const useCelebration = (ref) => {
//   const trigger = useCallback(() => {
//     if (ref.current) {
//       ref.current.classList.add("boom");
//       setTimeout(() => {
//         ref.current.classList.remove("boom");
//       }, 1000);
//     }
//     window.dispatchEvent(new Event("triggerConfetti"));
//   }, [ref]);

//   return trigger;
// };

// const emojis = ["🎉", "🎊", "🎂", "🥳", "🎁", "✨", "🪩", "🎈"];

// const FloatingEmojis = () => {
//   const [emojiList, setEmojiList] = useState([]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const id = Math.random().toString(36).substr(2, 5);
//       const left = Math.random() * 100;
//       const emoji = emojis[Math.floor(Math.random() * emojis.length)];
//       setEmojiList((prev) => [...prev, { id, left, emoji }]);
//       setTimeout(() => {
//         setEmojiList((prev) => prev.filter((e) => e.id !== id));
//       }, 5000);
//     }, 500);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <>
//       {emojiList.map((e) => (
//         <div
//           key={e.id}
//           className="fixed z-20 text-2xl md:text-4xl animate-floatEmoji"
//           style={{ left: `${e.left}%`, bottom: 0 }}
//         >
//           {e.emoji}
//         </div>
//       ))}
//     </>
//   );
// };

// const FireworksOverlay = () => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     let interval;

//     const runConfetti = async () => {
//       try {
//         const confettiModule = await import("canvas-confetti");
//         const confetti = confettiModule.default || confettiModule; // 🔥 support both ESM & CommonJS
//         const canvas = canvasRef.current;

//         if (!canvas) return;

//         const myConfetti = confetti.create(canvas, { resize: true });

//         interval = setInterval(() => {
//           myConfetti({
//             particleCount: 60,
//             spread: 100,
//             startVelocity: 45,
//             origin: { x: 0.5, y: 0.5 }, // ✅ center burst
//           });
//         }, 1000);
//       } catch (error) {
//         console.error("Confetti loading error:", error);
//       }
//     };

//     runConfetti();

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="fixed inset-0 z-50 pointer-events-none w-full h-full"
//     />
//   );
// };

// const ConfettiCanvas = () => {
//   const canvasRef = useRef(null);
//   const particles = useRef([]);

//   const initParticles = (w, h) => {
//     particles.current = Array.from({ length: 120 }).map(() => ({
//       x: Math.random() * w,
//       y: Math.random() * h - h,
//       r: 6 + Math.random() * 6,
//       d: Math.random() * 40 + 10,
//       tilt: Math.random() * 10 - 10,
//       tiltAngleIncremental: 0.07 + Math.random() * 0.05,
//       tiltAngle: 0,
//       color: `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`,
//       velocityY: 1 + Math.random() * 3,
//     }));
//   };

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     let W = (canvas.width = window.innerWidth);
//     let H = (canvas.height = window.innerHeight);
//     initParticles(W, H);

//     let animationFrame;
//     const draw = () => {
//       ctx.clearRect(0, 0, W, H);
//       particles.current.forEach((p) => {
//         p.tiltAngle += p.tiltAngleIncremental;
//         p.y += p.velocityY;
//         p.x += Math.sin(p.tiltAngle) * 0.5;
//         p.tilt = Math.sin(p.tiltAngle) * 15;

//         if (p.y > H + 20) {
//           p.y = -10;
//           p.x = Math.random() * W;
//           p.velocityY = 1 + Math.random() * 3;
//         }

//         ctx.save();
//         ctx.fillStyle = p.color;
//         ctx.translate(p.x + p.tilt, p.y);
//         ctx.rotate((p.tilt * Math.PI) / 180);
//         ctx.fillRect(0, 0, p.r, p.r * 0.4);
//         ctx.restore();
//       });
//       animationFrame = requestAnimationFrame(draw);
//     };

//     const onResize = () => {
//       W = canvas.width = window.innerWidth;
//       H = canvas.height = window.innerHeight;
//       initParticles(W, H);
//     };

//     window.addEventListener("resize", onResize);
//     draw();

//     return () => {
//       cancelAnimationFrame(animationFrame);
//       window.removeEventListener("resize", onResize);
//     };
//   }, []);

//   return (
//     <canvas ref={canvasRef} className="confetti-canvas pointer-events-none" />
//   );
// };

// const Balloon = ({ style, delay }) => (
//   <div className="balloon-wrapper" style={{ animationDelay: delay }}>
//     <div className="balloon">
//       <div className="shine" />
//       <div className="string" />
//       <div className="knot" />
//     </div>
//   </div>
// );

// const HatDrop = () => {
//   const [hats, setHats] = useState([]);
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const id = Math.random().toString(36).substr(2, 5);
//       setHats((prev) => [
//         ...prev,
//         { id, left: Math.random() * 100, start: Date.now() },
//       ]);
//       setTimeout(() => {
//         setHats((prev) => prev.filter((h) => h.id !== id));
//       }, 3500);
//     }, 800);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <>
//       {hats.map((h) => (
//         <div
//           key={h.id}
//           className="hat-drop"
//           style={{ left: `${h.left}%`, animationDelay: "0s" }}
//         >
//           🎓
//         </div>
//       ))}
//     </>
//   );
// };

// const AnniversaryTitle = () => (
//   <div className="text-center text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 drop-shadow-lg animate-textPulse">
//     🎉 3rd Anniversary Celebration 🎊
//   </div>
// );

// const Login = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const dispatch = useDispatch();
//   const axiosInstance = useAxios();
//   const cardRef = useRef(null);
//   const triggerCelebration = useCelebration(cardRef);

//   const [notificationType, setNotificationType] = useState("");
//   const [enteredEmail, setEnteredEmail] = useState("");
//   const [otpModalOpen, setOtpModalOpen] = useState(false);
//   const [pendingUserId, setPendingUserId] = useState(null);

//   if (notificationType) {
//     console.log(notificationType);
//   }

//   const {
//     control,
//     formState: { errors },
//     handleSubmit,
//   } = useForm();
//   const navigate = useNavigate();

//   const getLocation = () => {
//     return new Promise((resolve, reject) => {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const location = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };
//           resolve(location);
//         },
//         (error) => {
//           reject("Unable to retrieve location. Please try again.");
//         }
//       );
//     });
//   };

//   const showAlert = (message, type, email) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: message || "Payment is required to proceed.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // Perform the API call when "Yes" is clicked
//         sendApprovalToAdmin(type, email)
//           .then(() => {
//             // Show success alert
//             Swal.fire({
//               title: "Sent!",
//               text: "Your approval request has been sent to the admin.",
//               icon: "success",
//             });
//           })
//           .catch(() => {
//             // Handle error
//             Swal.fire({
//               title: "Error!",
//               text: "There was an error sending your approval request.",
//               icon: "error",
//             });
//           });
//       }
//     });
//   };

//   const sendApprovalToAdmin = async (type, email) => {
//     try {
//       const response = axiosInstance.post("/notificationRoutes", {
//         notificationType: type,
//         employeeEmail: email,
//       }); // Replace with actual API endpoint
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   };

//   const loginHandler = async (payload) => {
//     console.log("submitted", payload);
//     try {
//       setIsLoading(true);

//       // Get user's current location
//       const location = await getLocation().catch((error) => {
//         toast.error(error);
//         console.error(error);
//         return null;
//       });

//       // Add location to payload if available
//       const loginData = location ? { ...payload, location: location } : payload;

//       // Send the login request with the location included
//       const response = await axiosInstance.post("/api/login", loginData);
//       console.log("res", response);
//       if (response.data.requiresOTP) {
//         setPendingUserId(response.data.userId);
//         setOtpModalOpen(true);
//         toast.success(response.data.message);
//         return;
//       }
//       const token = response.data.token;

//       if (token) {
//         const user = jwtDecode(token);
//         const role = user.foundUser.profile;
//         const userData = user.foundUser;
//         const abilityUser = user.foundUser;
//         const ability = {
//           departments: abilityUser?.userDepartment,
//           profile: abilityUser?.profile,
//         };

//         dispatch(
//           setAuth({
//             token,
//             isAuthenticated: true,
//             role: user.foundUser.profile ? user.foundUser.profile : null,
//             ability: ability,
//             user: user.foundUser,
//           })
//         );
//         dispatch(setUser({ userData }));
//         toast.success(response.data.message);
//       }
//     } catch (error) {
//       if (error.response) {
//         if (error.response.status === 402) {
//           console.log(error);
//           toast.error(error.response.data.message);
//           const notificationType = error.response.data.notificationType;
//           const enteredEmail = payload.email;
//           showAlert(
//             error.response.data.message || "Payment is required to proceed.",
//             notificationType,
//             enteredEmail
//           );
//         } else {
//           toast.error(error.response.data || "Something went wrong");
//         }
//       } else {
//         // 👇 Ye generic error sirf tabhi chale jab modal open nahi hua
//         if (!otpModalOpen) {
//           toast.error("An unexpected error occurred");
//         }
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen w-full bg-gradient-to-br from-[#1e1e2f] to-[#3b1b3d] overflow-hidden flex items-center justify-center px-4">
//       <ConfettiCanvas />
//       <HatDrop />
//       <FloatingEmojis />
//       {/* Confetti just below badge */}
//       <div className="absolute top-[4.5rem] left-1/2 -translate-x-1/2 z-40 w-[300px] h-[150px] pointer-events-none">
//         <FireworksOverlay />
//       </div>

//       <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white text-white px-6 py-2 rounded-full shadow-lg font-bold text-base anniversary-badge z-10 flex items-center gap-3 animate-popIn">
//         🎈 3 Years of Innovation & Trust 🎂
//       </div>

//       <div className="absolute inset-0 pointer-events-none z-10">
//         {[...Array(10)].map((_, i) => (
//           <Balloon key={i} delay={`${i * 0.4}s`} />
//         ))}
//       </div>

//       <div
//         ref={cardRef}
//         className="login-card relative z-20 w-full max-w-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-3xl p-8 animate-fadeInUp text-white mt-20"
//       >
//         <div className="flex flex-col items-center space-y-4 mb-6 animate-bounceIn">
//           <img src={logo} alt="Logo" className="w-[200px] animate-popIn" />
//           <AnniversaryTitle />
//           <p className="italic text-sm text-gray-200 text-center flex items-center gap-2">
//             ✨ "Empowering your journey for 3 incredible years!" 🥳
//           </p>
//         </div>

//         <form onSubmit={handleSubmit(loginHandler)} className="space-y-5">
//           <InputField
//             control={control}
//             errors={errors}
//             name="email"
//             type="email"
//             label="📧 Your Email"
//             placeholder="e.g. john@example.com"
//             labelClass="text-white"
//             className="animated-input"
//             parentClass="login-field"
//           />
//           <InputField
//             control={control}
//             errors={errors}
//             name="password"
//             type="password"
//             label="🔐 Password"
//             placeholder="••••••••"
//             labelClass="text-white"
//             className="animated-input"
//             parentClass="login-field"
//           />
//           <MyButton
//             type="submit"
//             className="bg-gradient-to-r from-[#ff4b2b] to-[#ff416c] hover:scale-105 transition-transform w-full py-3 rounded-xl text-white text-lg font-semibold relative pulse-button"
//           >
//             {isLoading ? (
//               <Spinner className="!w-5 !h-5" />
//             ) : (
//               <span className="flex items-center gap-2">🚀 Log In 🎊</span>
//             )}
//             <div className="button-glow" />
//           </MyButton>
//         </form>
//       </div>
//       <OTPModal
//         open={otpModalOpen}
//         onClose={() => setOtpModalOpen(false)}
//         userId={pendingUserId}
//         onSuccess={(token, userData) => {
//           const user = jwtDecode(token);
//           const role = user.foundUser.profile;
//           const abilityUser = user.foundUser;
//           const ability = {
//             departments: abilityUser?.userDepartment,
//             profile: abilityUser?.profile,
//           };

//           dispatch(
//             setAuth({
//               token,
//               isAuthenticated: true,
//               role,
//               ability,
//               user: user.foundUser,
//             })
//           );
//           dispatch(setUser({ userData: user.foundUser }));
//           toast.success("Logged in successfully");
//           setOtpModalOpen(false);
//         }}
//       />
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import InputField from "../../components/fields/InputField";
import { Spinner } from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

// styles
import "./login.scss";

// logo
import logo from "../../assets/logo.png";
import MyButton from "../../components/buttons/MyButton";
import { setAuth } from "../../redux/features/auth";
import { setUser } from "../../redux/features/user";
import { useDispatch } from "react-redux";
import useAxios from "../../hooks/useAxios";
import OTPModal from "./OTPModal";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const axiosInstance = useAxios();

  const [notificationType, setNotificationType] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [pendingUserId, setPendingUserId] = useState(null);

  if (notificationType) {
    console.log(notificationType);
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const navigate = useNavigate();

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          resolve(location);
        },
        (error) => {
          reject("Unable to retrieve location. Please try again.");
        }
      );
    });
  };

  const showAlert = (message, type, email) => {
    Swal.fire({
      title: "Are you sure?",
      text: message || "Payment is required to proceed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform the API call when "Yes" is clicked
        sendApprovalToAdmin(type, email)
          .then(() => {
            // Show success alert
            Swal.fire({
              title: "Sent!",
              text: "Your approval request has been sent to the admin.",
              icon: "success",
            });
          })
          .catch(() => {
            // Handle error
            Swal.fire({
              title: "Error!",
              text: "There was an error sending your approval request.",
              icon: "error",
            });
          });
      }
    });
  };

  const sendApprovalToAdmin = async (type, email) => {
    try {
      const response = axiosInstance.post("/notificationRoutes", {
        notificationType: type,
        employeeEmail: email,
      }); // Replace with actual API endpoint
      return response;
    } catch (error) {
      throw error;
    }
  };

  const loginHandler = async (payload) => {
    console.log("submitted", payload);
    try {
      setIsLoading(true);

      // Get user's current location
      const location = await getLocation().catch((error) => {
        toast.error(error);
        console.error(error);
        return null;
      });

      // Add location to payload if available
      const loginData = location ? { ...payload, location: location } : payload;

      // Send the login request with the location included
      const response = await axiosInstance.post("/api/login", loginData);
      console.log("res", response);
      if (response.data.requiresOTP) {
        setPendingUserId(response.data.userId);
        setOtpModalOpen(true);
        toast.success(response.data.message);
        return;
      }
      const token = response.data.token;

      if (token) {
        const user = jwtDecode(token);
        const role = user.foundUser.profile;
        const userData = user.foundUser;
        const abilityUser = user.foundUser;
        const ability = {
          departments: abilityUser?.userDepartment,
          profile: abilityUser?.profile,
        };

        dispatch(
          setAuth({
            token,
            isAuthenticated: true,
            role: user.foundUser.profile ? user.foundUser.profile : null,
            ability: ability,
            user: user.foundUser,
          })
        );
        dispatch(setUser({ userData }));
        toast.success(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 402) {
          console.log(error);
          toast.error(error.response.data.message);
          const notificationType = error.response.data.notificationType;
          const enteredEmail = payload.email;
          showAlert(
            error.response.data.message || "Payment is required to proceed.",
            notificationType,
            enteredEmail
          );
        } else {
          toast.error(error.response.data || "Something went wrong");
        }
      } else {
        // 👇 Ye generic error sirf tabhi chale jab modal open nahi hua
        if (!otpModalOpen) {
          toast.error("An unexpected error occurred");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center main-bg items-center w-full h-screen">
      <div className="flex flex-col justify-center w-[95%] sm:w-3/4 lg:w-[45%] h-[70vh] items-center py-5 rounded-md border border-[#E2E2E2] bg-white/5 backdrop-blur-[30px] gap-y-5 text-white relative">
        <div className="w-full flex flex-col items-center my-2 gap-2">
          <img src={logo} alt="logo" className="w-[250px] sm:w-[300px]" />
        </div>

        <form onSubmit={handleSubmit(loginHandler)} className="space-y-4 w-3/4">
          <InputField
            control={control}
            errors={errors}
            type="email"
            name="email"
            label="Email"
            placeholder="Enter Your Email"
            labelClass="text-white"
            className="text-[#FFFFFF] placeholder:text-[#FFFFFF] border-gray-300 font-light !bg-transparent"
            parentClass="login-field"
          />

          <InputField
            control={control}
            errors={errors}
            type="password"
            name="password"
            label="Password"
            placeholder="Enter Your Password"
            labelClass="text-[#FFFFFF]"
            className="text-[#FFFFFF] placeholder:text-[#FFFFFF] font-light"
            parentClass="login-field"
          />

          <MyButton
            type="submit"
            className="font-medium main-bg w-full text-[15px] flex justify-center"
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <span className="koncept-text">Log In</span>
            )}
          </MyButton>
        </form>
      </div>
      <OTPModal
        open={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        userId={pendingUserId}
        onSuccess={(token, userData) => {
          const user = jwtDecode(token);
          const role = user.foundUser.profile;
          const abilityUser = user.foundUser;
          const ability = {
            departments: abilityUser?.userDepartment,
            profile: abilityUser?.profile,
          };

          dispatch(
            setAuth({
              token,
              isAuthenticated: true,
              role,
              ability,
              user: user.foundUser,
            })
          );
          dispatch(setUser({ userData: user.foundUser }));
          toast.success("Logged in successfully");
          setOtpModalOpen(false);
        }}
      />
    </div>
  );
};

export default Login;
