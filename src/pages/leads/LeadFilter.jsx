import React, { useEffect, useRef, useState } from "react";
import Filters from "../../components/sliders/Filters";
import { useForm } from "react-hook-form";
import InputField from "../../components/fields/InputField";
import { useDispatch, useSelector } from "react-redux";
import {
  applicationTypeOptions,
  filterOptions,
  freshOrFollowStatusOptions,
  operationsStatusOption,
  paymentModeOptions,
  salesStatusOptions,
  serviceCategoryOption,
} from "../../constants/options";

import usePath from "../../hooks/usePath";
import MyButton from "../../components/buttons/MyButton";

const LeadFilter = ({
  isOpen = false,
  setIsOpen = () => {},
  onFilterSubmit,

  setFilteringParameters,
  filterFor,
  endPoint,
  serviceCategory,
  status,
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
  // console.log(filters);

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
    // return filter ? JSON.parse(filter) : null;
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
    {
      value: "ieccode-portal.org",
      label: "ieccode-portal.org",
    },

    { value: "ieccode-india.org", label: "ieccode-india.org" },
    { value: "iecode-india.org", label: "iecode-india.org" },
    {
      label: "fssai-registrationportal.org",
      value: "fssai-registrationportal.org",
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
    { value: "fssaicopywebsite", label: "FSSAI Copy Website" },
    { value: "ieccopywebsite", label: "IEC Copy Website" },
    { value: "gstcopywebsite", label: "GST Copy Website" },
  ];

  const onReset = () => {
    console.log("onres");
    reset();
    setIsOpen(false);
    setImportantState(false);
    setRefundState(false);

    const quary = path.searchQuary?.[0];
    const page = quary?.page ? parseInt(quary?.page) : 1;
    if (endPoint === "assigned-nc-bucket") {
      path.changeEndPoint(`${endPoint}`);
    } else if (endPoint === "total-leads-bucket-view") {
      path.changeEndPoint(
        `total-leads-bucket-view?page=1&serviceCategory=${serviceCategory}&status=${status}`
      );
    } else if (endPoint === "total-nc-bucket-view") {
      path.changeEndPoint(
        `total-nc-bucket-view?page=1&serviceCategory=${serviceCategory}&status=${status}`
      );
    } else if (endPoint === "nc-bucket-share-by-selecting") {
      path.changeEndPoint(
        `nc-bucket-share-by-selecting?page=1&serviceCategory=${serviceCategory}&status=${status}`
      );
    } else {
      path.changeEndPoint(`${endPoint}?page=${page}`);
    }

    // onFilterSubmit(1, false, {});
  };

  const onSubmit = (formData) => {
    console.log("data submitted", formData);

    const data = {
      ...formData,
      important: importantState,
      refund: refundState,
      manualRenewalLead: mannualLeadState,
      iecRenewalLead: iecLeadState,
      excludeIecRenewalLead: excludeLeadState,
    };
    setFilteringParameters(data);
    const filterObject = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== "" && value !== null
      )
    );
    if (filterObject) {
      // console.log('filter', filterObject);
      // const quary = path.searchQuary?.[0];
      // const page = quary?.page ? parseInt(quary?.page) : 1;
      setIsOpen(false);

      if (filterFor === "Leads") {
        // dispatch(getAllLeads(1, true, filterObject));
        path.changeEndPoint(
          `leads?page=1&filter=${JSON.stringify(filterObject)}`
        );
      } else if (filterFor === "AssignedNC") {
        path.changeEndPoint(
          `assigned-nc-bucket?page=1&filter=${JSON.stringify(filterObject)}`
        );
        // dispatch(getAssignedNCBucketLeadsData(1, true, filterObject));
      } else if (filterFor === "FollowUp") {
        // dispatch(getOperationsFollowUpLead(1, true, filterObject));
        path.changeEndPoint(
          `follow-ups?page=1&filter=${JSON.stringify(filterObject)}`
        );
      } else if (filterFor === "iecRenewalLead") {
        path.changeEndPoint(
          `iec-renewal-lead?page=1&filter=${JSON.stringify(filterObject)}`
        );
      } else if (filterFor === "total-leads-bucket-view") {
        path.changeEndPoint(
          `total-leads-bucket-view?page=1&serviceCategory=${serviceCategory}&status=${status}&filter=${JSON.stringify(
            filterObject
          )}`
        );
      } else if (filterFor === "total-nc-bucket-view") {
        path.changeEndPoint(
          `total-nc-bucket-view?page=1&serviceCategory=${serviceCategory}&status=${status}&filter=${JSON.stringify(
            filterObject
          )}`
        );
      } else if (filterFor === "nc-bucket-share-by-selecting") {
        path.changeEndPoint(
          `nc-bucket-share-by-selecting?page=1&serviceCategory=${serviceCategory}&status=${status}&filter=${JSON.stringify(
            filterObject
          )}`
        );
      } else if (filterFor === "nc-bucket-share-by-selecting") {
        path.changeEndPoint(
          `nc-bucket-share-by-selecting?page=1&serviceCategory=${serviceCategory}&status=${status}&filter=${JSON.stringify(
            filterObject
          )}`
        );
      } else if (filterFor === "renewal") {
        path.changeEndPoint(
          `renewal?page=1&filter=${JSON.stringify(filterObject)}`
        );
      }
      // onFilterSubmit(1, true, filterObject);

      // setIsOpen(false);
    }
  };

  const handleImportantClick = () => {
    setImportantState(!importantState);
  };

  const handleRefundClick = () => {
    setRefundState(!refundState);
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
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // Make sure no dropdown is open
            console.log("ente");
            const activeDropdown = document.querySelector(".ant-select-open");
            if (!activeDropdown) {
              handleSubmit(onSubmit)(); // manually trigger form submit
            }
          }
        }}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4"
      >
        <p
          onClick={handleImportantClick}
          className="main-bg text-white p-2 rounded-md text-md text-center cursor-pointer"
        >
          {importantState ? "Unmark Important Lead" : "Important Lead"}
        </p>
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
          label="Sales Status 2"
          type="select"
          mode="multiple"
          name="status2"
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
        <InputField
          control={control}
          errors={errors}
          label="Fresh/Follow Up Data"
          name="freshOrFollow"
          type="option"
          options={freshOrFollowStatusOptions}
        />
        <InputField
          control={control}
          errors={errors}
          label="Client Email"
          type="email"
          name="emailId"
        />
        <InputField
          control={control}
          errors={errors}
          label="Application Type"
          name="applicationType"
          type="select"
          options={applicationTypeOptions}
        />

        <InputField
          control={control}
          errors={errors}
          label="Payment Date"
          name="paymentDate"
          placeholder="Select Option"
          type="option"
          options={filterOptions}
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            control={control}
            errors={errors}
            label="From"
            name="paymentFromDate"
            type="date"
          />
          <InputField
            control={control}
            errors={errors}
            label="To"
            name="paymentToDate"
            type="date"
          />
        </div>
        <InputField
          control={control}
          errors={errors}
          label="Payment Mode"
          type="select"
          name="paymentMode"
          options={paymentModeOptions}
        />
        <InputField
          control={control}
          errors={errors}
          label="Lead Date"
          name="date"
          type="option"
          options={filterOptions}
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            control={control}
            errors={errors}
            label="From"
            name="fromDate"
            type="date"
          />
          <InputField
            control={control}
            errors={errors}
            label="To"
            name="toDate"
            type="date"
          />
        </div>
        <p
          onClick={handleRefundClick}
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

        <div className="w-full flex justify-end items-center py-3 gap-x-2 sticky bottom-0 border-t-4 bg-white">
          {/* <MyButton
            className="bg-gray-300 shadow-none hover:shadow-none py-2 px-4 text-black text-[14px]"
            // onClick={handleClose}
          >
            Cancel
          </MyButton> */}

          <MyButton
            className="bg-green-700 py-2 px-4 text-[14px]"
            onClick={() => onReset()}
          >
            Reset
          </MyButton>
          <MyButton
            type="submit"
            className="main-bg py-2 px-4 text-[14px]"
            // onClick={onSubmit}
          >
            Apply
          </MyButton>
        </div>
      </form>
    </Filters>
  );
};

export default LeadFilter;
