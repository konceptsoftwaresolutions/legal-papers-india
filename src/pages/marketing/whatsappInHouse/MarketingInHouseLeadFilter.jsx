import React, { useEffect, useRef, useState } from "react";
import Filters from "../../../components/sliders/Filters";
import { useForm } from "react-hook-form";
import InputField from "../../../components/fields/InputField";
import { useDispatch, useSelector } from "react-redux";
import {
  applicationTypeOptions,
  filterOptions,
  freshOrFollowStatusOptions,
  operationsStatusOption,
  paymentModeOptions,
  salesStatusOptions,
  serviceCategoryOption,
} from "../../../constants/options";

import usePath from "../../../hooks/usePath";
import MyButton from "../../../components/buttons/MyButton";
import { getAllLeads } from "../../../redux/features/leads";
import { useLocation } from "react-router-dom";
import {
  getAllEmailFilteredLeadIDs,
  getAllFilteredLeadIDs,
} from "../../../redux/features/marketing";

const MarketingInHouseLeadFilter = ({
  isOpen = false,
  setIsOpen = () => {},
  onFilterSubmit,
  endPoint,
  serviceCategory,
  status,
  setFilteredLeads,
  setLeadsLoading,
  setFilterObject,
  type,
}) => {
  const dispatch = useDispatch();

  const formRef = useRef(null);
  const { profileBaseUser } = useSelector((state) => state.user);
  const path = usePath();

  const [importantState, setImportantState] = useState(false);
  const [refundState, setRefundState] = useState(false);
  const [mannualLeadState, setMannualLeadState] = useState(false);
  const [iecLeadState, setIECLeadState] = useState(false);
  const [excludeLeadState, setExcludeLeadState] = useState(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      leadId: "",
      user: null,
      status: null,
      operationStatus: null,
      leadSource: null,
      serviceCategory: null,
      freshOrFollow: null,
      emailId: "",
      date: null,
      fromDate: "",
      toDate: "",
      paymentDate: "",
      paymentFromDate: "",
      paymentToDate: "",
      mobileNumber: "",
    },
  });

  useEffect(() => {
    let filter = path.searchQuary?.[0]?.filter;
    if (filter) {
      filter = JSON.parse(filter);
      Object.keys(filter).forEach((key) => {
        setValue(key, filter[key]);
      });
    }
  }, [path.location]);

  const profileData = profileBaseUser?.map((item) => ({
    label: item.nameWithProfile,
    value: item.name,
  }));

  const leadSourceOptions = [
    {
      value: "fssairegistrationportal.org",
      label: "fssairegistrationportal.org",
    },
    {
      value: "fssairegistration-portal.org",
      label: "fssairegistration-portal.org",
    },
    { value: "ieccode-portal.org", label: "ieccode-portal.org" },
    { value: "ieccode-india.org", label: "ieccode-india.org" },
    { value: "iecode-india.org", label: "iecode-india.org" },
    {
      value: "fssai-registrationportal.org",
      label: "fssai-registrationportal.org",
    },
    { value: "fssailicenseportal.org", label: "fssailicenseportal.org" },
    { value: "website", label: "Website" },
    { value: "meta", label: "Meta" },
    { value: "legalpapersindia.com", label: "legalpapersindia.com" },
    {
      value: "fssaicertificateportal.org",
      label: "fssaicertificateportal.org",
    },
    { value: "selfGeneratedLead", label: "Self Generated Lead" },
  ];

  const onReset = () => {
    reset();
    setImportantState(false);
    setRefundState(false);
    setMannualLeadState(false);
    setIECLeadState(false);
    setExcludeLeadState(false);
    setFilteredLeads([]); // Clear parent data
    setFilterObject({}); // Clear filter object in parent
    setIsOpen(false);
  };

  const onSubmit = (formData) => {
    // console.log("data submitted", formData);
    const data = {
      ...formData,
      important: importantState,
      refund: refundState,
      manualRenewalLead: mannualLeadState,
      iecRenewalLead: iecLeadState,
      excludeIecRenewalLead: excludeLeadState,
    };
    const filterObject = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== "" && value !== null
      )
    );
    setFilterObject(filterObject);
    sessionStorage.setItem("whatsappFilters", JSON.stringify(filterObject));
    if (type === "whatsapp-inhouse") {
      dispatch(
        getAllFilteredLeadIDs(
          filterObject,
          (success, data) => {
            if (success) {
              // console.log(data);
              setFilteredLeads(data);
              setIsOpen(false);
            }
          },
          setLeadsLoading
        )
      );
    } else if (type === "email") {
      dispatch(
        getAllEmailFilteredLeadIDs(
          filterObject,
          (success, data) => {
            if (success) {
              // console.log(data);
              setFilteredLeads(data);
              setIsOpen(false);
            }
          },
          setLeadsLoading
        )
      );
    }
  };

  return (
    <Filters
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Lead Filter"
      onReset={onReset}
      onFilterCancel={() => onFilterSubmit(1, false, {})}
      className="space-y-4 font-extrabold"
      onSubmit={handleSubmit(onSubmit)}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4"
      >
        {/* Important Lead toggle */}
        <p
          onClick={() => setImportantState(!importantState)}
          className="main-bg text-white p-2 rounded-md text-md text-center cursor-pointer"
        >
          {importantState ? "Unmark Important Lead" : "Important Lead"}
        </p>

        {/* Standard inputs */}
        <InputField
          control={control}
          errors={errors}
          label="Team Members"
          type="select"
          name="user"
          options={profileData}
        />
        <InputField
          control={control}
          errors={errors}
          label="Lead Id"
          name="leadId"
          type="text"
        />
        <InputField
          control={control}
          errors={errors}
          label="Client Mobile Number"
          name="mobileNumber"
          type="number"
        />
        <InputField
          control={control}
          errors={errors}
          label="Sales Status"
          type="select"
          mode="multiple"
          name="status"
          options={salesStatusOptions}
        />
        <InputField
          control={control}
          errors={errors}
          label="Operation Status"
          name="operationStatus"
          type="select"
          options={operationsStatusOption}
        />
        <InputField
          control={control}
          errors={errors}
          label="Lead Source"
          name="leadSource"
          type="select"
          options={leadSourceOptions}
        />
        <InputField
          control={control}
          errors={errors}
          label="Service Category"
          name="serviceCategory"
          type="select"
          options={serviceCategoryOption}
        />

        {/* Other toggles */}
        <p
          onClick={() => setRefundState(!refundState)}
          className="main-bg text-white p-2 rounded-md text-md text-center cursor-pointer"
        >
          {refundState ? "Unmark Refund" : "Refund"}
        </p>
        <p
          onClick={() => setMannualLeadState(!mannualLeadState)}
          className="main-bg text-white p-2 rounded-md text-md text-center cursor-pointer"
        >
          {mannualLeadState
            ? "Unmark Manual Renewal Lead"
            : "Manual Renewal Lead"}
        </p>
        <p
          onClick={() => setIECLeadState(!iecLeadState)}
          className="main-bg text-white p-2 rounded-md text-md text-center cursor-pointer"
        >
          {iecLeadState ? "Unmark IEC Renewal Lead" : "IEC Renewal Lead"}
        </p>
        <p
          onClick={() => setExcludeLeadState(!excludeLeadState)}
          className="main-bg text-white p-2 rounded-md text-md text-center cursor-pointer"
        >
          {excludeLeadState
            ? "Unmark Exclude IEC Renewal Lead"
            : "Exclude IEC Renewal Lead"}
        </p>

        {/* Buttons */}
        <div className="w-full flex justify-end items-center py-3 gap-x-2 sticky bottom-0 border-t-4 bg-white">
          <MyButton
            type="button"
            className="bg-green-700 py-2 px-4 text-[14px]"
            onClick={onReset}
          >
            Reset
          </MyButton>
          <MyButton type="submit" className="main-bg py-2 px-4 text-[14px]">
            Apply
          </MyButton>
        </div>
      </form>
    </Filters>
  );
};

export default MarketingInHouseLeadFilter;
