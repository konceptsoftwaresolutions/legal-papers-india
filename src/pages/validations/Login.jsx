import React, { useState } from "react";

// components
import InputField from "../../components/fields/InputField";
import { Spinner } from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import Swal from "sweetalert2"; // Import SweetAlert2

// styles
import "./login.scss";

// logo
import logo from "../../assets/logo.png";
import MyButton from "../../components/buttons/MyButton";
import { setAuth } from "../../redux/features/auth";
import { setUser } from "../../redux/features/user";
import { useDispatch } from "react-redux";
import useAxios from "../../hooks/useAxios";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const axiosInstance = useAxios();

  const [notificationType, setNotificationType] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");

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
        toast.error("An unexpected error occurred");
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
    </div>
  );
};

export default Login;
