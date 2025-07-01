import React, { useCallback, useEffect, useState } from "react";
import Heading from "../../../common/Heading";
import { useForm } from "react-hook-form";
import InputField from "../../../components/fields/InputField";
import { useDispatch } from "react-redux";
import {
  createEmailTemplate,
  createWhatsAppTemplate,
} from "../../../redux/features/marketing";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const EmailTemplate = () => {
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

  // Extract variables like {{1}}, {{2}} etc.
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
    // Validate variable names
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

    // console.log("Final Payload =>", payload);
    dispatch(
      createEmailTemplate(payload, setIsLoading, (success) => {
        if (success) {
          navigate(-1);
        }
      })
    );
    // Place API call here
  };

  return (
    <div className="p-5">
      <Heading text="Create Email Template" showHeading />
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
          {/* <InputField
            type="text"
            control={control}
            errors={errors}
            label="Template ID :"
            name="templateID"
          /> */}
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
          className="bg-slate-600 capitalize  hover:bg-slate-400 px-4 py-3 rounded-md text-white mt-5"
          type="submit"
        >
          Create Template
        </Button>
      </form>
      <div>
        <p className="text-2xl text-center mt-10">Instructions</p>
        <p className="bg-gray-600 text-center text-white text-lg py-2 mt-3 rounded-md">
          To create a Template in this section, there are some pre-set
          requirements that need to be checked.
        </p>
        <div className="grid grid-cols-4 gap-6 pt-5">
          <p className="w-full text-start border-2 border-gray-400 rounded-md bg-gray-100 p-3">
            The variable name should be defined in double curly braces {"{{}}"}{" "}
            and indexing of positive numbers from 1 to your decided number in
            sequence - example : {"{{1}}"} {"{{2}}"}
          </p>
          <p className="w-full text-start border-2 border-gray-400 rounded-md bg-gray-100 p-3">
            The number of added variables should match the number of variables
            created in the template, name should be given to the variables and
            the variables shouldn't contain any special character or different
            way other then Text , underscore , dash
          </p>
          <p className="w-full text-start border-2 border-gray-400 rounded-md bg-gray-100 p-3">
            All the fields Should be filled and not be empty
          </p>
          <p className="w-full text-start border-2 border-gray-400 rounded-md bg-gray-100 p-3">
            Two Values of the variables should be unique
          </p>
        </div>
      </div>

      {/* <div className="text-center">
        <p className="bg-gray-800 text-center text-white text-lg py-2 mt-3 rounded-md">
          Add Inputs for Creating Variable names
        </p>
        <button className="bg-slate-800 hover:bg-slate-400 px-4 py-2 rounded-md text-white mt-3">
          Add Input Field
        </button>
      </div> */}
    </div>
  );
};

export default EmailTemplate;
