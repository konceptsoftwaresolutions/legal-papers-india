// components/pdf/PDFPreviewer.jsx
import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import GeneratePerformaPDF from "./GeneratePerformaPDF";

const dummyFormData = {
  name: "Test Client",
  address: "123 Test Street, Delhi",
  gstNo: "07ABCDE1234F1Z5",
  mobileNumber: "9876543210",
  date: new Date(),
  validUntil: new Date(),
  taxType: "intra",
  selectedServiceData: [
    {
      name: "Service A",
      hsnCode: "9983",
      price: 1000,
      quantity: 2,
      taxPercent: 18,
    },
    {
      name: "Service B",
      hsnCode: "9984",
      price: 1500,
      quantity: 1,
      taxPercent: 18,
    },
    {
      name: "Service C",
      hsnCode: "9985",
      price: 1500,
      quantity: 1,
      taxPercent: 12,
    },
  ],
};

const PDFPreviewer = () => {
  return (
    <div className="h-[90vh] border-2 border-blue-500 my-4">
      <PDFViewer width="100%" height="100%">
        <GeneratePerformaPDF formData={dummyFormData} invoiceNo={12345} />
      </PDFViewer>
    </div>
  );
};

export default PDFPreviewer;
