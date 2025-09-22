// components/pdf/PDFPreviewer.jsx
import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import GeneratePerformaPDF from "./GeneratePerformaPDF";
import GenerateTaxPDF from "./GenerateTaxPDF";

const dummyFormData = {
  leadId: "68b7db1e4d6202c2aab44276",
  name: "testing-Dipesh Sharma(do not delete)",
  mobileNumber: "9818525179",
  address: "<p>adarsh nagar</p>",
  addressDropdown:
    "<h2><strong>LPI</strong></h2><p>B-768, Street 8, Mukandpur, New Delhi 110042</p><p>Contact: 9315247392</p><p>Email: info@legalpapersindia.com</p><p>Website: www.legalpapersindia.com</p><p>GSTIN: 07BRPPB7333A1Z3</p>",
  gstNo: "test13452",
  taxType: "intra", // intra | inter
  placeOfSupply: "07-Delhi",
  date: "2025-09-19",
  validUntil: "2025-09-19",
  invoiceNo: "LPI2025-37",
  discount: 200, // discount total
  services: [
    {
      _id: "689d91c24f6f9f350edc531f",
      name: "amit",
      hsnCode: "2132",
      quantity: 1,
      price: 1856.77, // ✅ Round off के लिए decimal price
      taxPercent: 18, // ✅ Add करें अगर missing है
      baseAmount: 1856.78,
    },
  ],
  totals: {
    taxableValue: 1656.78, // after discount
    totalTax: 298.22, // GST
    invoiceTotal: 1955, // rounded final
  },
  termsAndConditions: "<p>testings</p>",
};

const PDFPreviewer = () => {
  return (
    <div className="h-[90vh] border-2 border-blue-500 my-4">
      <PDFViewer width="100%" height="100%">
        <GeneratePerformaPDF formData={dummyFormData} invoiceNo={12345} />
        {/* <GenerateTaxPDF formData={dummyFormData} invoiceNo={483} /> */}
      </PDFViewer>
    </div>
  );
};

export default PDFPreviewer;
