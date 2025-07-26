import React, { useState, useEffect } from "react";
import Heading from "../../common/Heading";
import MyButton from "../../components/buttons/MyButton";
import TaxInvoiceModal from "./TaxInvoiceModal"; // Adjust path if needed

const TaxInvoiceNo = () => {
  const [showModal, setShowModal] = useState(false);
  const [startFrom, setStartFrom] = useState("1");
  const [currentInvoiceNo, setCurrentInvoiceNo] = useState("1");

  useEffect(() => {
    // Simulate getting values from localStorage or defaults
    const savedStartFrom = localStorage.getItem("tax_startFrom") || "1";
    const savedCurrentNo = localStorage.getItem("tax_invoiceNo") || "1";

    setStartFrom(savedStartFrom);
    setCurrentInvoiceNo(savedCurrentNo);
  }, []);

  const handleSave = () => {
    localStorage.setItem("tax_startFrom", startFrom);
    localStorage.setItem("tax_invoiceNo", startFrom); // reset current to startFrom
    setCurrentInvoiceNo(startFrom);
    setShowModal(false);
  };

  return (
    <>
      <div className="flex flex-col w-full px-4 gap-y-4 py-5">
        <div className="grid grid-cols-2">
          <Heading text="Generate Tax Invoice" showHeading />
        </div>

        <div className="w-full flex justify-end items-start gap-2 flex-wrap">
          <MyButton
            className="main-bg py-2 text-[15px] font-medium px-4"
            onClick={() => setShowModal(true)}
          >
            Invoice No
          </MyButton>
        </div>
      </div>

      {/* Modal */}
      <TaxInvoiceModal
        open={showModal}
        onClose={() => setShowModal(false)}
        currentInvoiceNo={currentInvoiceNo}
        startFrom={startFrom}
        setStartFrom={setStartFrom}
        onSave={handleSave}
      />
    </>
  );
};

export default TaxInvoiceNo;
