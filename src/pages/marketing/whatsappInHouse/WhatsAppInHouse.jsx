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
  deleteChannel,
} from "../../../redux/features/marketing";
import DataTable from "react-data-table-component";
import { waTemplateColumnns } from "../../user/columns";
import { tableCustomStyles } from "../../../constants/tableCustomStyle";
import toast from "react-hot-toast";
import MarketingInHouseLeadFilter from "./MarketingInHouseLeadFilter";
import InhouseSampleMsgModal from "./InhouseSampleMsgModal";
import { useInHouseSampleMessage } from "./useInHouseSampleMessage";
import AddTemplateModal from "./AddTemplateModal";
import { Controller } from "react-hook-form";
import { Select, Option } from "@material-tailwind/react";

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
  const [apiValues, setApiValues] = useState({});

  const { allInhouseTemplates, dropdownVar, availableChannels, record } =
    useSelector((state) => state.marketing);
  const { role } = useSelector((state) => state.auth);

  const defaultValues = {
    template: "",
    channel: "",
    attachment: null,
    starting: "",
    ending: "",
    // variables ke liye bhi default
    // jaise agar max 10 variables ho sakte hain to:
    ...Array.from({ length: 10 }).reduce((acc, _, i) => {
      acc[`variableDropdown_${i}`] = "";
      acc[`variableValue_${i}`] = "";
      return acc;
    }, {}),
  };

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
    setValue,
  } = useForm({ defaultValues });

  const watchAllFields = watch();
  const sampleMessage = useInHouseSampleMessage(
    selectedTemplateData,
    watch,
    apiValues,
    record
  );

  const hasFetchedDropdownData = useRef(false);

  useEffect(() => {
    if (!hasFetchedDropdownData.current) {
      dispatch(getAllWhatsAppInHouseTemplates());
      dispatch(getDropDownFieldsForVariablesInHouse());
      dispatch(
        getAvailableChannels(
          () => {},
          () => {}
        )
      );
      hasFetchedDropdownData.current = true;
    }
  }, [dispatch]);

  const selectedTemplateOption = watch("template");
  useEffect(() => {
    if (selectedTemplateOption) {
      dispatch(
        getWAInHouseTemplateById(selectedTemplateOption, (success, data) => {
          console.log("API success:", success, "data:", data);
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
  const resetForm = () => {
    reset(defaultValues); // reset all form fields
    setValue("attachment", []); // reset file input
    setFilteredLeads([]);
    setShowFilterSection(false); // hide leads table section
    setSelectedTemplateData(null);
    setApiValues({});
    setIsFilterOpen(false);
    setFilterObject({});
  };

  const onSubmitHandler = (data) => {
    console.log("📝 Raw form data from react-hook-form:", data);
    console.log("📦 Selected template data:", selectedTemplateData);
    console.log("🌐 Available channels:", availableChannels);
    console.log("📊 Filtered leads:", filteredLeads);
    console.log("🔹 API values for variables:", apiValues);

    if (!selectedTemplateData) {
      toast.error("Please select a template first.");
      return;
    }

    // ✅ Prepare variables object: use dropdown or manual input
    const variableData = {};
    selectedTemplateData?.template?.variables?.forEach((_, index) => {
      const dropdownValue =
        apiValues[index]?.dropdown || apiValues[index]?.apiValue;
      const manualValue = data[`variableValue_${index}`];
      const finalValue = dropdownValue || manualValue;

      if (finalValue) {
        variableData[`{{${index + 1}}}`] = finalValue;
        console.log(`Variable {{${index + 1}}} ->`, finalValue);
      }
    });

    if (submitAction === "send") {
      if (!data.starting || !data.ending) {
        toast.error("Please specify the range");
        return;
      }

      // ✅ Map filteredLeads to only leadId
      const records = filteredLeads.map((lead) => ({ leadId: lead.leadId }));
      console.log("Records to send:", records);

      // ✅ Get actual channelId
      const selectedChannel = availableChannels?.available?.find(
        (ch) => ch._id === data.channel
      );
      const channelIdToSend = selectedChannel?.channelId || "";
      console.log("Selected channelId to send:", channelIdToSend);

      // ✅ Generate campaign name dynamically if not set
      const campaignNameToSend =
        selectedTemplateData?.campaignName ||
        `${selectedTemplateData?.template?.name || "Inhouse"}_${Date.now()}`;
      console.log("Campaign name to send:", campaignNameToSend);

      // ✅ Template id & name from template object
      const templateIdToSend = selectedTemplateData?.template?._id
        ? [selectedTemplateData.template._id]
        : [];
      const templateNameToSend = selectedTemplateData?.template?.name
        ? [selectedTemplateData.template.name]
        : ["InhouseTemplate"];

      // ✅ Final payload
      const payload = {
        campaignName: campaignNameToSend,
        channelId: channelIdToSend,
        message: selectedTemplateData?.template?.message || "",
        type: "normal",
        templateId: templateIdToSend,
        templateName: templateNameToSend,
        variables: variableData,
        records,
      };
      if (data.attachment && data.attachment[0]) {
        payload.file = data.attachment[0];
      }

      console.log("🚀 Final payload to backend:", payload);

      dispatch(
        whatsAppInHouseTemplateSaveSend(
          payload,
          setSavesendLoading,
          (success) => {
            if (success) {
              resetForm();
            }
          }
        )
      );
    }
  };

  const handleSampleMessageClick = () => {
    setShowSampleModal(true);
  };

  const leadProperties = [
    { label: "Lead ID", value: "leadId" },
    { label: "Status", value: "status" },
    { label: "Operation Status", value: "operationStatus" },
    { label: "Service Category", value: "formData.serviceCategory" },
    { label: "Email ID", value: "formData.emailId" },
    { label: "Mobile Number", value: "formData.mobileNumber" },
    { label: "Applicant Name", value: "formData.nameOfApplicant" },
    { label: "Business Entity Name", value: "formData.nameOfBusinessEntity" },
    { label: "Application Type", value: "formData.applicationType" },
    { label: "Sales Executive", value: "salesExecutive" },
    { label: "Sales Executive Name", value: "salesExecutiveName" },
    { label: "Operation Executive", value: "operationExecutive" },
    { label: "Operation Executive Name", value: "operationExecutiveName" },
    { label: "Sales TL", value: "salesTL" },
    { label: "Operation TL", value: "operationTL" },
    { label: "Date", value: "date" },
    { label: "Completed Date", value: "completedDate" },
    { label: "Total Payments", value: "totalPayments" },
    { label: "Duplicate", value: "duplicate" },
    { label: "Important", value: "important" },
    { label: "No Claim Bucket", value: "noClaimBucket" },
  ];

  const renderSafeMessage = (msg) => {
    if (!msg) return "N/A"; // null or undefined
    if (typeof msg === "string") return msg; // normal string
    if (typeof msg?.message === "string") return msg.message; // { message: "text" }
    try {
      return JSON.stringify(msg, null, 2); // fallback for any object
    } catch {
      return "N/A"; // fallback if circular or invalid object
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
              type="selectwithdelete"
              control={control}
              errors={errors}
              label="Available Channels:"
              name="channel"
              mode="single"
              options={
                Array.isArray(availableChannels?.available)
                  ? availableChannels.available.map((ch) => ({
                      label: `${ch.channelId} (${ch.phone})`,
                      value: ch._id,
                    }))
                  : []
              }
              placeholder="Select a Channel"
              onDeleteOption={(id) =>
                dispatch(
                  deleteChannel({ id }, (success) => {
                    if (success) toast.success("Channel deleted successfully");
                  })
                )
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
            <div>
              <label className="font-medium text-gray-700">Message:</label>
              <p className="border border-gray-300 p-2 mt-1 rounded bg-gray-50 whitespace-pre-wrap min-h-[180px]">
                {renderSafeMessage(selectedTemplateData?.template?.message)}
              </p>
            </div>

            <div>
              <label className="font-medium text-gray-700">
                Sample Message:
              </label>
              <p className="border border-gray-300 p-2 mt-1 rounded bg-gray-50 whitespace-pre-wrap min-h-[180px]">
                {renderSafeMessage(
                  sampleMessage || selectedTemplateData?.template?.message
                )}
              </p>
            </div>

            {/* 🔹 Uploaded File Preview */}
            {watch("attachment") && watch("attachment")[0] && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-600">
                  Attached File:
                </p>
                {watch("attachment")[0].type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(watch("attachment")[0])}
                    alt="preview"
                    className="mt-2 max-h-40 rounded border"
                  />
                ) : (
                  <a
                    href={URL.createObjectURL(watch("attachment")[0])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline mt-2 block"
                  >
                    {watch("attachment")[0].name}
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="mt-5">
            <InputField
              type="file"
              control={control}
              errors={errors}
              label="Upload File / Image:"
              name="attachment"
              accept="image/*,.pdf,.doc,.docx"
            />
          </div>

          {selectedTemplateData?.template?.variables.map((variable, index) => {
            const manualValue = watch(`variableValue_${index}`);
            const dropdownValue = watch(`variableDropdown_${index}`);

            return (
              <div key={index} className="flex gap-3 mb-3 items-center mt-10">
                <div className="font-medium min-w-[150px]">{variable.name}</div>

                {/* 🔹 Dropdown using native HTML select */}
                <Controller
                  name={`variableDropdown_${index}`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <select
                      {...field}
                      className="border p-2 border-black flex-1"
                      disabled={!!manualValue}
                      onChange={async (e) => {
                        const value = e.target.value;
                        field.onChange(value);

                        if (!value) {
                          setApiValues((prev) => ({ ...prev, [index]: {} }));
                          return;
                        }

                        try {
                          const res = await dispatch(
                            getDropDownFieldsForVariablesInHouse({
                              field: value,
                            })
                          );
                          const record = res?.record || {};
                          const valueFromApi = value.includes(".")
                            ? value
                                .split(".")
                                .reduce((acc, key) => acc?.[key] ?? "", record)
                            : record[value] ?? "";

                          setApiValues((prev) => ({
                            ...prev,
                            [index]: {
                              dropdown: value,
                              apiValue: valueFromApi,
                              text: "",
                            },
                          }));
                        } catch (err) {
                          setApiValues((prev) => ({
                            ...prev,
                            [index]: {
                              dropdown: value,
                              apiValue: "",
                              text: "",
                            },
                          }));
                        }
                      }}
                    >
                      <option value="">Select Property</option>
                      {leadProperties.map((prop) => (
                        <option key={prop.value} value={prop.value}>
                          {prop.label}
                        </option>
                      ))}
                    </select>
                  )}
                />

                {/* 🔹 Manual Input */}
                <Controller
                  name={`variableValue_${index}`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter custom value"
                      className="border p-2 border-black flex-1"
                      disabled={!!dropdownValue}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val);

                        setApiValues((prev) => ({
                          ...prev,
                          [index]: { dropdown: "", apiValue: "", text: val },
                        }));
                      }}
                    />
                  )}
                />
              </div>
            );
          })}

          {showFilterSection && (
            <>
              <div className="mt-5 flex justify-between items-center border-t py-5">
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
        selectedTemplate={selectedTemplateData}
        selectedChannel={
          availableChannels?.available?.find(
            (ch) => ch._id === watch("channel")
          ) || null
        }
        sampleMessage={sampleMessage}
        currentFormData={watchAllFields}
        attachment={
          watch("attachment") && watch("attachment")[0]
            ? watch("attachment")[0]
            : null
        }
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
