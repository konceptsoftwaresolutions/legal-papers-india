import React, { useEffect, useState } from "react";
import Heading from "../../../common/Heading";
import CampaignTabs from "./CampaignTabs";
import CampaignDetails from "./CampaignDetails";
import { dummyData } from "./dummyData";
import { useDispatch } from "react-redux";
import {
  getSingleEmailCampaignLogs,
  getSingleWhatsAppCampaignLogs,
} from "../../../redux/features/marketing";

const MarketingAnalytics = () => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [activeTab, setActiveTab] = useState("email");
  const dispatch = useDispatch();
  const tabs = [
    {
      label: "Email Campaigns",
      value: "email",
      data: dummyData.insideEmailCampaign,
    },
    {
      label: "WhatsApp Campaigns",
      value: "whatsapp",
      data: dummyData.insideWhatsappCampaign,
    },
    {
      label: "SMS Campaigns",
      value: "sms",
      data: dummyData.insideSmsCampaigns,
    },
  ];

  useEffect(() => {
    if (selectedCampaign) {
      const type = selectedCampaign?.type;
      const id = selectedCampaign?._id;
      console.log(selectedCampaign);

      // dispatch(getSingleEmailCampaignLogs(id));
    }
  }, [selectedCampaign]);

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <Heading text="Marketing Analytics" showHeading />
      <div className="mt-6 flex flex-row gap-8">
        <div className="w-[40%]">
          <CampaignTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedCampaign={selectedCampaign}
            setSelectedCampaign={setSelectedCampaign}
          />
        </div>
        <div className="w-[60%] max-h-[100vh] overflow-y-scroll">
          <CampaignDetails campaign={selectedCampaign} />
        </div>
      </div>
    </div>
  );
};

export default MarketingAnalytics;
