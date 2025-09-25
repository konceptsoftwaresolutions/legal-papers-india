import React, { useEffect, useState } from "react";
import Heading from "../../../common/Heading";
import { useForm } from "react-hook-form";
import InputField from "../../../components/fields/InputField";

const SMSTemplate = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm();

  const [variableKeys, setVariableKeys] = useState([]);
  const [variableValues, setVariableValues] = useState({});

  const enteredText = watch("templateDescription");

  // Extract variables from templateDescription
  useEffect(() => {
    const matches = enteredText?.match(/\{\$(var\d+)\}/g) || [];
    const uniqueVars = [
      ...new Set(matches.map((match) => match.replace(/[{}]/g, ""))),
    ];
    setVariableKeys(uniqueVars);
  }, [enteredText]);

  const handleVariableChange = (key, value) => {
    setVariableValues((prev) => ({
      ...prev,
      [`$${key}`]: value,
    }));
  };

  const onSubmitHandler = (data) => {
    const payload = {
      templateName: data.templateName,
      message: data.templateDescription,
      type: "sms",
      variables: variableValues,
      verified: true,
      templateId: data.templateID,
    };

    console.log("Payload to send:", payload);
    // Here you can call your API (e.g., axios.post(...))
  };

  return (
    <div className="p-3 md:p-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <Heading text="Create SMS Template" showHeading />
      </div>

      {/* Form Section */}
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 md:p-6 mb-6">
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="space-y-4 md:space-y-6"
        >
          {/* Template Name and ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
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
              label="Template ID :"
              name="templateID"
            />
          </div>

          {/* Template Description */}
          <div className="w-full">
            <InputField
              type="description"
              control={control}
              errors={errors}
              label="Text :"
              name="templateDescription"
              rows={8} // Reduced for mobile, good for desktop
            />
          </div>

          {/* Dynamic Variable Name Inputs */}
          {variableKeys.length > 0 && (
            <div className="bg-gray-50 p-4 md:p-6 rounded-lg border">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-700 text-center md:text-left">
                Define Variable Names:
              </h3>

              {/* Mobile: Single Column */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {variableKeys.map((key) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      {`Name for ${key}`}
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-2.5 md:p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      value={variableValues[`$${key}`] || ""}
                      onChange={(e) =>
                        handleVariableChange(key, e.target.value)
                      }
                      placeholder={`Enter name for ${key}`}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center md:justify-start">
            <button
              className="bg-slate-600 hover:bg-slate-500 px-6 md:px-8 py-2.5 md:py-3 rounded-md text-white font-medium transition-all duration-200 hover:shadow-lg active:scale-95 w-full sm:w-auto"
              type="submit"
            >
              Create Template
            </button>
          </div>
        </form>
      </div>

      {/* Instructions Section */}
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 md:p-6">
        {/* Instructions Header */}
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
            Instructions
          </h2>
          <p className="bg-gray-600 text-white text-sm md:text-lg py-2 md:py-3 px-4 rounded-md">
            To create a Template in this section, there are some pre-set
            requirements that need to be checked.
          </p>
        </div>

        {/* Instructions Grid */}
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 lg:gap-6">
          <div className="w-full text-start border-2 border-gray-300 rounded-md bg-gray-50 p-3 md:p-4 hover:shadow-md transition-shadow duration-200">
            <p className="text-sm md:text-base leading-relaxed">
              The Variable Name should be defined in curly braces {"{}"} with
              variable defined with $var and indexing of positive numbers from 1
              to your decided number in sequence – example : {"{$var1}"}
            </p>
          </div>

          <div className="w-full text-start border-2 border-gray-300 rounded-md bg-gray-50 p-3 md:p-4 hover:shadow-md transition-shadow duration-200">
            <p className="text-sm md:text-base leading-relaxed">
              The Number of added variables numbers should match the number of
              variables created in the template and name should be given to the
              variables - and the variables shouldn't contain any special
              character or different way other than text, underscore, dash.
            </p>
          </div>

          <div className="w-full text-start border-2 border-gray-300 rounded-md bg-gray-50 p-3 md:p-4 hover:shadow-md transition-shadow duration-200">
            <p className="text-sm md:text-base leading-relaxed">
              All the fields should be filled and not be empty.
            </p>
          </div>

          <div className="w-full text-start border-2 border-gray-300 rounded-md bg-gray-50 p-3 md:p-4 hover:shadow-md transition-shadow duration-200">
            <p className="text-sm md:text-base leading-relaxed">
              Two values of the variables should be unique.
            </p>
          </div>
        </div>
      </div>

      {/* Optional: Add Input Section UI (inactive logic-wise) */}
      {/* <div className="text-center mt-6">
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

export default SMSTemplate;
