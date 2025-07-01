import React, { useRef, useEffect } from "react";
import { LuImagePlus } from "react-icons/lu";
import { Controller, useWatch } from "react-hook-form";
import { Button } from "@material-tailwind/react";
import { MdDelete } from "react-icons/md";

const ImageField = ({
  control,
  errors,
  name,
  maxFiles,
  label = "",
  labelClass = "",
}) => {
  const fileInputRef = useRef(null);

  // Watch the field's value to detect changes
  const images = useWatch({ control, name }) || [];

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input click
    }
  };

  useEffect(() => {
    // Clean up blob URLs when the component unmounts
    return () => {
      images.forEach((image) => {
        if (image.blobURL) {
          URL.revokeObjectURL(image.blobURL);
        }
      });
    };
  }, [images]);

  return (
    <>
      <div className="">
        <div className="mb-2">
          {label && (
            <label
              htmlFor={name}
              className={
                "font-medium ml-0.5  text-[#000000]" +
                (labelClass !== "" ? ` ${labelClass}` : "")
              }
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
                <div className="flex justify-center gap-8 flex-wrap w-full">
                  {value.length > 0 &&
                    value.map((image, index) => (
                      <div
                        key={index}
                        className="flex justify-center items-center"
                      >
                        <div className="relative flex w-full mx-auto my-2 justify-center flex-col items-center border border-solid border-slate-300 rounded-md overflow-hidden">
                          <img
                            src={image.blobURL ? image.blobURL : image}
                            alt={`Selected ${index}`}
                            className="object-cover w-full h-[220px]"
                          />
                          <Button
                            onClick={() => {
                              const updatedImages = value.filter(
                                (_, i) => i !== index
                              );
                              onChange(updatedImages);
                            }}
                            className="my-4 bg-red-500"
                          >
                            <MdDelete size={20} />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
                {/* Display the add button only if maxFiles not reached */}
                {value.length < maxFiles && (
                  <div
                    className="flex justify-center items-center w-full py-12 border border-dashed  text-slate-600 border-slate-600 cursor-pointer rounded-lg"
                    onClick={handleClick}
                  >
                    <LuImagePlus size={"32px"} />
                    <h2 className="font-poppins font-semibold not-italic text-[16px] text-slate-700 leading-normal ml-2">
                      Add Images
                    </h2>
                  </div>
                )}
              </div>

              {/* Multi-select input element for file upload */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                multiple // Allow multiple file selection
                onChange={(event) => {
                  const files = Array.from(event.target.files);
                  const newImages = files.map((file) => ({
                    file,
                    blobURL: URL.createObjectURL(file),
                  }));

                  // Check if total files exceed maxFiles limit
                  if (value.length + newImages.length <= maxFiles) {
                    onChange([...(value || []), ...newImages]);
                  } else {
                    const remainingSlots = maxFiles - value.length;
                    onChange([
                      ...(value || []),
                      ...newImages.slice(0, remainingSlots),
                    ]);
                  }

                  fileInputRef.current.value = "";
                }}
              />

              <div className="flex flex-col justify-start items-start mt-4">
                {errors[name] && (
                  <span className="text-red-500 text-sm">
                    {errors[name].message}
                  </span>
                )}
              </div>
            </>
          )}
        />
      </div>
    </>
  );
};

export default ImageField;
