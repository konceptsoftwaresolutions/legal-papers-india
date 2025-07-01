import React from "react";
import { Controller } from "react-hook-form";

const NumericField = ({
  control,
  errors,
  defaultValue,
  max, // Optional max value
  rules = {}, // Add rules prop for validation
  name,
  type = "text",
  placeholder = "",
  className = "",
  parentClass = "",
  label = "",
  labelClass = "",
  disabled = false,
}) => {
  return (
    <div className={`flex flex-col w-full gap-2 ${parentClass}`}>
      {label && (
        <label
          htmlFor={name}
          className={`font-medium ml-0.5 text-[#000000] ${labelClass}`}
        >
          {label}
        </label>
      )}
      <div className="flex items-center border w-full border-solid border-[#6E6E6E] overflow-hidden bg-transparent rounded-sm">
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          rules={rules} // Pass rules to Controller for validation
          render={({ field }) => (
            <input
              id={name}
              max={max}
              min="0"
              type="number"
              placeholder={placeholder}
              {...field}
              disabled={disabled}
              className={`w-full text-[#000000] px-2.5 py-2 text-sm font-poppins placeholder:font-poppins placeholder:not-italic placeholder:text-sm placeholder:leading-normal placeholder:font-medium placeholder:text-[#6E6E6E] not-italic leading-normal bg-transparent font-medium outline-none border-none disabled:bg-[#eceff1] disabled:cursor-not-allowed ${className}`}
            />
          )}
        />
      </div>
      {errors[name] && (
        <p className="text-red-500">{errors[name]?.message}</p>
      )}
    </div>
  );
};

export default NumericField;
