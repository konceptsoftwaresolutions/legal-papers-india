import React, { useEffect, useRef, useState } from "react";
import Heading from "../../common/Heading";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import InputField from "../../components/fields/InputField";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import MyButton from "../../components/buttons/MyButton";
import DataTable from "react-data-table-component";
import { paymentsColumn, remarksColumn } from "./columns";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import { Button } from "@material-tailwind/react";
import EditableTable from "../../components/editable/EditableTable";
import { MdDelete } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { FaFile } from "react-icons/fa6";
import Swal from "sweetalert2";

import {
  operationsStatusOption,
  paymentModeOptions,
  salesStatusOptions,
  taxRateOptions,
} from "../../constants/options";
import { FaFileDownload } from "react-icons/fa";
import FieldsCont from "../../common/FieldsCont";
import {
  deleteLead,
  editLead,
  getAllOperationsExecutive,
  getLeaByID,
  handleMoveNCBucket,
  removeRenewalLead,
} from "../../redux/features/leads";
import { getNotificationData } from "../../redux/features/notification";
import MoveNCModal from "./MoveNCModal";
import DocUploadModal from "./DocUploadModal";
import AddTaskModal from "../tasks/AddTaskModal";
import ByeByeModal from "./ByeByeModal";
import toast from "react-hot-toast";
import GeneratePerformaModal from "./GeneratePerformaModal";
import { getAllServices } from "../../redux/features/services";
import AllPerformaInvoices from "./AllPerformaInvoices";
import PDFPreviewer from "./PDFPreviewer";
import GenerateTaxModal from "./GenerateTaxModal";
import AllTaxInvoices from "./AllTaxInvoices";

// import Remarks from "./Remarks"; operationsTl operationsExecutive

