import React, { useCallback, useEffect, useState } from "react";
import Heading from "../../../common/Heading";
import { useForm } from "react-hook-form";
import InputField from "../../../components/fields/InputField";
import { useDispatch } from "react-redux";
import { createInHouseWhatsAppTemplate } from "../../../redux/features/marketing"; // 🔁 replace with correct action
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const WhatsAppInHouseTemplate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
    register,
  } = useForm();

  const templateDescription = watch("templateDescription");
  const [variables, setVariables] = useState([]);
  const [variableNames, setVariableNames] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const matches = templateDescription?.match(/\{\{(\d+)\}\}/g) || [];
    const uniqueVars = [...new Set(matches.map((m) => m.match(/\d+/)[0]))];
    setVariables(uniqueVars);
  }, [templateDescription]);

  const handleVariableNameChange = (index, value) => {
    setVariableNames((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const onSubmitHandler = (data) => {
    const missingVars = variables.filter((v) => !variableNames[v]?.trim());
    if (missingVars.length) {
      alert(
        `Please provide names for all variables: ${missingVars.join(", ")}`
      );
      return;
    }

    const payload = {
      name: data.templateName,
      message: data.templateDescription,
      variables: variableNames,
      campaignName: data.campaignName,
    };

    dispatch(
      createInHouseWhatsAppTemplate(payload, setIsLoading, (success) => {
        if (success) navigate(-1);
      })
    );
  };

  return (
    <div className="p-5">
      <Heading text="Create WhatsApp In-House Template" showHeading />
      <form onSubmit={handleSubmit(onSubmitHandler)} className="mt-3">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <InputField
            type="text"
            control={control}
            errors={errors}
            label="Template Name :"
            name="templateName"
          />
          <InputField
            type="text"
            control={control}
            errors={errors}
            label="Campaign Name:"
            name="campaignName"
          />
        </div>

        <InputField
          type="description"
          control={control}
          errors={errors}
          label="Text :"
          name="templateDescription"
          rows={10}
        />

        {variables.length > 0 && (
          <div className="mt-6">
            <p className="text-xl font-medium mb-2">Define Variable Names</p>
            <div className="grid grid-cols-2 gap-4">
              {variables.map((v) => (
                <div key={v}>
                  <label className="block font-medium mb-1">
                    Variable name for <code>{`{{${v}}}`}</code>
                  </label>
                  <input
                    type="text"
                    placeholder={`e.g. firstName`}
                    className="w-full border border-gray-300 rounded p-2"
                    onChange={(e) =>
                      handleVariableNameChange(v, e.target.value)
                    }
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          loading={isLoading}
          className="bg-slate-600 capitalize hover:bg-slate-400 px-4 py-3 rounded-md text-white mt-5"
          type="submit"
        >
          Create In-House Template
        </Button>
      </form>

      <div>
        <p className="text-2xl text-center mt-10">Instructions</p>
        <p className="bg-gray-600 text-center text-white text-lg py-2 mt-3 rounded-md">
          To create a Template in this section, there are some pre-set
          requirements that need to be checked.
        </p>
        <div className="grid grid-cols-4 gap-6 pt-5">
          <p className="text-start border-2 border-gray-400 rounded-md bg-gray-100 p-3">
            Use double curly braces {"{{}}"} with index numbers starting from 1,
            e.g., {"{{1}}"} {"{{2}}"}
          </p>
          <p className="text-start border-2 border-gray-400 rounded-md bg-gray-100 p-3">
            Match total number of variables and assign unique, valid names to
            each
          </p>
          <p className="text-start border-2 border-gray-400 rounded-md bg-gray-100 p-3">
            All fields must be filled
          </p>
          <p className="text-start border-2 border-gray-400 rounded-md bg-gray-100 p-3">
            Variable names should be unique and must not contain special
            characters
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppInHouseTemplate;
