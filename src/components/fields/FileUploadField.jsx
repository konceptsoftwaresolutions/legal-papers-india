import React, { useRef, useEffect } from "react";
import { Controller, useWatch } from "react-hook-form";
import { Button } from "@material-tailwind/react";
import { MdDelete } from "react-icons/md";
import { LuFilePlus } from "react-icons/lu";

const FileUploadField = ({
  control,
  errors,
  name,
  maxFiles = 5,
  label = "",
  labelClass = "",
  accept = "*", // Accept all file types by default
}) => {
  const fileInputRef = useRef(null);

  // Watch the field's value
  const files = useWatch({ control, name }) || [];

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input
    }
  };

  useEffect(() => {
    // Clean up blob URLs when the component unmounts
    return () => {
      files.forEach((file) => {
        if (file.blobURL) {
          URL.revokeObjectURL(file.blobURL);
        }
      });
    };
  }, [files]);

  return (
    <div className="w-full">
      <div className="mb-2">
        {label && (
          <label
            htmlFor={name}
            className={`font-medium ml-0.5 text-[#000000] ${
              labelClass !== "" ? ` ${labelClass}` : ""
            }`}
          >
            {label}
          </label>
        )}
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field: { value = [], onChange } }) => (
          <>
            <div className="border border-solid border-gray-500 rounded-md sm:p-3">
              {/* File list */}
              <div className="flex flex-col gap-4 w-full">
                {value.length > 0 &&
                  value.map((file, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center border border-gray-300 p-2 rounded-md"
                    >
                      <div className="flex items-center gap-4">
                        <span className="truncate max-w-[200px]">
                          {file.fileName || file.name}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        color="red"
                        className="p-1"
                        onClick={() => {
                          const updatedFiles = value.filter(
                            (_, i) => i !== index
                          );
                          onChange(updatedFiles);
                        }}
                      >
                        <MdDelete size={20} />
                      </Button>
                    </div>
                  ))}
              </div>

              {/* Add files button */}
              {value.length < maxFiles && (
                <div
                  className="flex justify-center items-center w-full py-12 border border-dashed text-slate-600 border-slate-600 cursor-pointer rounded-lg mt-4"
                  onClick={handleClick}
                >
                  <LuFilePlus size={"32px"} />
                  <h2 className="font-poppins font-semibold text-[16px] text-slate-700 ml-2">
                    Add Files
                  </h2>
                </div>
              )}
            </div>

            {/* Hidden input for file selection */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={accept} // Accept files based on the prop
              multiple // Allow multiple files
              onChange={(event) => {
                const selectedFiles = Array.from(event.target.files);

                const newFiles = selectedFiles.map((file) => ({
                  file,
                  fileName: file.name,
                  blobURL: URL.createObjectURL(file), // Generate preview URL
                }));

                // Ensure the maxFiles limit isn't exceeded
                if (value.length + newFiles.length <= maxFiles) {
                  onChange([...(value || []), ...newFiles]);
                } else {
                  const remainingSlots = maxFiles - value.length;
                  onChange([
                    ...(value || []),
                    ...newFiles.slice(0, remainingSlots),
                  ]);
                }

                fileInputRef.current.value = ""; // Clear the file input
              }}
            />

            {/* Error message */}
            <div className="flex flex-col justify-start items-start mt-4">
              {errors[name] && (
                <span className="text-red-500 text-sm">
                  {errors[name]?.message}
                </span>
              )}
            </div>
          </>
        )}
      />
    </div>
  );
};

export default FileUploadField;