const EditLead = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const leadId = location.state?.leadData?.leadId || searchParams.get("leadId");
  const isScroll = location.state?.isScroll;

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const { items: allServices } = useSelector((state) => state.services);

  useEffect(() => {
    if (!allServices || allServices.length === 0) {
      dispatch(getAllServices());
    }
  }, [dispatch, allServices]);

  useEffect(() => {
    if (isScroll) {
      const interval = setInterval(() => {
        const paymentDiv = document.querySelector(".payment");
        if (paymentDiv) {
          paymentDiv.scrollIntoView({ behavior: "smooth" });
          clearInterval(interval); // Stop checking once it works
        }
      }, 100); // Check every 100ms

      return () => clearInterval(interval); // Cleanup in case component unmounts
    }
  }, [isScroll]);

  const { allSalesExecutive, allOperationsExecutive } = useSelector(
    (state) => state.leads
  );
  const [isEditable, setIsEditable] = useState(false);
  const [leadData, setLeadData] = useState(null); // State to store API response
  const [isLoading, setIsLoading] = useState(true); // State for loading indicato
  const [ncModal, setNcModal] = useState(false);
  const [byeModal, setByeModal] = useState(false);
  const [docModal, setDocModal] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showPerformaModal, setShowPerformaModal] = useState(false);
  const [openTaxModal, setOpenTaxModal] = useState(false);

  const [moveNcBtnClicked, setMoveNcBtnClicked] = useState(false);

  const { role } = useSelector((state) => state.auth);
  console.log(role);

  useEffect(() => {
    // dispatch(getNotificationData());
    dispatch(getAllOperationsExecutive());
  }, [dispatch]);

  const getLeadDataByLeadId = (leadId) => {
    dispatch(getLeaByID(leadId));
  };

  useEffect(() => {
    // dispatch(getLeaByID(leadId));
    getLeadDataByLeadId(leadId);
  }, [dispatch, leadId]);

  useEffect(() => {
    if (leadId) {
      setIsLoading(true); // Set loading to true before API call
      dispatch(getLeaByID(leadId))
        .then((data) => {
          setLeadData(data); // Store API response in state
          setIsLoading(false); // Set loading to false after data is loaded
        })
        .catch((err) => {
          console.log(err.message);
          setIsLoading(false); // Ensure loading is false even on error
        });
    }
  }, [dispatch, leadId]);

  // console.log("+=============", leadData);

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    reset,
  } = useForm({});

  useEffect(() => {
    if (leadData) {
      reset({
        leadId: leadData?.leadId,
        salesStatus: leadData?.status,
        operationsExecutiveName: leadData?.operationExecutive,
        operationsExecutiveEmail: leadData?.operationExecutive,
        operationStatus: leadData?.operationStatus,
        previousLeadId: leadData?.previousLeadId,
        previousLeadOwner: leadData?.previousLeadOwner,
        duplicate: leadData?.duplicate,
        operationTL: leadData?.operationTL,
        salesTL: leadData?.salesTL,
        date: leadData?.date,
        totalPayments: leadData?.totalPayments,
        nameOfBusinessEntity: leadData?.formData?.nameOfBusinessEntity,
        name: leadData?.formData?.name,
        serviceCategory: leadData?.formData?.serviceCategory,
        emailId: leadData?.formData?.emailId,
        mobileNumber: leadData?.formData?.mobileNumber,
        descriptionOfBusiness: leadData?.formData?.descriptionOfBusiness,
        applicationType: leadData?.formData?.applicationType,
        constitutionOfBusiness: leadData?.formData?.constitutionOfBusiness,
        businessActivity: leadData?.formData?.businessActivity,
        principalPlaceOfBusinessEntity:
          leadData?.formData?.principalPlaceOfBusinessEntity,
        panNoOfEntity: leadData?.formData?.panNoOfEntity,
        branch: leadData?.formData?.branch,
        firm: leadData?.formData?.firm,
        dateOfIncorporation: leadData?.formData?.dateOfIncorporation,
        leadSource: leadData?.formData?.leadSource,
        platform: leadData?.formData?.platform,
        validity: leadData?.formData?.validity,
        allFormDataDetails: leadData?.allFormDataDetails,
        salesExecutiveName: leadData?.salesExecutiveName,
        salesExecutiveEmail: leadData?.salesExecutive,
        remarksArray: leadData?.remarks || [],
        payment: leadData?.paymentArray || [],
        refundArray: leadData?.refundArray || [],
        allDocuments: leadData?.documentName || [],
        foodCategory: leadData?.formData?.foodCategory || "",
        numberOfYears: leadData?.formData?.numberOfYears || "",
        status2: leadData?.status2 || "",
      });
    }
  }, [leadData, reset]);

  const {
    fields: remarksArray,
    remove: removeRemark,
    append: appendRemark,
  } = useFieldArray({
    control,
    name: "remarksArray",
  });

  const {
    fields: payment,
    remove: removePayment,
    append: appendPayment,
  } = useFieldArray({
    control,
    name: "payment",
  });

  const {
    fields: leadFiles,
    append: appendLeadFile,
    remove: removeLeadFile,
  } = useFieldArray({
    control,
    name: "leadFiles",
  });

  // Watch all payment fields at once
  const payments = useWatch({ control, name: "payment" });

  // Track previous values to avoid unnecessary updates
  const prevPaymentsRef = useRef(null);

  useEffect(() => {
    if (JSON.stringify(payments) === JSON.stringify(prevPaymentsRef.current)) {
      return; // Exit if values haven't changed
    }

    payments?.forEach((payment, index) => {
      const totalAmount = parseFloat(payment.totalAmount) || 0;
      const govtFee = parseFloat(payment.govtFee) || 0;
      const grossAmount = totalAmount - govtFee;
      const taxRate = payment.taxRate === "0.18" ? 1.18 : 1;

      const revenue = parseFloat((grossAmount / taxRate).toFixed(2));

      if (payment.grossAmount !== grossAmount) {
        setValue(`payment.${index}.grossAmount`, grossAmount, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      if (taxRate) {
        setValue(`payment.${index}.revenue`, revenue, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    });

    prevPaymentsRef.current = payments; // Store previous payments for comparison
  }, [payments, setValue]);

  const {
    fields: refundArray,
    remove: removeRefundArray,
    append: appendRefundArray,
  } = useFieldArray({
    control,
    name: "refundArray",
  });

  const {
    fields: allDocuments,
    remove: removeAllDocuments,
    append: appendDocumentName,
  } = useFieldArray({
    control,
    name: "allDocuments",
  });

  const prepareFormData = (files) => {
    const formData = new FormData();

    files.forEach((fileObj, index) => {
      formData.append(`File`, fileObj.file); // Each file is appended as a separate binary file
    });

    return formData;
  };

  const onSubmit = (data) => {
    console.log("FORM SUBMITTED", data);
    // Create a new FormData object

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (
        !key.startsWith("document") &&
        !key.startsWith("payment") &&
        !key.startsWith("remarks") &&
        !key.includes("Field") &&
        key !== "refundArray" && // Exclude refundArray
        key !== "foodCategory" && // Exclude foodCategory
        key !== "numberOfYears" && // Exclude numberOfYears
        key !== "allFormDataDetails" && // Exclude numberOfYears
        key !== "salesExecutiveName" // Exclude numberOfYears
      ) {
        formData.append(key, data[key]);
      }
    });

    const payments =
      data.payment && Array.isArray(data.payment)
        ? data.payment.map((payment) => ({
            totalAmount: payment.totalAmount || "",
            date: payment.date || "",
            transactionId: payment.transactionId || "",
            govtFee: payment.govtFee || "",
            revenue: payment.revenue || 0,
            taxRate: payment.taxRate || "",
            grossAmount: payment.grossAmount || 0,
            notes: payment.notes || "",
            paymentMode: payment.paymentMode || "",
            ...(payment.paymentMode === "Others"
              ? { otherPaymentMode: payment.otherPaymentMode }
              : {}),
          }))
        : [];
    formData.append("payments", JSON.stringify(payments));
    console.log(payments);

    const refunds =
      data.refundArray && Array.isArray(data.refundArray)
        ? data.refundArray.map((refund) => ({
            amount: refund.amount || "",
            date: refund.date || "",
            transactionId: refund.transactionId || "",
            notes: refund.notes || "",
          }))
        : [];
    formData.append("refunds", JSON.stringify(refunds));

    const remarks =
      data.remarksArray && Array.isArray(data.remarksArray)
        ? data.remarksArray.map((remark) => ({
            remark: remark.remark || "",
            dateTime: remark.dateTime || "",
          }))
        : [];
    formData.append("remarks", JSON.stringify(remarks));

    // const documents =
    //   inputDocList && Array.isArray(inputDocList)
    //     ? inputDocList.map((doc) => ({
    //         documentName: doc.name || "",
    //         documentLink: doc.link || "",
    //       }))
    //     : [];
    // formData.append("documents", JSON.stringify(documents));

    // Append Uploaded Files to FormData

    // Append an empty document array
    // formData.append("documents", JSON.stringify([]));

    const documents =
      data.allDocuments && Array.isArray(data.allDocuments)
        ? data.allDocuments.map((doc) => ({
            documentName: doc.documentName || "",
            documentLink: doc.documentLink || "",
          }))
        : [];
    formData.append("documents", JSON.stringify(documents));

    formData.append("salesExecutiveName", data.salesExecutiveEmail);
    if (uploadedDoc?.files && Array.isArray(uploadedDoc.files)) {
      uploadedDoc.files.forEach((fileObj, index) => {
        if (fileObj.file instanceof File) {
          formData.append(`File`, fileObj.file); // Append each file with a unique key
        }
      });
    }
    if (moveNcBtnClicked === true) {
      console.log("nc clicked");
    }
    // const hasZeroRevenue = () => {
    //   return payments.some((item) => Number(item.revenue) === 0);
    // };
    // if (hasZeroRevenue) {
    //   toast.error("Revenue can't be zero")
    //   console.log("got");
    //   return;
    // }
    dispatch(
      editLead(formData, (success) => {
        if (success) {
          navigate(-1);
        }
      })
    );
  };

  const onSubmitWithExtraAPI = (data) => {
    // console.log("FORM SUBMITTED extra onve", data);
    // Create a new FormData object
    // console.log(data);
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (
        !key.startsWith("document") &&
        !key.startsWith("payment") &&
        !key.startsWith("remarks") &&
        !key.includes("Field") &&
        key !== "refundArray" && // Exclude refundArray
        key !== "foodCategory" && // Exclude foodCategory
        key !== "numberOfYears" && // Exclude numberOfYears
        key !== "allFormDataDetails" && // Exclude numberOfYears
        key !== "salesExecutiveName" // Exclude numberOfYears
      ) {
        formData.append(key, data[key]);
      }
    });

    const payments =
      data.payment && Array.isArray(data.payment)
        ? data.payment.map((payment) => ({
            totalAmount: payment.totalAmount || "",
            date: payment.date || "",
            transactionId: payment.transactionId || "",
            govtFee: payment.govtFee || "",
            revenue: payment.revenue || "",
            taxRate: payment.taxRate || "",
            grossAmount: payment.grossAmount || "",
            notes: payment.notes || "",
            paymentMode: payment.paymentMode || "",
            ...(payment.paymentMode === "Others"
              ? { otherPaymentMode: payment.otherPaymentMode }
              : {}),
          }))
        : [];
    formData.append("payments", JSON.stringify(payments));

    const refunds =
      data.refundArray && Array.isArray(data.refundArray)
        ? data.refundArray.map((refund) => ({
            amount: refund.amount || "",
            date: refund.date || "",
            transactionId: refund.transactionId || "",
            notes: refund.notes || "",
          }))
        : [];
    formData.append("refunds", JSON.stringify(refunds));

    const remarks =
      data.remarksArray && Array.isArray(data.remarksArray)
        ? data.remarksArray.map((remark) => ({
            remark: remark.remark || "",
            dateTime: remark.dateTime || "",
          }))
        : [];
    formData.append("remarks", JSON.stringify(remarks));

    // const documents =
    //   inputDocList && Array.isArray(inputDocList)
    //     ? inputDocList.map((doc) => ({
    //         documentName: doc.name || "",
    //         documentLink: doc.link || "",
    //       }))
    //     : [];
    // formData.append("documents", JSON.stringify(documents));

    // Append Uploaded Files to FormData

    // Append an empty document array
    // formData.append("documents", JSON.stringify([]));

    const documents =
      data.allDocuments && Array.isArray(data.allDocuments)
        ? data.allDocuments.map((doc) => ({
            documentName: doc.documentName || "",
            documentLink: doc.documentLink || "",
          }))
        : [];
    formData.append("documents", JSON.stringify(documents));

    formData.append("salesExecutiveName", data.salesExecutiveEmail);
    if (uploadedDoc?.files && Array.isArray(uploadedDoc.files)) {
      uploadedDoc.files.forEach((fileObj, index) => {
        if (fileObj.file instanceof File) {
          formData.append(`File`, fileObj.file); // Append each file with a unique key
        }
      });
    }
    // console.log("clicked");
    dispatch(
      editLead(formData, (success) => {
        if (success) {
          dispatch(
            handleMoveNCBucket(leadData.leadId, (success) => {
              if (success) {
                getLeadDataByLeadId(leadId);
              }
            })
          );
        }
      })
    );
  };

  const onSaveAndRemoveFromRenewalPage = (data) => {
    console.log("asf");
    // console.log("FORM SUBMITTED extra onve", data);
    // Create a new FormData object
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (
        !key.startsWith("document") &&
        !key.startsWith("payment") &&
        !key.startsWith("remarks") &&
        !key.includes("Field") &&
        key !== "refundArray" && // Exclude refundArray
        key !== "foodCategory" && // Exclude foodCategory
        key !== "numberOfYears" && // Exclude numberOfYears
        key !== "allFormDataDetails" && // Exclude numberOfYears
        key !== "salesExecutiveName" // Exclude numberOfYears
      ) {
        formData.append(key, data[key]);
      }
    });
    const payments =
      data.payment && Array.isArray(data.payment)
        ? data.payment.map((payment) => ({
            totalAmount: payment.totalAmount || "",
            date: payment.date || "",
            transactionId: payment.transactionId || "",
            govtFee: payment.govtFee || "",
            revenue: payment.revenue || "",
            taxRate: payment.taxRate || "",
            grossAmount: payment.grossAmount || "",
            notes: payment.notes || "",
            paymentMode: payment.paymentMode || "",
            ...(payment.paymentMode === "Others"
              ? { otherPaymentMode: payment.otherPaymentMode }
              : {}),
          }))
        : [];
    formData.append("payments", JSON.stringify(payments));
    const refunds =
      data.refundArray && Array.isArray(data.refundArray)
        ? data.refundArray.map((refund) => ({
            amount: refund.amount || "",
            date: refund.date || "",
            transactionId: refund.transactionId || "",
            notes: refund.notes || "",
          }))
        : [];
    formData.append("refunds", JSON.stringify(refunds));
    const remarks =
      data.remarksArray && Array.isArray(data.remarksArray)
        ? data.remarksArray.map((remark) => ({
            remark: remark.remark || "",
            dateTime: remark.dateTime || "",
          }))
        : [];
    formData.append("remarks", JSON.stringify(remarks));
    // const documents =
    //   inputDocList && Array.isArray(inputDocList)
    //     ? inputDocList.map((doc) => ({
    //         documentName: doc.name || "",
    //         documentLink: doc.link || "",
    //       }))
    //     : [];
    // formData.append("documents", JSON.stringify(documents));
    // Append Uploaded Files to FormData
    // Append an empty document array
    // formData.append("documents", JSON.stringify([]));
    const documents =
      data.allDocuments && Array.isArray(data.allDocuments)
        ? data.allDocuments.map((doc) => ({
            documentName: doc.documentName || "",
            documentLink: doc.documentLink || "",
          }))
        : [];
    formData.append("documents", JSON.stringify(documents));
    formData.append("salesExecutiveName", data.salesExecutiveEmail);
    if (uploadedDoc?.files && Array.isArray(uploadedDoc.files)) {
      uploadedDoc.files.forEach((fileObj, index) => {
        if (fileObj.file instanceof File) {
          formData.append(`File`, fileObj.file); // Append each file with a unique key
        }
      });
    }
    dispatch(editLead(formData));
    dispatch(removeRenewalLead(leadData.leadId));
  };

  // salesExectuiveOptions
  const salesExectuiveOptions = allSalesExecutive?.map((item, index) => {
    return {
      label: item.name,
      value: item.email,
    };
  });

  const operationExecutiveOptions = allOperationsExecutive?.map(
    (operation) => ({
      value: operation.email,
      label: operation.name,
    })
  );

  if (isLoading) {
    return (
      <div className="w-[100%] h-[100vh] flex justify-center items-center">
        loading ...
      </div>
    ); // Display loading message
  }

  const restrictedFields = {
    // just add the fiedls name to makediabled by rle
    salesExecutive: ["salesStatus", "remark", "status2"],

    operationsTl: [
      "operationStatus",
      "sales",
      "nameOfBusinessEntity",
      "emailId",
      "operationsExecutiveName",
      "mobileNumber",
    ],
    // admin: [],
    salesTl: [
      "salesStatus",
      // "nameOfBusinessEntity",
      "emailId",
      "mobileNumber",
      "status2",
    ],
    superAdmin: [
      "leadId",
      "salesExecutiveEmail",
      "salesTL",
      "date",
      "leadSource",
      "allFormDataDetails",
      "totalPayments",
    ],
    operationsExecutive: ["operationStatus"],
  };

  const isFieldDisabled = (field, role, isEditable, isMannualLead) => {
    if (isMannualLead) {
      return true;
    }
    if (role === "salesExecutive") {
      return !isEditable || !restrictedFields[role]?.includes(field); // Only allow fields listed in the array
    }
    if (role === "operationsTl") {
      return !isEditable || !restrictedFields[role]?.includes(field); // Only allow fields listed in the array
    }

    if (role === "operationsExecutive") {
      return !isEditable || !restrictedFields[role]?.includes(field); // Only allow fields listed in the array
    }

    if (role === "salesTl") {
      return !isEditable || !restrictedFields[role]?.includes(field); // Only allow fields listed in the array
    }

    return !isEditable || restrictedFields[role]?.includes(field);
  };

  const handleLeadDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          deleteLead(leadData?.leadId, (success) => {
            if (success) {
              Swal.fire("Deleted!", "The lead has been deleted.", "success");
              navigate(-1);
            }
          })
        );
      }
    });
  };

  return (
    <>
      <div className="flex flex-col w-full px-4 gap-y-4 py-5">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-y-3">
          <Heading text="Lead Details" showHeading />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldsCont>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
              {leadData?.leadId && (
                <InputField
                  type="text"
                  control={control}
                  errors={errors}
                  label="Lead ID"
                  disabled={isFieldDisabled("leadId", role, isEditable)}
                  name="leadId"
                />
              )}

              {leadData?.salesExecutiveName && (
                <InputField
                  type="select"
                  control={control}
                  errors={errors}
                  mode="single"
                  name="salesExecutiveName"
                  options={salesExectuiveOptions}
                  label="Sales Executive Name"
                  disabled={isFieldDisabled(
                    "salesExecutiveName",
                    role,
                    isEditable
                  )}
                />
              )}
              {leadData?.operationExecutive && (
                <InputField
                  type="option"
                  control={control}
                  errors={errors}
                  label="Operations Executive Name"
                  disabled={isFieldDisabled(
                    "operationsExecutiveName",
                    role,
                    isEditable
                  )}
                  name="operationsExecutiveName"
                  options={operationExecutiveOptions}
                />
              )}

              {leadData?.salesExecutive && (
                <InputField
                  type="email"
                  control={control}
                  errors={errors}
                  label="Sales Executive Email"
                  disabled={isFieldDisabled(
                    "salesExecutiveEmail",
                    role,
                    isEditable
                  )}
                  name="salesExecutiveEmail"
                />
              )}

              {leadData?.operationExecutive && (
                <InputField
                  type="email"
                  control={control}
                  errors={errors}
                  label="Operation Executive Email"
                  disabled={isFieldDisabled(
                    "operationsExecutiveEmail",
                    role,
                    isEditable
                  )}
                  name="operationsExecutiveEmail"
                />
              )}

              {leadData?.status && (
                <InputField
                  type="option"
                  control={control}
                  errors={errors}
                  label="Status"
                  name="salesStatus"
                  options={salesStatusOptions}
                  disabled={
                    leadData?.status === "Converted"
                      ? true
                      : isFieldDisabled(
                          "salesStatus",
                          role,
                          isEditable,
                          leadData?.manualRenewalLead
                        )
                  }
                />
              )}

              <InputField
                type="option"
                control={control}
                errors={errors}
                label="Status 2"
                name="status2"
                options={salesStatusOptions}
                // disabled={
                //   leadData?.status2 === "Converted"
                //     ? true
                //     : isFieldDisabled(
                //         "salesStatus",
                //         role,
                //         isEditable,
                //         leadData?.manualRenewalLead
                //       )
                // }
                disabled={
                  leadData?.status2 === "Converted"
                    ? true
                    : isFieldDisabled("status2", role, isEditable)
                }
              />

              {leadData?.operationTL && (
                <InputField
                  type="option"
                  control={control}
                  errors={errors}
                  label="Opetation Status"
                  disabled={
                    leadData?.operationStatus === "completed"
                      ? true
                      : isFieldDisabled("operationStatus", role, isEditable)
                  }
                  name="operationStatus"
                  options={operationsStatusOption}
                />
              )}

              {leadData?.salesTL && (
                <InputField
                  type="text"
                  control={control}
                  errors={errors}
                  label="Sales TL"
                  disabled={isFieldDisabled("salesTL", role, isEditable)}
                  name="salesTL"
                />
              )}

              {leadData?.operationTL && (
                <InputField
                  type="text"
                  control={control}
                  errors={errors}
                  label="Operation TL"
                  disabled={isFieldDisabled("operationTL", role, isEditable)}
                  name="operationTL"
                />
              )}

              {leadData?.date && (
                <InputField
                  type="text"
                  control={control}
                  errors={errors}
                  label="Date"
                  disabled={isFieldDisabled("date", role, isEditable)}
                  name="date"
                />
              )}

              {leadData?.previousLeadId && (
                <InputField
                  type="text"
                  control={control}
                  errors={errors}
                  label="Previous Lead ID"
                  disabled={isFieldDisabled("previousLeadId", role, isEditable)}
                  name="previousLeadId"
                />
              )}

              {leadData?.previousLeadOwner && (
                <InputField
                  type="email"
                  control={control}
                  errors={errors}
                  label="Previous Lead Owner"
                  disabled={isFieldDisabled(
                    "previousLeadOwner",
                    role,
                    isEditable
                  )}
                  name="previousLeadOwner"
                />
              )}

              {leadData?.duplicate && (
                <InputField
                  type="text"
                  control={control}
                  errors={errors}
                  label="Duplicate"
                  disabled={isFieldDisabled("duplicate", role, isEditable)}
                  name="duplicate"
                />
              )}

              {leadData?.totalPayments && (
                <InputField
                  type="number"
                  control={control}
                  errors={errors}
                  label="Total Payments"
                  disabled={isFieldDisabled("totalPayments", role, isEditable)}
                  name="totalPayments"
                />
              )}
            </div>
          </FieldsCont>

          {/* ---------------------LEAD INFORMATION----------------- */}
          <div className="main-black-bg p-2 rounded-md my-6">
            <Heading text="Lead Information" className="text-white" />
          </div>
          <FieldsCont>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
              {leadData?.formData?.nameOfBusinessEntity && (
                <InputField
                  type="text"
                  control={control}
                  errors={errors}
                  label="Business Name"
                  disabled={isFieldDisabled(
                    "nameOfBusinessEntity",
                    role,
                    isEditable
                  )}
                  name="nameOfBusinessEntity"
                />
              )}
              {leadData?.formData?.name && (
                <InputField
                  type="text"
                  control={control}
                  errors={errors}
                  label="Name"
                  disabled={isFieldDisabled("name", role, isEditable)}
                  name="name"
                />
              )}
              {leadData?.formData?.emailId && (
                <InputField
                  type="text"
                  control={control}
                  errors={errors}
                  label="Email ID"
                  disabled={isFieldDisabled("emailId", role, isEditable)}
                  name="emailId"
                />
              )}
              {leadData?.formData?.mobileNumber && (
                <InputField
                  type="text"
                  control={control}
                  errors={errors}
                  label="Mobile Number"
                  disabled={isFieldDisabled("mobileNumber", role, isEditable)}
                  name="mobileNumber"
                />
              )}
              {leadData?.formData?.descriptionOfBusiness && (
                <InputField
                  type="text"
                  control={control}
                  errors={errors}
                  label="Description Of Business"
                  disabled={isFieldDisabled(
                    "descriptionOfBusiness",
                    role,
                    isEditable
                  )}
                  name="descriptionOfBusiness"
                />
              )}
              {leadData?.formData?.applicationType && (
                <InputField
                  type="text"
                  control={control}
                  errors={errors}
                  label="Application Type"
                  disabled={isFieldDisabled(
                    "applicationType",
                    role,
                    isEditable
                  )}
                  name="applicationType"
                />
              )}
              {leadData?.formData?.serviceCategory && (
                <InputField
                  type="option"
                  control={control}
                  errors={errors}
                  name="serviceCategory"
                  label="Service Category"
                  disabled={isFieldDisabled(
                    "serviceCategory",
                    role,
                    isEditable
                  )}
                />
              )}
              {leadData?.formData?.constitutionOfBusiness && (
                <InputField
                  type="text"
                  control={control}
                  errors={errors}
                  label="Nature Of Business"
                  disabled={isFieldDisabled(
                    "constitutionOfBusiness",
                    role,
                    isEditable
                  )}
                  name="constitutionOfBusiness"
                />
              )}
              {leadData?.formData?.businessActivity && (
                <InputField
                  type="text"
                  control={control}
                  errors={errors}
                  label="Business Activity"
                  disabled={isFieldDisabled(
                    "businessActivity",
                    role,
                    isEditable
                  )}
                  name="businessActivity"
                />
              )}
              {leadData?.formData?.principalPlaceOfBusinessEntity && (
                <InputField
                  type="text"
                  control={control}
                  errors={errors}
                  label="Address"
                  disabled={isFieldDisabled(
                    "principalPlaceOfBusinessEntity",
                    role,
                    isEditable
                  )}
                  name="principalPlaceOfBusinessEntity"
                />
              )}
              {leadData?.formData?.panNoOfEntity && (
                <InputField
                  type="text"
                  control={control}
                  errors={errors}
                  label="PAN Number"
                  disabled={isFieldDisabled("panNoOfEntity", role, isEditable)}
                  name="panNoOfEntity"
                />
              )}
              {leadData?.formData?.branch && (
                <InputField
                  type="text"
                  control={control}
                  errors={errors}
                  label="Branch"
                  disabled={isFieldDisabled("branch", role, isEditable)}
                  name="branch"
                />
              )}
              {leadData?.formData?.firm && (
                <InputField
                  type="text"
                  control={control}
                  errors={errors}
                  label="Firm"
                  disabled={isFieldDisabled("firm", role, isEditable)}
                  name="firm"
                />
              )}
              {leadData?.formData?.dateOfIncorporation && (
                <InputField
                  type="date"
                  control={control}
                  errors={errors}
                  label="Date Of Incorporation"
                  disabled={isFieldDisabled(
                    "dateOfIncorporation",
                    role,
                    isEditable
                  )}
                  name="dateOfIncorporation"
                />
              )}
              {leadData?.formData?.numberOfYears && (
                <InputField
                  type="number"
                  name="numberOfYears"
                  control={control}
                  errors={errors}
                  label="Number Of Years"
                  disabled={isFieldDisabled("numberOfYears", role, isEditable)}
                />
              )}
              {leadData?.formData?.foodCategory && (
                <InputField
                  type="text"
                  control={control}
                  name="foodCategory"
                  errors={errors}
                  label="Food Category"
                  disabled={isFieldDisabled("foodCategory", role, isEditable)}
                />
              )}
              {leadData?.formData?.leadSource && (
                <InputField
                  type="text"
                  control={control}
                  errors={errors}
                  label="Lead Source"
                  disabled={isFieldDisabled("leadSource", role, isEditable)}
                  name="leadSource"
                />
              )}

              {leadData?.formData?.platform && (
                <InputField
                  type="text"
                  control={control}
                  errors={errors}
                  label="Platform"
                  disabled={isFieldDisabled("platform", role, isEditable)}
                  name="platform"
                />
              )}
              {leadData?.formData?.validity && (
                <InputField
                  type="text"
                  control={control}
                  errors={errors}
                  label="Validity"
                  disabled={true}
                  name="validity"
                />
              )}
              {/* {leadData?.duplicate && (
                <InputField
                  type="text"
                  control={control}
                  name="duplicate"
                  errors={errors}
                  label="Duplicate"
                  disabled={isFieldDisabled("leadId", role, isEditable)}
                />
              )} */}
              <div className="flex justify-start items-end gap-2">
                <Button
                  className="capitalize"
                  onClick={() => setShowTaskModal(!showTaskModal)}
                >
                  Create Task
                </Button>
                <Button
                  className="capitalize"
                  onClick={() => setShowPerformaModal(true)}
                >
                  Generate Performa Invoice
                </Button>
                <Button
                  onClick={() => setOpenTaxModal(true)}
                  className="capitalize"
                >
                  Generate Tax Entry
                </Button>
              </div>
            </div>
          </FieldsCont>

          {/* ---------------------ALL LEAD DETAILS----------------- */}
          <div className="main-black-bg p-2 rounded-md my-6">
            <Heading text="All Lead Details" className="text-white" />
          </div>
          <FieldsCont>
            <div className="">
              <InputField
                type="description"
                control={control}
                errors={errors}
                name="allFormDataDetails"
                disabled={isFieldDisabled(
                  "allFormDataDetails",
                  role,
                  isEditable
                )}
              />
            </div>
          </FieldsCont>

          {/* ---------------------REMARKS----------------- */}
          <div className="main-black-bg  p-2 rounded-md my-6 flex justify-between">
            <Heading text="Remarks" className="text-white" />

            <button
              type="button"
              className={`main-bg text-white px-4 py-2 rounded text-xl ${
                !isEditable ? "opacity-40" : ""
              }`}
              onClick={() =>
                appendRemark({ dateTime: "", remark: "", executiveName: "" })
              }
            >
              <IoMdAddCircle />
            </button>
          </div>
          <FieldsCont>
            <div className="">
              {remarksArray?.length === 0 ? (
                <p className="text-gray-500 text-center">
                  No remarks available
                </p>
              ) : (
                remarksArray?.map((field, index) => (
                  <div
                    key={field.id}
                    className={`${
                      index >= 1 ? "border-t border-black pt-3 my-8" : ""
                    }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4 mb-3">
                      {field.dateTime !== undefined &&
                        field.dateTime !== "" && (
                          <InputField
                            control={control}
                            name={`remarksArray.${index}.dateTime`}
                            errors={errors}
                            type="datetime"
                            defaultValue={field.dateTime}
                            label="Date & Time"
                            disabled={true}
                          />
                        )}
                      <InputField
                        control={control}
                        name={`remarksArray.${index}.remark`}
                        errors={errors}
                        type="description"
                        defaultValue={field.remark}
                        label="Remarks"
                        disabled={!!field.remark}
                      />
                      <div className="flex items-end gap-x-4 ">
                        {field.executiveName !== undefined &&
                          field.executiveName !== "" && (
                            <InputField
                              control={control}
                              name={`remarksArray.${index}.executiveName`}
                              errors={errors}
                              type="text"
                              defaultValue={field.executiveName}
                              label="Executive Name"
                              disabled={true}
                            />
                          )}

                        {role !== "salesTl" &&
                          role !== "salesExecutive" &&
                          role !== "operationsTl" &&
                          role !== "operationsExecutive" && (
                            <button
                              type="button"
                              onClick={() => removeRemark(index)}
                              className="bg-[#dc3545] text-white p-3 rounded-md hover:underline text-xl"
                            >
                              <MdDelete />
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </FieldsCont>

          {/* ---------------------DOCUMENTS----------------- */}
          <div className="main-black-bg p-2 rounded-md my-6 flex justify-between">
            <Heading text="Documents" className="text-white" />

            <button
              type="button"
              className={`main-bg text-white px-4 py-2 rounded text-xl ${
                !isEditable ? "opacity-40" : ""
              }`}
              onClick={() => setDocModal(!docModal)}
            >
              <IoMdAddCircle />
            </button>
          </div>

          <div>
            {/* {uploadedDoc?.files} */}
            {uploadedDoc?.files.map((fileObj) => (
              <p className="flex items-center gap-x-1">
                <FaFile />
                {fileObj.fileName}
              </p>
            ))}
          </div>

          {allDocuments?.length === 0 ? (
            <FieldsCont>
              <p className="text-gray-500 text-center">
                No Documents Available
              </p>
            </FieldsCont>
          ) : (
            <div className="my-5 grid grid-cols-3 gap-3">
              {allDocuments?.map((document, index) => (
                <div key={document.id}>
                  <FieldsCont>
                    <div className="grid grid-cols-1 gap-y-3">
                      <InputField
                        control={control}
                        name={`document.${index}.documentName`}
                        errors={errors}
                        type="text"
                        defaultValue={document.documentName}
                        label="Document Name"
                        disabled="true"
                      />

                      <InputField
                        control={control}
                        name={`document.${index}.documentDate`}
                        errors={errors}
                        type="text"
                        defaultValue={document.documentDate}
                        label="Document Date"
                        disabled="true"
                      />
                      <div className="flex gap-x-2 mt-2">
                        <a
                          href={document.documentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#0a2379] text-white p-3 rounded-md hover:underline text-xl"
                        >
                          <FaFileDownload />
                        </a>
                        {isEditable && (
                          <button
                            type="button"
                            onClick={() => removeAllDocuments(index)}
                            className="bg-[#dc3545] text-white p-3 rounded-md hover:underline text-xl"
                          >
                            <MdDelete />
                          </button>
                        )}
                      </div>
                    </div>
                  </FieldsCont>
                </div>
              ))}
            </div>
          )}

          {/* ---------------------PAYMENTS----------------- */}
          <div className="payment main-black-bg p-2 rounded-md my-6 flex justify-between">
            <Heading text="Payments" className="text-white" />
            {role !== "operationsExecutive" && role !== "operationsTl" && (
              <button
                type="button"
                className={`main-bg text-white px-4 py-2 rounded text-xl ${
                  !isEditable ? "opacity-40" : ""
                }`}
                onClick={() =>
                  appendPayment({
                    transactionId: "",
                    date: "",
                    totalAmount: "",
                    govtFee: "",
                    grossAmount: "",
                    taxRate: "",
                    notes: "",
                  })
                }
              >
                <IoMdAddCircle />
              </button>
            )}
          </div>

          <FieldsCont>
            <div className="">
              {payment?.length === 0 ? (
                <p className="text-gray-500 text-center">
                  No Payment Records Available
                </p>
              ) : (
                payment?.map((payment, index) => {
                  return (
                    <div
                      key={payment.id}
                      className={` ${
                        index >= 1
                          ? "border-t border-black  mb-8 pt-5 mt-8"
                          : ""
                      }`}
                    >
                      <div className="flex gap-2 overflow-x-scroll py-3">
                        <div className="min-w-[200px]">
                          <InputField
                            control={control}
                            name={`payment.${index}.transactionId`}
                            errors={errors}
                            type="text"
                            // required={true}
                            defaultValue={payment?.transactionId}
                            label="Transaction ID"
                            disabled={
                              !isEditable ||
                              (!!payment?.transactionId &&
                                (role === "operationsTl" ||
                                  role === "operationsExecutive" ||
                                  role === "salesTl" ||
                                  role === "salesExecutive"))
                            } //operationsTl CAN'T EDIT
                          />
                        </div>
                        <div className="min-w-[200px]">
                          <InputField
                            control={control}
                            name={`payment.${index}.date`}
                            errors={errors}
                            type="date"
                            defaultValue={payment?.date}
                            label="Payment Date"
                            disabled={
                              !isEditable ||
                              (!!payment?.date &&
                                (role === "operationsTl" ||
                                  role === "operationsExecutive" ||
                                  role === "salesTl" ||
                                  role === "salesExecutive"))
                            }
                          />
                        </div>
                        <div className="min-w-[200px]">
                          <InputField
                            control={control}
                            name={`payment.${index}.totalAmount`}
                            errors={errors}
                            type="number"
                            defaultValue={payment?.totalAmount}
                            label="Total Amount"
                            disabled={
                              !isEditable ||
                              (!!payment?.totalAmount &&
                                (role === "operationsTl" ||
                                  role === "operationsExecutive" ||
                                  role === "salesTl" ||
                                  role === "salesExecutive"))
                            }
                          />
                        </div>
                        <div className="min-w-[200px]">
                          <InputField
                            control={control}
                            name={`payment.${index}.govtFee`}
                            errors={errors}
                            type="number"
                            defaultValue={payment?.govtFee}
                            label="Govt. Fee"
                            disabled={
                              !isEditable ||
                              (!!payment?.govtFee &&
                                (role === "operationsTl" ||
                                  role === "operationsExecutive" ||
                                  role === "salesTl" ||
                                  role === "salesExecutive"))
                            }
                          />
                        </div>
                        <div className="min-w-[200px]">
                          <InputField
                            control={control}
                            name={`payment.${index}.grossAmount`}
                            errors={errors}
                            type="number"
                            defaultValue={payment?.grossAmount}
                            label="Gross Amount"
                            disabled="true"
                          />
                        </div>
                        <div className="min-w-[200px]">
                          <InputField
                            control={control}
                            name={`payment.${index}.taxRate`}
                            errors={errors}
                            type="option"
                            placeholder="Select"
                            options={taxRateOptions}
                            defaultValue={payment?.taxRate}
                            label="Tax Rate"
                            disabled={
                              !isEditable ||
                              (!!payment?.taxRate &&
                                (role === "operationsTl" ||
                                  role === "operationsExecutive" ||
                                  role === "salesTl" ||
                                  role === "salesExecutive"))
                            }
                          />
                        </div>
                        <div className="min-w-[200px]">
                          <InputField
                            control={control}
                            name={`payment.${index}.revenue`}
                            errors={errors}
                            type="text"
                            defaultValue={
                              (Number(payment[index]?.totalAmount || 0) -
                                Number(payment[index]?.govtFee || 0)) /
                              (Number(payment[index]?.taxRate) === 0.18
                                ? 1.18
                                : 1)
                            }
                            label="Revenue"
                            disabled="true"
                          />
                        </div>
                        <div className="min-w-[200px]">
                          <InputField
                            control={control}
                            name={`payment.${index}.paymentMode`}
                            errors={errors}
                            type="option"
                            options={paymentModeOptions}
                            disabled={
                              !isEditable ||
                              (!!payment?.paymentMode &&
                                (role === "operationsTl" ||
                                  role === "operationsExecutive" ||
                                  role === "salesTl" ||
                                  role === "salesExecutive"))
                            }
                            label="Payment Mode"
                          />
                        </div>
                        <div className="min-w-[200px]">
                          <div className="flex items-end gap-x-4">
                            <InputField
                              control={control}
                              name={`payment.${index}.notes`}
                              errors={errors}
                              type="description"
                              defaultValue={payment?.notes}
                              label="Notes"
                              disabled={
                                !isEditable ||
                                (!!payment?.notes &&
                                  (role === "operationsTl" ||
                                    role === "operationsExecutive" ||
                                    role === "salesTl" ||
                                    role === "salesExecutive"))
                              }
                            />
                          </div>
                        </div>
                        {isEditable &&
                          role !== "operationsExecutive" &&
                          role !== "operationsTl" &&
                          role !== "salesTl" &&
                          role !== "salesExecutive" && (
                            <div className="min-w-[120px] flex items-end justify-center">
                              <button
                                type="button"
                                onClick={() => removePayment(index)}
                                className="bg-[#dc3545] text-white p-3 rounded-md hover:underline text-xl"
                              >
                                <MdDelete />
                              </button>
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </FieldsCont>

          {/* ---------------------REFUNDS----------------- */}
          <div className="main-black-bg p-2 rounded-md my-6 flex justify-between">
            <Heading text="Refunds" className="text-white" />
            {role !== "operationsExecutive" && role !== "operationsTl" && (
              <button
                type="button"
                className={`main-bg text-white px-4 py-2 rounded text-xl ${
                  !isEditable ? "opacity-40" : ""
                }`}
                onClick={() =>
                  appendRefundArray({
                    transactionId: "",
                    date: "",
                    amount: "",
                    notes: "",
                  })
                }
              >
                <IoMdAddCircle />
              </button>
            )}
          </div>
          <FieldsCont>
            <div className="">
              {refundArray?.length === 0 ? (
                <p className="text-gray-500 text-center">
                  No Refunds Records Available
                </p>
              ) : (
                refundArray?.map((refund, index) => (
                  <div
                    key={refund._id}
                    className={`mb-8 ${
                      index >= 1 ? "border-t border-black pt-5 my-8" : ""
                    }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4  gap-4">
                      <InputField
                        control={control}
                        name={`refundArray.${index}.transactionId`}
                        errors={errors}
                        type="text"
                        defaultValue={refund.transactionId}
                        label="Transaction ID"
                        disabled={
                          !isEditable ||
                          role === "operationsTl" ||
                          role === "operationsExecutive"
                        }
                      />
                      <InputField
                        control={control}
                        name={`refundArray.${index}.date`}
                        errors={errors}
                        type="date"
                        defaultValue={refund.date}
                        label="Payment Date"
                        disabled={
                          !isEditable ||
                          role === "operationsTl" ||
                          role === "operationsExecutive"
                        }
                      />
                      <InputField
                        control={control}
                        name={`refundArray.${index}.amount`}
                        errors={errors}
                        type="number"
                        defaultValue={refund.amount}
                        label="Amount"
                        disabled={
                          !isEditable ||
                          role === "operationsTl" ||
                          role === "operationsExecutive"
                        }
                      />

                      <div className="flex items-end gap-x-4">
                        <InputField
                          control={control}
                          name={`refundArray.${index}.notes`}
                          errors={errors}
                          type="desc"
                          defaultValue={refund?.notes}
                          label="Note"
                          disabled={
                            !isEditable ||
                            role === "operationsTl" ||
                            role === "operationsExecutive"
                          }
                        />
                        {isEditable && (
                          <button
                            type="button"
                            onClick={() => removeRefundArray(index)}
                            className="bg-[#dc3545] text-white p-3 rounded-md hover:underline text-xl"
                          >
                            <MdDelete />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </FieldsCont>

          {/* ---------------------LEAD FILES----------------- */}
          <div className="main-black-bg p-2 rounded-md my-6 flex justify-between">
            <Heading text="Lead Files" className="text-white" />
            {role !== "operationsExecutive" && role !== "operationsTl" && (
              <button
                type="button"
                className={`main-bg text-white px-4 py-2 rounded text-xl ${
                  !isEditable ? "opacity-40" : ""
                }`}
                onClick={() =>
                  appendLeadFile({
                    note: "",
                    fileUrl: "",
                  })
                }
              >
                <IoMdAddCircle />
              </button>
            )}
          </div>

          <FieldsCont>
            <div className="">
              {leadFiles?.length === 0 ? (
                <p className="text-gray-500 text-center">No Files Uploaded</p>
              ) : (
                leadFiles?.map((file, index) => (
                  <div
                    key={file._id || index}
                    className={`mb-8 ${
                      index >= 1 ? "border-t border-black pt-5 my-8" : ""
                    }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {/* File Name */}
                      <InputField
                        control={control}
                        name={`leadFiles.${index}.note`}
                        errors={errors}
                        type="text"
                        defaultValue={file.note}
                        label="File Name"
                        disabled={
                          !isEditable ||
                          role === "operationsTl" ||
                          role === "operationsExecutive"
                        }
                      />

                      {/* Upload Image */}
                      <InputField
                        control={control}
                        name={`leadFiles.${index}.fileUrl`}
                        errors={errors}
                        type="file"
                        defaultValue={file.fileUrl}
                        label="Upload Image"
                        disabled={
                          !isEditable ||
                          role === "operationsTl" ||
                          role === "operationsExecutive"
                        }
                      />

                      {/* Download Preview Button */}
                      <div className="flex items-end">
                        {file.fileUrl ? (
                          <a
                            href={file.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
                          >
                            Download
                          </a>
                        ) : (
                          <p className="text-sm text-gray-400">No File</p>
                        )}
                      </div>

                      {/* Delete Button */}
                      {isEditable && (
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeLeadFile(index)}
                            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-md text-xl"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </FieldsCont>

          <div className="main-black-bg p-2 rounded-md my-6 flex justify-between">
            <Heading text="All Performa Invoices" className="text-white" />
          </div>
          <div className="bg-[#6b788517] p-5 rounded-lg">
            <AllPerformaInvoices leadId={leadData?._id} />
            {/* <PDFPreviewer /> */}
          </div>

          <div className="main-black-bg p-2 rounded-md my-6 flex justify-between">
            <Heading text="All Tax Invoices" className="text-white" />
          </div>
          <div className="bg-[#6b788517] p-5 rounded-lg">
            <AllTaxInvoices leadId={leadData?._id} />
            {/* <PDFPreviewer /> */}
          </div>

          <div className="flex gap-x-3 gap-y-1 flex-wrap justify-between sticky bottom-1 p-2 main-bg shadow-lg rounded-md mt-3">
            <Button type="submit" disabled={!isEditable}>
              Save
            </Button>
            <div className="flex gap-x-2 gap-y-1 items-center flex-wrap">
              {role !== "operationsTl" && role !== "operationsExecutive" && (
                <MyButton
                  className="bg-black py-2 text-[15px] font-medium px-4"
                  onClick={() => setByeModal(!byeModal)}
                >
                  Bye Bye
                </MyButton>
              )}

              <MyButton
                className="bg-black py-2 text-[15px] font-medium px-4"
                onClick={() => setIsEditable(!isEditable)}
              >
                Edit
              </MyButton>
              {isEditable &&
                role !== "operationsTl" &&
                role !== "operationsExecutive" && (
                  <>
                    {leadData?.manualRenewalLead === true ? null : (
                      <MyButton
                        className="bg-black py-2 text-[15px] font-medium px-4"
                        onClick={handleSubmit(onSubmitWithExtraAPI)}
                      >
                        Save and Move NC Bucket
                      </MyButton>
                    )}
                  </>
                )}
              {leadData?.itIsARenewalLeadForFrontend === true && isEditable && (
                <MyButton
                  className="bg-black py-2 text-[15px] font-medium px-4"
                  onClick={handleSubmit(onSaveAndRemoveFromRenewalPage)}
                >
                  Save and Remove From R.P
                </MyButton>
              )}

              {isEditable &&
                role !== "operationsTl" &&
                role !== "operationsExecutive" && (
                  <>
                    {leadData?.manualRenewalLead === true ? null : (
                      <Button
                        type="button"
                        className="bg-black py-2 text-[15px] font-medium px-4 text-white rounded-md"
                        onClick={() => {
                          // handleSubmit(onSubmitWithExtraAPI);
                          setNcModal(!ncModal);
                        }}
                      >
                        Move NC Bucket
                      </Button>
                    )}
                  </>
                )}
              {role !== "salesTl" &&
                role !== "salesExecutive" &&
                role !== "operationsTl" &&
                role !== "operationsExecutive" && (
                  <MyButton
                    className="bg-black py-2 text-[20px] font-medium px-4"
                    onClick={handleLeadDelete}
                  >
                    <MdDelete />
                  </MyButton>
                )}
            </div>
          </div>
        </form>
      </div>
      <MoveNCModal
        ncModal={ncModal}
        setNcModal={setNcModal}
        leadData={leadData}
      />
      <ByeByeModal open={byeModal} setOpen={setByeModal} leadData={leadData} />
      <DocUploadModal
        showModal={docModal}
        setShowModal={setDocModal}
        setUploadedDoc={setUploadedDoc}
      />
      <AddTaskModal
        showTaskModal={showTaskModal}
        leadData={leadData}
        setShowTaskModal={setShowTaskModal}
      />
      <GeneratePerformaModal
        open={showPerformaModal}
        onClose={() => setShowPerformaModal(false)}
        leadData={leadData}
        services={allServices}
      />
      <GenerateTaxModal
        open={openTaxModal}
        onClose={() => setOpenTaxModal(false)}
        leadData={leadData}
        services={allServices}
      />
    </>
  );
};

export default EditLead;
