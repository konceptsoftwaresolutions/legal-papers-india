import React, { useEffect, useRef, useState } from "react";
import Heading from "../../../common/Heading";
import { useForm } from "react-hook-form";
import InputField from "../../../components/fields/InputField";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineSwap } from "react-icons/ai";

import {
  deleteEmailtemplate,
  emailTemplateSaveSend,
  getAllEmailTemplates,
  getDropDownFieldsForEmailVariables,
  getEmailTemplateById,
} from "../../../redux/features/marketing";
import MarketingLeadFilter from "../whatsapp/MarketingLeadFilter";

import { useSampleMessage } from "./useSampleMessage";
import DataTable from "react-data-table-component";
import { waTemplateColumnns } from "../../user/columns";
import { tableCustomStyles } from "../../../constants/tableCustomStyle";
import toast from "react-hot-toast";
import SampleEmailModal from "./SampleEmailModal";

const Whatsapp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedTemplateData, setSelectedTemplateData] = useState();
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [submitAction, setSubmitAction] = useState("save");
  const [showFilterSection, setShowFilterSection] = useState(false);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [savesendLoading, setSavesendLoading] = useState(false);
  const [filterObject, setFilterObject] = useState();

  const { allEmailTemplates, dropdownEmailVar } = useSelector(
    (state) => state.marketing
  );
  const { role } = useSelector((state) => state.auth);

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm();

  const watchAllFields = watch();

  const sampleMessage = useSampleMessage(selectedTemplateData, watch, dispatch);

  // ✅ Guard to prevent repeated API calls in StrictMode/dev
  const hasFetchedDropdownData = useRef(false);

  useEffect(() => {
    if (!hasFetchedDropdownData.current) {
      dispatch(getAllEmailTemplates());
      dispatch(getDropDownFieldsForEmailVariables());
      hasFetchedDropdownData.current = true;
    }
  }, [dispatch]);

  const selectedTemplateOption = watch("template");
  useEffect(() => {
    if (selectedTemplateOption) {
      dispatch(
        getEmailTemplateById(selectedTemplateOption, (success, data) => {
          if (success) setSelectedTemplateData(data);
        })
      );
    }
  }, [selectedTemplateOption, dispatch]);

  const handleDeleteOption = (id) => {
    dispatch(
      deleteEmailtemplate(id, (success) => {
        if (success) {
          dispatch(getAllEmailTemplates());
        }
      })
    );
  };

  // const handleTemplateNavigation = (id) => {
  //   navigate(`/${role}/editlead`, { state: { leadId: id } });
  // };

  const handleCreateTemplate = () => {
    navigate(`/${role}/emailtemplate`);
  };

  const handleTemplateNavigation = (row) => {
    const url = `/${role}/editlead?leadId=${row.leadId}`;
    window.open(url, "_blank");
  };

  const extractLeadIds = (data) => {
    return data.map((item) => item.leadId);
  };

  const onSubmitHandler = (data) => {
    console.log(data);

    const variableData = {};

    Object.entries(data).forEach(([key, value]) => {
      // Check if the key starts with 'variableDropdown_' or 'variableValue_'
      if (key.startsWith("variableDropdown_")) {
        const index = parseInt(key.replace("variableDropdown_", "")); // Get the index number

        // Increment the index to start from 1
        const adjustedIndex = index + 1;

        // Use 'variableDropdown' first, or fallback to 'variableValue'
        const dropdownKey = `variableDropdown_${index}`;
        const valueKey = `variableValue_${index}`;

        if (data[dropdownKey]) {
          variableData[adjustedIndex] = data[dropdownKey];
        } else if (data[valueKey]) {
          variableData[adjustedIndex] = data[valueKey];
        }
      }
    });

    if (submitAction === "save") {
      // console.log("Saving data:", data);
    } else if (submitAction === "send") {
      if (!data.starting || !data.ending) {
        toast.error("Please Specifiy the range");
        return;
      }
      const payload = {
        campaignName: selectedTemplateData?.campaignName,
        variables: variableData,
        leadIds: extractLeadIds(filteredLeads),
        filterObject: filterObject,
        starting: data.starting,
        ending: data.ending,
      };
      // console.log("Saving and Sending data:", payload);
      dispatch(
        emailTemplateSaveSend(payload, setSavesendLoading, (success) => {
          if (success) {
            reset();
            reset({
              leadId: "",
            });
            setFilteredLeads(null);
            setShowFilterSection(false);
            setSelectedTemplateData(null);
          }
        })
      );
    }
  };

  const hanldeIDClick = (row) => {
    const link = `/${role}/editLead`;
    navigate(link, { state: { leadData: row, prevPage: "marketing" } });
  };

  const handleSampleMessageClick = () => {
    if (!watch("leadId")) {
      toast.error("Enter the lead id first");
    } else {
      setShowSampleModal(true);
    }
  };

  return (
    <div className="p-5">
      <Heading text="Email" showHeading />

      <div className="p-3 bg-white shadow-lg mt-3 rounded-lg border-gray-600 flex justify-between items-center flex-col md:flex-row gap-y-2 md:gap-y-0">
        <p className="text-xl font-semibold">Send Bulk Email</p>
        <div className="flex justify-end gap-3 items-center">
          <button
            className="bg-yellow-600 hover:bg-yellow-400 px-2 md:px-4 py-2 text-sm md:text-base rounded-md text-white"
            onClick={handleCreateTemplate}
          >
            Create Template
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-400 px-2 md:px-4 py-2 text-sm md:text-base rounded-md text-white"
            onClick={handleSampleMessageClick}
          >
            Sample Email
          </button>
        </div>
      </div>

      <div className="mt-5 p-3">
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="grid grid-cols-2 gap-3">
            <InputField
              type="selectwithdelete"
              control={control}
              errors={errors}
              label="Select Template : "
              name="template"
              mode="single"
              options={allEmailTemplates || []}
              placeholder="Select A Template"
              onDeleteOption={handleDeleteOption}
            />
            <InputField
              type="text"
              control={control}
              errors={errors}
              label="Lead ID : "
              name="leadId"
              placeholder="Enter lead id"
            />
          </div>

          <InputField
            type="text"
            control={control}
            errors={errors}
            label="Subject : "
            name="subject"
            placeholder="Enter your subject"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
            <div>
              <label className="mb-1 text-gray-700 font-medium">Email :</label>
              <p className="border border-gray-300 p-2 mt-1 rounded min-h-[180px] bg-gray-50 whitespace-pre-wrap">
                {selectedTemplateData?.message}
              </p>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">
                Sample Email :
              </label>
              <div className="border border-gray-300 p-2 rounded min-h-[180px] bg-gray-50 whitespace-pre-wrap">
                {selectedTemplateData?.message ? sampleMessage : null}
              </div>
            </div>
          </div>

          {/* Variable Input Fields */}
          {selectedTemplateData?.variables?.length > 0 && (
            <div className="mt-5">
              <p className="text-lg font-semibold mb-3">Fill Variables:</p>
              <div className="flex flex-col gap-3">
                {selectedTemplateData.variables.map((variable, index) => {
                  const dropdownValue = watch(`variableDropdown_${index}`);
                  const textValue = watch(`variableValue_${index}`);
                  const isDropdownDisabled = !!textValue;
                  const isTextDisabled = !!dropdownValue;

                  return (
                    <div
                      key={variable._id}
                      className="flex w-full items-center mb-3 gap-3"
                    >
                      <div className="font-medium text-gray-700 max-w-[250px] min-w-max">
                        {variable.name}
                      </div>

                      <div className="w-full">
                        <InputField
                          type="option"
                          control={control}
                          errors={errors}
                          name={`variableDropdown_${index}`}
                          options={[
                            { label: "Select", value: "" },
                            ...dropdownEmailVar,
                          ]}
                          placeholder="Select"
                          disabled={isDropdownDisabled}
                        />
                      </div>

                      <div className="pt-2">
                        <AiOutlineSwap size={28} />
                      </div>

                      <div className="w-full pt-2">
                        <InputField
                          type="text"
                          control={control}
                          errors={errors}
                          name={`variableValue_${index}`}
                          placeholder="Enter value"
                          disabled={isTextDisabled}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {showFilterSection && (
            <>
              <div className="mt-5 flex justify-between items-center border-t pt-5">
                <p className="text-md font-semibold">Filter the leads first</p>
                <button
                  type="button"
                  className="bg-orange-600 p-2 text-white rounded-md"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  Filter Leads
                </button>
              </div>
              {leadsLoading ? (
                <p>Loading ...</p>
              ) : filteredLeads && filteredLeads.length > 0 ? (
                <div className="grid gap-3 mt-4">
                  <DataTable
                    columns={waTemplateColumnns}
                    data={filteredLeads}
                    noDataComponent={
                      <p className="text-center text-gray-500 text-lg p-3">
                        No data to be displayed...
                      </p>
                    }
                    customStyles={tableCustomStyles}
                    pagination
                    paginationPerPage={8}
                    onRowClicked={handleTemplateNavigation}
                  />
                  <p>Specify Range</p>
                  <div className="grid grid-cols-2 gap-2">
                    <InputField
                      control={control}
                      errors={errors}
                      label="Starting"
                      type="number"
                      name="starting"
                    />
                    <InputField
                      control={control}
                      errors={errors}
                      label="Ending"
                      type="number"
                      name="ending"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-center">No lead found ...</p>
              )}
            </>
          )}

          <div className="flex gap-3 mt-5">
            <button
              className="bg-slate-600 hover:bg-slate-400 px-4 py-2 rounded-md text-white"
              type="submit"
              onClick={() => setSubmitAction("save")}
            >
              Save
            </button>
            {!showFilterSection && (
              <button
                className="bg-slate-600 hover:bg-slate-400 px-4 py-2 rounded-md text-white"
                type="submit"
                onClick={() => setShowFilterSection(true)}
              >
                Save & Send
              </button>
            )}
            {showFilterSection && (
              <button
                className="bg-slate-600 hover:bg-slate-400 px-4 py-2 rounded-md text-white"
                type="submit"
                onClick={() => setSubmitAction("send")}
              >
                {savesendLoading ? "Sending ..." : "Save & Send"}
              </button>
            )}
          </div>
        </form>
      </div>

      <SampleEmailModal
        open={showSampleModal}
        setOpen={setShowSampleModal}
        currentFormData={watchAllFields}
        selectedTemplateData={selectedTemplateData}
      />

      <MarketingLeadFilter
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
        onFilterSubmit={() => {}}
        setFilteredLeads={setFilteredLeads}
        setLeadsLoading={setLeadsLoading}
        setFilterObject={setFilterObject}
        type="email"
      />
    </div>
  );
};

export default Whatsapp;
