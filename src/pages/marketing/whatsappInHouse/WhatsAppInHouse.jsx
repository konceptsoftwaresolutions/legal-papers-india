import React, { useEffect, useRef, useState } from "react";
import Heading from "../../../common/Heading";
import { useForm } from "react-hook-form";
import InputField from "../../../components/fields/InputField";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineSwap } from "react-icons/ai";
import {
  getAllWhatsAppInHouseTemplates,
  getDropDownFieldsForVariablesInHouse,
  getWAInHouseTemplateById,
  deleteWAInHouseTemplate,
  whatsAppInHouseTemplateSaveSend,
  getAvailableChannels,
} from "../../../redux/features/marketing";
import DataTable from "react-data-table-component";
import { waTemplateColumnns } from "../../user/columns";
import { tableCustomStyles } from "../../../constants/tableCustomStyle";
import toast from "react-hot-toast";
import MarketingInHouseLeadFilter from "./MarketingInHouseLeadFilter";
import InhouseSampleMsgModal from "./InhouseSampleMsgModal";
import { useInHouseSampleMessage } from "./useInHouseSampleMessage";
import AddTemplateModal from "./AddTemplateModal";

const WhatsappInhouse = () => {
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
  const [showAddChannelModal, setShowAddChannelModal] = useState(false);

  const { allInhouseTemplates, dropdownVar, availableChannels } = useSelector(
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
  const sampleMessage = useInHouseSampleMessage(
    selectedTemplateData,
    watch,
    dispatch
  );

  const hasFetchedDropdownData = useRef(false);

  useEffect(() => {
    if (!hasFetchedDropdownData.current) {
      dispatch(getAllWhatsAppInHouseTemplates());
      dispatch(getDropDownFieldsForVariablesInHouse());
      dispatch(getAvailableChannels(() => {}, () => {}));
      hasFetchedDropdownData.current = true;
    }
  }, [dispatch]);

  const selectedTemplateOption = watch("template");
  useEffect(() => {
    if (selectedTemplateOption) {
      dispatch(
        getWAInHouseTemplateById(selectedTemplateOption, (success, data) => {
          if (success) setSelectedTemplateData(data);
        })
      );
    }
  }, [selectedTemplateOption, dispatch]);

  const handleDeleteOption = (id) => {
    dispatch(
      deleteWAInHouseTemplate(id, (success) => {
        if (success) {
          dispatch(getAllWhatsAppInHouseTemplates());
        }
      })
    );
  };

  const handleCreateTemplate = () => {
    navigate(`/${role}/whatsappinhousetemplate`);
  };

  const handleTemplateNavigation = (row) => {
    const url = `/${role}/editlead?leadId=${row.leadId}`;
    window.open(url, "_blank");
  };

  const extractLeadIds = (data) => data.map((item) => item.leadId);

  const onSubmitHandler = (data) => {
    const variableData = {};

    selectedTemplateData?.variables?.forEach((_, index) => {
      const val1 = data[`variableDropdownA_${index}`];
      const val2 = data[`variableDropdownB_${index}`];
      const val3 = data[`variableValue_${index}`];

      const finalValue = val1 || val2 || val3;
      if (finalValue) variableData[index + 1] = finalValue;
    });

    if (submitAction === "send") {
      if (!data.starting || !data.ending) {
        toast.error("Please specify the range");
        return;
      }
      const payload = {
        campaignName: selectedTemplateData?.campaignName,
        variables: variableData,
        leadIds: extractLeadIds(filteredLeads),
        filterObject,
        starting: data.starting,
        ending: data.ending,
      };
      dispatch(
        whatsAppInHouseTemplateSaveSend(
          payload,
          setSavesendLoading,
          (success) => {
            if (success) {
              reset();
              reset({ leadId: "" });
              setFilteredLeads([]);
              setShowFilterSection(false);
              setSelectedTemplateData(null);
            }
          }
        )
      );
    }
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
      <Heading text="WhatsApp Inhouse" showHeading />

      <div className="p-3 bg-white shadow-lg mt-3 rounded-lg border-gray-600 flex justify-between items-center flex-col md:flex-row gap-y-2 md:gap-y-0">
        <p className="text-xl font-semibold">Send WhatsApp Inhouse</p>
        <div className="flex gap-3 flex-wrap">
          <button
            className="bg-green-600 hover:bg-green-500 px-4 py-2 text-white rounded-md"
            onClick={() => setShowAddChannelModal(true)}
          >
            Add Channel
          </button>
          <button
            className="bg-yellow-600 hover:bg-yellow-400 px-4 py-2 text-white rounded-md"
            onClick={handleCreateTemplate}
          >
            Create Template
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-400 px-4 py-2 text-white rounded-md"
            onClick={handleSampleMessageClick}
          >
            Sample Message
          </button>
        </div>
      </div>

      <div className="mt-5 p-3">
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="grid grid-cols-2 gap-3">
            {/* Select Template */}
            <InputField
              type="selectwithdelete"
              control={control}
              errors={errors}
              label="Select Template:"
              name="template"
              mode="single"
              options={allInhouseTemplates || []}
              placeholder="Select a Template"
              onDeleteOption={handleDeleteOption}
            />

            {/* 🔹 New Available Channels Dropdown */}
            <InputField
              type="option"
              control={control}
              errors={errors}
              label="Available Channels:"
              name="channel"
              mode="single"
              options={[
                { label: "Select Channel", value: "" },
                ...(availableChannels || []).map((ch) => ({
                  label: ch.name,
                  value: ch.id,
                })),
              ]}
            />

            <InputField
              type="text"
              control={control}
              errors={errors}
              label="Lead ID:"
              name="leadId"
              placeholder="Enter Lead ID"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
            <div>
              <label className="font-medium text-gray-700">Message:</label>
              <p className="border border-gray-300 p-2 mt-1 rounded bg-gray-50 whitespace-pre-wrap min-h-[180px]">
                {selectedTemplateData?.message}
              </p>
            </div>
            <div>
              <label className="font-medium text-gray-700">
                Sample Message:
              </label>
              <p className="border border-gray-300 p-2 mt-1 rounded bg-gray-50 whitespace-pre-wrap min-h-[180px]">
                {selectedTemplateData?.message ? sampleMessage : null}
              </p>
            </div>
          </div>

          {selectedTemplateData?.variables?.length > 0 && (
            <div className="mt-5">
              <p className="text-lg font-semibold mb-3">Fill Variables:</p>
              {selectedTemplateData.variables.map((variable, index) => {
                const a = watch(`variableDropdownA_${index}`);
                const b = watch(`variableDropdownB_${index}`);
                const val = watch(`variableValue_${index}`);

                return (
                  <div key={index} className="flex gap-3 mb-3 items-center">
                    <div className="font-medium min-w-[150px]">
                      {variable.name}
                    </div>
                    <InputField
                      type="option"
                      control={control}
                      errors={errors}
                      name={`variableDropdownA_${index}`}
                      options={[
                        { label: "Select A", value: "" },
                        ...dropdownVar,
                      ]}
                      disabled={b || val}
                    />
                    <AiOutlineSwap size={24} />
                    <InputField
                      type="option"
                      control={control}
                      errors={errors}
                      name={`variableDropdownB_${index}`}
                      options={[
                        { label: "Select B", value: "" },
                        ...dropdownVar,
                      ]}
                      disabled={a || val}
                    />
                    <InputField
                      type="text"
                      control={control}
                      errors={errors}
                      name={`variableValue_${index}`}
                      placeholder="Text Value"
                      disabled={a || b}
                    />
                  </div>
                );
              })}
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
                <p>Loading...</p>
              ) : filteredLeads.length > 0 ? (
                <>
                  <DataTable
                    columns={waTemplateColumnns}
                    data={filteredLeads}
                    customStyles={tableCustomStyles}
                    pagination
                    paginationPerPage={8}
                    onRowClicked={handleTemplateNavigation}
                  />
                  <div className="grid grid-cols-2 gap-2 mt-3">
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
                </>
              ) : (
                <p className="text-center mt-3">No leads found...</p>
              )}
            </>
          )}

          <div className="flex gap-3 mt-5">
            <button
              className="bg-slate-600 hover:bg-slate-400 px-4 py-2 text-white rounded-md"
              type="submit"
              onClick={() => setSubmitAction("save")}
            >
              Save
            </button>
            {!showFilterSection && (
              <button
                className="bg-slate-600 hover:bg-slate-400 px-4 py-2 text-white rounded-md"
                type="submit"
                onClick={() => setShowFilterSection(true)}
              >
                Save & Send
              </button>
            )}
            {showFilterSection && (
              <button
                className="bg-slate-600 hover:bg-slate-400 px-4 py-2 text-white rounded-md"
                type="submit"
                onClick={() => setSubmitAction("send")}
              >
                {savesendLoading ? "Sending..." : "Save & Send"}
              </button>
            )}
          </div>
        </form>
      </div>

      <InhouseSampleMsgModal
        open={showSampleModal}
        setOpen={setShowSampleModal}
        currentFormData={watchAllFields}
        selectedTemplateData={selectedTemplateData}
      />

      <MarketingInHouseLeadFilter
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
        onFilterSubmit={() => {}}
        setFilteredLeads={setFilteredLeads}
        setLeadsLoading={setLeadsLoading}
        setFilterObject={setFilterObject}
        type="whatsapp-inhouse"
      />
      <AddTemplateModal
        open={showAddChannelModal}
        setOpen={setShowAddChannelModal}
      />
    </div>
  );
};

export default WhatsappInhouse;
