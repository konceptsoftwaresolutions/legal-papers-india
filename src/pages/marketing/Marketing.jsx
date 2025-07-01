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

  return (
    <>
      <div className="grid grid-cols-2 p-5">
        <Heading text="Marketings" showHeading />
      </div>
      <div className="grid grid-cols-3 gap-4 p-5">
        <div
          className="flex items-center justify-center bg-green-500 text-white p-6 py-10 rounded-lg cursor-pointer hover:bg-green-600 transition"
          onClick={handleSmsNavigation}
        >
          <FaSms size={30} />
          <span className="ml-2">SMS</span>
        </div>

        <div
          className="flex items-center justify-center bg-blue-500 text-white p-6 py-10 rounded-lg cursor-pointer hover:bg-blue-600 transition"
          onClick={handleEmailNavigation}
        >
          <MdEmail size={30} />
          <span className="ml-2">Email</span>
        </div>

        <div
          className="flex items-center justify-center bg-green-600 text-white p-6 py-10 rounded-lg cursor-pointer hover:bg-green-700 transition"
          onClick={handleWhatsappNavigation}
        >
          <FaWhatsapp size={30} />
          <span className="ml-2">WhatsApp</span>
        </div>
      </div>
      {/* <div className="p-5">
        <CampaignTabs />
      </div> */}
    </>
  );
};

export default Marketing;
