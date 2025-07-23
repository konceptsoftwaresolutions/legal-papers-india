import React, { useState, useEffect } from "react";
import Heading from "../../common/Heading";
import MyButton from "../../components/buttons/MyButton";
import InvoiceModal from "./InvoiceModal"; // Adjust path as needed
import { useDispatch, useSelector } from "react-redux";
import {
  getInvoiceSettings,
  setInvoiceSettings,
} from "../../redux/features/performa";

const PerformaInvoiceNo = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [startFrom, setStartFrom] = useState("");
  const [currentInvoiceNo, setCurrentInvoiceNo] = useState("");

  // Get existing invoice settings from backend on mount
  useEffect(() => {
    dispatch(
      getInvoiceSettings("performa", (success, data) => {
        if (success) {
          setStartFrom(data?.startFrom?.toString() || "1");
          setCurrentInvoiceNo(data?.invoiceNo || "1");
        } else {
          setStartFrom("1");
          setCurrentInvoiceNo("1");
        }
      })
    );
  }, [dispatch]);

  const handleSave = () => {
    dispatch(setInvoiceSettings({ startFrom, module: "performa" }));
    setShowModal(false);
  };

  return (
    <>
      <div className="flex flex-col w-full px-4 gap-y-4 py-5">
        <div className="grid grid-cols-2">
          <Heading text="Generate Performa Invoice" showHeading />
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
      <InvoiceModal
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

export default PerformaInvoiceNo;
