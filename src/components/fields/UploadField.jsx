import React, { useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { GoUpload } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";

const UploadField = ({ 
    control, 
    errors, 
    name, 
    placeholder = "", 
    className = "", 
    parentClass = "", 
    label = "", 
    labelClass = "", 
    accept = "*", 
    disabled = false 
}) => {
    const [fileName, setFileName] = useState(placeholder);
    const [showCross, setShowCross] = useState(false);
    const inputRef = useRef(null);

    const handleClick = () => {
        if (!disabled && inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            setFileName(event.target.files[0].name);
        } else {
            setFileName(placeholder);
        }
    };

    const handleRemoveFile = (onChange) => {
        setFileName(placeholder);
        onChange("");  // Clear the file in the Controller
        if (inputRef.current) {
            inputRef.current.value = null;  // Clear the input field
        }
    };

    return (
        <div className={`flex flex-col w-full gap-2 ${parentClass}`}>
            {label && <label htmlFor={name} className={`font-medium ml-0.5 text-[#000000] ${labelClass}`}>{label}</label>}
            <div 
                className={`flex items-center border relative w-full py-2 border-solid border-[#6E6E6E] overflow-hidden ${disabled ? "bg-[#eceff1] cursor-not-allowed" : "bg-transparent cursor-pointer"} rounded-sm`} 
                onClick={handleClick}
                onMouseEnter={() => setShowCross(true)}
                onMouseLeave={() => setShowCross(false)}
            >
                <Controller
                    name={name}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <>
                            <h2 className={`w-full px-2.5 text-[#6E6E6E] text-sm font-poppins placeholder:font-poppins placeholder:not-italic placeholder:text-sm placeholder:leading-normal placeholder:font-medium placeholder:text-[#6E6E6E] not-italic leading-normal bg-transparent font-medium outline-none border-none ${className}`}>
                                {fileName}
                            </h2>

                            <input
                                id={name}
                                type="file"
                                accept={accept}
                                ref={inputRef}
                                disabled={disabled}
                                onChange={(e) => {
                                    if (e.target.files.length > 0) {
                                        handleFileChange(e);
                                        onChange(e.target.files);  // Pass the file(s) to the Controller's onChange
                                    }
                                }}
                                className="hidden"
                            />
                            {fileName !== placeholder && showCross && !disabled && (
                                <button
                                    className="p-1 bg-gray-100 cursor-pointer absolute top-2.5 right-2.5 rounded-3xl"
                                    onClick={(e) => {
                                        e.stopPropagation();  // Prevent triggering the file input click
                                        handleRemoveFile(onChange);  // Use the captured onChange function
                                    }}
                                >
                                    <RxCross2 size={10} />
                                </button>
                            )}
                        </>
                    )}
                />
                <GoUpload size={"18px"} className="text-[#6E6E6E] bg-transparent mr-3" />
            </div>
            {errors[name] && <p className="text-red-500">{errors[name]?.message}</p>}
        </div>
    );
};

export default UploadField;
