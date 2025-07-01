import React from "react";
import { Controller } from "react-hook-form";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const TimeField = ({
  control,
  errors,
  name,
  defaultValue,
  placeholder = "",
  className = "",
  parentClass = "",
  label = "",
  labelClass = "",
  disabled = false,
}) => {
  const timeFormat = "HH:mm:ss"; // Time format for display

  return (
    <div className={`flex flex-col w-full gap-2 ${parentClass}`}>
      {label && (
        <label htmlFor={name} className={`font-medium ml-0.5 text-[#000000] ${labelClass}`}>
          {label}
        </label>
      )}
      <div className="flex items-center border w-full border-solid border-[#6E6E6E] overflow-hidden bg-transparent rounded-sm">
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue || dayjs("00:00:00", timeFormat)} // Set default value if passed
          render={({ field }) => (
            <TimePicker
              {...field}
              id={name}
              format={timeFormat}
              placeholder={placeholder}
              disabled={disabled}
              value={field.value ? dayjs(field.value, timeFormat) : null} // Convert value to dayjs if available
              onChange={(time, timeString) => {
                field.onChange(timeString); // Use timeString for submission
              }}
              className={`w-full text-[#000000] px-2.5 py-[7.5px] text-sm font-poppins placeholder:font-poppins placeholder:text-sm placeholder:font-medium placeholder:text-[#6E6E6E] leading-normal custom-time font-medium disabled:bg-[#eceff1] outline-none border-none ${className}`}
            />
          )}
        />
      </div>
      {errors[name] && <p className="text-red-500">{errors[name]?.message}</p>}
    </div>
  );
};

export default TimeField;
