import React from "react";
import { Controller } from "react-hook-form";

const TextField = ({
  control,
  errors,
  defaultValue,
  required,
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
    <>
      <div
        className={
          "flex flex-col w-full gap-2" +
          (parentClass !== "" ? ` ${parentClass}` : "")
        }
      >
        {label && (
          <label
            htmlFor={name}
            className={
              "font-medium ml-0.5 text-[#000000]" +
              (labelClass !== "" ? ` ${labelClass}` : "")
            }
          >
            {" "}
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="flex items-center border w-full border-solid border-[#6E6E6E] overflow-hidden bg-transparent rounded-sm">
          <Controller
            name={name}
            control={control}
            className={"bg-transparent w-full"}
            defaultValue={defaultValue}
            rules={{
              required: required
                ? `${label || "This field"} is required`
                : false,
            }}
            render={({ field }) => (
              <input
                id={name}
                type={type}
                placeholder={placeholder}
                {...field}
                // value={value}
                disabled={disabled}
                className={
                  "w-full text-[#000000] px-2.5 py-2 text-sm font-poppins placeholder:font-poppins placeholder:not-italic placeholder:text-sm placeholder:leading-normal placeholder:font-medium placeholder:text-[#6E6E6E] not-italic leading-normal bg-transparent font-medium outline-none border-none disabled:bg-[#eceff1] disabled:cursor-not-allowed" +
                  (className !== "" ? ` ${className}` : "")
                }
              />
            )}
          />
        </div>
        {errors[name] && (
          <p className="text-red-500">{errors[name]?.message}</p>
        )}
      </div>
    </>
  );
};

export default TextField;
