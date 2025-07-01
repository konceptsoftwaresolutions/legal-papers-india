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
    <div className="p-5">
      <Heading text="SMS" showHeading />
      <div className="p-3 bg-white shadow-lg mt-3 rounded-lg border-gray-600 flex justify-between items-center">
        <p className="text-xl font-semibold">Send Bulk SMS</p>
        <div className="flex justify-end gap-3 items-center">
          <button className="bg-green-600 hover:bg-green-400 px-4 py-2 rounded-md text-white">
            Logs
          </button>
          <button
            className="bg-yellow-600 hover:bg-yellow-400 px-4 py-2 rounded-md text-white"
            onClick={handleTemplateNavigation}
          >
            Create Template
          </button>
          <button className="bg-gray-500 hover:bg-gray-400 px-4 py-2 rounded-md text-white">
            Sample Message
          </button>
        </div>
      </div>

      <div className="mt-5 p-3">
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="grid grid-cols-2 gap-3">
            <InputField
              type="select"
              control={control}
              errors={errors}
              label="Select Template : "
              name="template"
            />
          </div>
          <InputField
            type="description"
            control={control}
            label="Message :"
            errors={errors}
            name="description"
            rows={10}
          />
          <div className="flex gap-3 mt-3">
            <button
              className="bg-slate-600 hover:bg-slate-400 px-4 py-2 rounded-md text-white"
              type="submit"
              onClick={() => setSubmitAction("save")}
            >
              Save
            </button>
            <button
              className="bg-slate-600 hover:bg-slate-400 px-4 py-2 rounded-md text-white"
              type="submit"
              onClick={() => setSubmitAction("send")}
            >
              Save & Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SMS;
