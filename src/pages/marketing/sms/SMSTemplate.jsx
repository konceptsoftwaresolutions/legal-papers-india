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
    <div className="p-5">
      <div>
        <Heading text="Create SMS Template" showHeading />
      </div>
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
            label="Template ID :"
            name="templateID"
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

        {/* Dynamically Render Variable Name Inputs */}
        {variableKeys.length > 0 && (
          <div className="mt-6">
            <p className="text-xl font-semibold mb-2 text-black-700">
              Define Variable Names:
            </p>
            <div className="grid grid-cols-2 gap-4">
              {variableKeys.map((key) => (
                <div key={key}>
                  <label className="block mb-1 text-sm font-medium text-black-600">
                    {`Name for ${key}`}
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-2 rounded"
                    value={variableValues[`$${key}`] || ""}
                    onChange={(e) => handleVariableChange(key, e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          className="bg-slate-600 hover:bg-slate-400 px-4 py-2 rounded-md text-white mt-6"
          type="submit"
        >
          Create Template
        </button>
      </form>

      {/* Instructions Section */}
      <div>
        <p className="text-2xl text-center mt-10">Instructions</p>
        <p className="bg-gray-600 text-center text-white text-lg py-2 mt-3 rounded-md">
          To create a Template in this section, there are some pre-set
          requirements that need to be checked.
        </p>
        <div className="grid grid-cols-4 gap-6 pt-5">
          <p className="w-full text-start border-2 border-gray-400 rounded-md bg-gray-100 p-3">
            The Variable Name should be defined in curly braces {"{}"} with
            variable defined with $var and indexing of positive numbers from 1
            to your decided number in sequence – example : {"{$var1}"}
          </p>
          <p className="w-full text-start border-2 border-gray-400 rounded-md bg-gray-100 p-3">
            The Number of added variables numbers should match the number of
            variables created in the template and name should be given to the
            variables - and the variables shouldn't contain any special
            character or different way other than text, underscore, dash.
          </p>
          <p className="w-full text-start border-2 border-gray-400 rounded-md bg-gray-100 p-3">
            All the fields should be filled and not be empty.
          </p>
          <p className="w-full text-start border-2 border-gray-400 rounded-md bg-gray-100 p-3">
            Two values of the variables should be unique.
          </p>
        </div>
      </div>

      {/* Optional: Add Input Section UI (inactive logic-wise) */}
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

export default SMSTemplate;
