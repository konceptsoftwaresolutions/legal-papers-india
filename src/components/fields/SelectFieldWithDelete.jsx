import React from "react";
import { Controller } from "react-hook-form";
import { Select, Divider } from "antd"; // Import Divider to make dropdown nicer
import "./styles/SelectStyle.css";

const SelectFieldWithDelete = ({
  control,
  errors,
  name,
  options = [],
  placeholder = "",
  className = "",
  label = "",
  labelClass = "",
  parentClass = "",
  disabled = false,
  mode = "multiple",
  defaultValue = undefined,
  onSelectChange = function () {},
  onDeleteOption = function () {}, // NEW PROP for delete option
}) => {
  return (
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
          {label}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <Select
            id={name}
            mode={mode}
            showSearch
            className="border border-black cstm-drop"
            allowClear
            placeholder={placeholder}
            onChange={(selectedValue) => {
              onChange(selectedValue);
              if (onSelectChange) {
                onSelectChange(selectedValue);
              }
            }}
            disabled={disabled}
            value={value ?? defaultValue}
            options={options.map((opt) => ({
              value: opt.value,
              label: (
                <div className="flex items-center justify-between w-full">
                  {/* Label text */}
                  <span className="truncate max-w-[80%]">{opt.label}</span>

                  {/* Delete button */}
                  {label !== "Select A Template" && (
                    <button
                      type="button"
                      className="text-red-500 text-xs hover:underline ml-auto flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Deleting option:", opt.value);
                        onDeleteOption(opt.value);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ),
            }))}
            filterOption={(input, option) =>
              option?.label?.props?.children?.[0]?.props?.children
                ?.toLowerCase?.()
                ?.includes(input.toLowerCase())
            }
          />
        )}
      />
      {errors[name] && <p className="text-red-500">{errors[name]?.message}</p>}
    </div>
  );
};

export default SelectFieldWithDelete;
