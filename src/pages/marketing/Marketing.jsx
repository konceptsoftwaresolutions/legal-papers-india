import React from "react";
import Heading from "../../common/Heading";
import { MdEmail } from "react-icons/md";
import { FaSms } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CampaignTabs from "./whatsapp/CampaignTabs";

const Marketing = () => {
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);

  const handleEmailNavigation = () => {
    navigate(`/${role}/emailcampaign`);
  };

  const handleSmsNavigation = () => {
    navigate(`/${role}/smscampaign`);
  };

  const handleWhatsappNavigation = () => {
    navigate(`/${role}/whatsappcampaign`);
  };

  const handleWhatsappInHouseNavigation = () => {
    navigate(`/${role}/whatsapp-inhouse`);
  };

  return (
    <>
      {/* Header Section */}
      <div className="p-3 md:p-5">
        <div className="mb-4 md:mb-0">
          <Heading text="Marketings" showHeading />
        </div>
      </div>

      {/* Marketing Cards Grid */}
      <div className="p-3 md:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {/* SMS Card */}
          <div
            className="flex flex-col sm:flex-row lg:flex-col items-center justify-center bg-green-500 text-white p-4 sm:p-6 lg:p-6 py-8 sm:py-10 lg:py-10 rounded-lg cursor-pointer hover:bg-green-600 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
            onClick={handleSmsNavigation}
          >
            <FaSms size={30} className="mb-2 sm:mb-0 sm:mr-3 lg:mb-2 lg:mr-0" />
            <span className="text-center sm:text-left lg:text-center font-medium">
              SMS
            </span>
          </div>

          {/* Email Card */}
          <div
            className="flex flex-col sm:flex-row lg:flex-col items-center justify-center bg-blue-500 text-white p-4 sm:p-6 lg:p-6 py-8 sm:py-10 lg:py-10 rounded-lg cursor-pointer hover:bg-blue-600 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
            onClick={handleEmailNavigation}
          >
            <MdEmail
              size={30}
              className="mb-2 sm:mb-0 sm:mr-3 lg:mb-2 lg:mr-0"
            />
            <span className="text-center sm:text-left lg:text-center font-medium">
              Email
            </span>
          </div>

          {/* WhatsApp Card */}
          <div
            className="flex flex-col sm:flex-row lg:flex-col items-center justify-center bg-green-600 text-white p-4 sm:p-6 lg:p-6 py-8 sm:py-10 lg:py-10 rounded-lg cursor-pointer hover:bg-green-700 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
            onClick={handleWhatsappNavigation}
          >
            <FaWhatsapp
              size={30}
              className="mb-2 sm:mb-0 sm:mr-3 lg:mb-2 lg:mr-0"
            />
            <span className="text-center sm:text-left lg:text-center font-medium">
              WhatsApp
            </span>
          </div>

          {/* WhatsApp In House Card */}
          <div
            className="flex flex-col sm:flex-row lg:flex-col items-center justify-center bg-green-600 text-white p-4 sm:p-6 lg:p-6 py-8 sm:py-10 lg:py-10 rounded-lg cursor-pointer hover:bg-green-700 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 sm:col-span-2 lg:col-span-1"
            onClick={handleWhatsappInHouseNavigation}
          >
            <FaWhatsapp
              size={30}
              className="mb-2 sm:mb-0 sm:mr-3 lg:mb-2 lg:mr-0"
            />
            <span className="text-center sm:text-left lg:text-center font-medium">
              WhatsApp In House
            </span>
          </div>
        </div>
      </div>

      {/* Commented Campaign Tabs - Preserved */}
      {/* <div className="p-5">
        <CampaignTabs />
      </div> */}
    </>
  );
};

export default Marketing;
