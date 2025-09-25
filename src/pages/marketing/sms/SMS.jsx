import React, { useRef, useState } from "react";
import Heading from "../../../common/Heading";
import { useForm } from "react-hook-form";
import InputField from "../../../components/fields/InputField";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const SMS = () => {
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const [submitAction, setSubmitAction] = useState("save"); // 'save' or 'send'

  const onSubmitHandler = (data) => {
    if (submitAction === "save") {
      console.log("Saving data:", data);
    } else if (submitAction === "send") {
      console.log("Saving and Sending data:", data);
    }
  };

  const handleTemplateNavigation = () => {
    navigate(`/${role}/smstemplate`);
  };

  return (
    <div className="p-3 md:p-5">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <Heading text="SMS" showHeading />
      </div>

      {/* Action Bar */}
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-3 md:p-4 mb-5">
        {/* Mobile Layout */}
        <div className="block md:hidden space-y-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 text-center">
            Send Bulk SMS
          </h2>

          <div className="grid grid-cols-1 gap-2">
            <button className="bg-green-600 hover:bg-green-500 px-4 py-2.5 rounded-md text-white font-medium transition-all duration-200 hover:shadow-md">
              Logs
            </button>
            <button
              className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2.5 rounded-md text-white font-medium transition-all duration-200 hover:shadow-md"
              onClick={handleTemplateNavigation}
            >
              Create Template
            </button>
            <button className="bg-gray-500 hover:bg-gray-400 px-4 py-2.5 rounded-md text-white font-medium transition-all duration-200 hover:shadow-md">
              Sample Message
            </button>
          </div>
        </div>

        {/* Tablet Layout */}
        <div className="hidden md:block lg:hidden">
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 text-center">
              Send Bulk SMS
            </h2>

            <div className="flex justify-center gap-2">
              <button className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md text-white font-medium transition-all duration-200 hover:shadow-md flex-1 max-w-[150px]">
                Logs
              </button>
              <button
                className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded-md text-white font-medium transition-all duration-200 hover:shadow-md flex-1 max-w-[150px]"
                onClick={handleTemplateNavigation}
              >
                Create Template
              </button>
              <button className="bg-gray-500 hover:bg-gray-400 px-4 py-2 rounded-md text-white font-medium transition-all duration-200 hover:shadow-md flex-1 max-w-[150px]">
                Sample Message
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex lg:justify-between lg:items-center">
          <h2 className="text-xl font-semibold text-gray-800">Send Bulk SMS</h2>

          <div className="flex gap-3 items-center">
            <button className="bg-green-600 hover:bg-green-400 px-4 py-2 rounded-md text-white font-medium transition-all duration-200 hover:shadow-md">
              Logs
            </button>
            <button
              className="bg-yellow-600 hover:bg-yellow-400 px-4 py-2 rounded-md text-white font-medium transition-all duration-200 hover:shadow-md"
              onClick={handleTemplateNavigation}
            >
              Create Template
            </button>
            <button className="bg-gray-500 hover:bg-gray-400 px-4 py-2 rounded-md text-white font-medium transition-all duration-200 hover:shadow-md">
              Sample Message
            </button>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-3 md:p-5">
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="space-y-4 md:space-y-6"
        >
          {/* Template Selection */}
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <InputField
                type="select"
                control={control}
                errors={errors}
                label="Select Template : "
                name="template"
              />
            </div>
          </div>

          {/* Message Field */}
          <div className="w-full">
            <InputField
              type="description"
              control={control}
              label="Message :"
              errors={errors}
              name="description"
              rows={8} // Reduced for mobile, can be adjusted
            />
          </div>

          {/* Action Buttons */}
          <div className="w-full">
            {/* Mobile Buttons */}
            <div className="block md:hidden space-y-3">
              <button
                className="w-full bg-slate-600 hover:bg-slate-500 px-4 py-3 rounded-md text-white font-medium transition-all duration-200 hover:shadow-md active:scale-95"
                type="submit"
                onClick={() => setSubmitAction("save")}
              >
                Save
              </button>
              <button
                className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-3 rounded-md text-white font-medium transition-all duration-200 hover:shadow-md active:scale-95"
                type="submit"
                onClick={() => setSubmitAction("send")}
              >
                Save & Send
              </button>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex gap-3">
              <button
                className="bg-slate-600 hover:bg-slate-500 px-6 py-2.5 rounded-md text-white font-medium transition-all duration-200 hover:shadow-md active:scale-95"
                type="submit"
                onClick={() => setSubmitAction("save")}
              >
                Save
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-md text-white font-medium transition-all duration-200 hover:shadow-md active:scale-95"
                type="submit"
                onClick={() => setSubmitAction("send")}
              >
                Save & Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SMS;
