import React, { useState } from "react";
import { Drawer, Button } from "antd";
import TouchableOpacity from "../buttons/TouchableOpacity";
import { RxCross2 } from "react-icons/rx";
import MyButton from "../buttons/MyButton";

const Filters = ({
  isOpen = false,
  setIsOpen = () => {},
  title = "",
  className = "",
  children,
  resetShow = true,
  onFilterCancel,
  onSubmit,
  onReset = () => {},
}) => {
  // functions
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <Drawer
      // title="Filters"
      placement="right"
      onClose={handleClose}
      open={isOpen}
      closable={false}
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <div className="py-4 px-3">
        <div className="w-full flex justify-between items-center border-b-2 pb-2">
          <h2 className="font-poppins not-italic leading-normal text-[17px] font-bold">
            {title}
          </h2>
          <TouchableOpacity className="text-black" onClick={handleClose}>
            <RxCross2 size={18} className="text-black" />
          </TouchableOpacity>
        </div>

        <div className={`py-3 ${className}`}>{children}</div>

        {/* <div className="w-full flex justify-end items-center py-3 gap-x-2 sticky bottom-0 border-t-4 bg-white">
          <MyButton
            className="bg-gray-300 shadow-none hover:shadow-none py-2 px-4 text-black text-[14px]"
            onClick={handleClose}
          >
            Cancel
          </MyButton>
          {resetShow ? (
            <MyButton
              className="bg-green-700 py-2 px-4 text-[14px]"
              onClick={handleReset}
            >
              Reset
            </MyButton>
          ) : null}
          <MyButton
            className="main-bg py-2 px-4 text-[14px]"
            onClick={onSubmit}
          >
            Apply
          </MyButton>
        </div> */}
      </div>
    </Drawer>
  );
};

export default Filters;
