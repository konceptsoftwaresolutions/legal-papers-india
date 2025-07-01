import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { MdLockOutline } from 'react-icons/md'; // lock/password
import { FiEye, FiEyeOff } from 'react-icons/fi'; // show/hide

const PasswordField = ({ 
  control, 
  errors, 
  name, 
  placeholder = "", 
  className="", 
  parentClass="", 
  labelClass="", 
  label = "", 
  disabled=false 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={"flex flex-col w-full gap-2" + (parentClass !== "" ? ` ${parentClass}`: "")}>
      {label && <label htmlFor={name} className={"font-medium ml-0.5 text-[#000000]" + (labelClass !== "" ? ` ${labelClass}`: "")}>{label}</label>}
      <div className={`flex items-center border w-full border-solid border-[#6E6E6E] ${disabled ? "bg-[#eceff1] cursor-not-allowed": "bg-transparent"} overflow-hidden rounded-sm relative`}>
        <MdLockOutline size={"18px"} className="text-[#6E6E6E] bg-transparent ml-2" />
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              id={name}
              type={showPassword ? 'text' : 'password'}
              placeholder={placeholder}
              disabled={disabled}
              {...field}
              className={"w-full px-2.5 py-2 text-sm text-[#000000] font-poppins placeholder:font-poppins placeholder:not-italic placeholder:text-sm placeholder:leading-normal placeholder:font-medium placeholder:text-[#6E6E6E] not-italic leading-normal bg-transparent font-medium outline-none disabled:bg-[#eceff1] disabled:cursor-not-allowed border-none" + (className !== "" ? ` ${className}`: "")}
              autoComplete="off"
            />
          )}
        />
        <button
          type="button"
          onClick={disabled ? ()=> {}: togglePasswordVisibility}
          className={`absolute right-2 text-gray-500 bg-transparent ${disabled ? "cursor-not-allowed": ""}`}
        >
          {showPassword ? <FiEyeOff size={"18px"} /> : <FiEye size={"18px"} />}
        </button>
      </div>
      {errors[name] && <p className="text-red-500">{errors[name]?.message}</p>}
    </div>
  );
};

export default PasswordField;
