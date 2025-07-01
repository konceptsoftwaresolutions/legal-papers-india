import React from "react";
import { Controller } from 'react-hook-form';
import { DatePicker } from 'antd';
import moment from "moment";

import "./styles/DateStyle.css";

const DateField = ({ 
    control, 
    errors, 
    name, 
    placeholder = "",
    className="", 
    parentClass="", 
    label = "", 
    labelClass="", 
    disabled=false,
    picker="date",
    format="YYYY-MM-DD",
}) => {
    return (
        <div className={`flex flex-col w-full gap-2 ${parentClass}`}>
            {label && <label htmlFor={name} className={`font-medium ml-0.5 text-[#000000] ${labelClass}`}>{label}</label>}
            <div className="flex items-center border w-full border-solid border-[#6E6E6E] overflow-hidden bg-transparent rounded-sm">
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            id={name}
                            placeholder={placeholder}
                            disabled={disabled}
                            picker={picker}
                            {...field}
                            className={`w-full text-[#000000] px-2.5 py-[7.5px] text-sm font-poppins placeholder:font-poppins placeholder:not-italic placeholder:text-sm placeholder:leading-normal placeholder:font-medium placeholder:text-[#6E6E6E] not-italic leading-normal custom-date font-medium disabled:bg-[#eceff1] outline-none border-none ${className}`}
                            format={format} // Adjust the format as needed
                            onChange={(date, dateString) => field.onChange(dateString)} // Pass date string to react-hook-form
                            value={field.value ? moment(field.value, format) : null} // Set value if needed
                        />
                    )}
                />
            </div>
            {errors[name] && <p className="text-red-500">{errors[name]?.message}</p>}
        </div>
    );
}

export default DateField;
