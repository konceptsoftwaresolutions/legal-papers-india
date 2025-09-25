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
    {
      label: "Whatsapp InHouse",
      value: "whatsapp-inhouse",
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
    <div className="p-3 md:p-5 bg-gray-50 min-h-screen">
      {/* Header - Responsive padding */}
      <div className="mb-4 md:mb-6">
        <Heading text="Marketing Analytics" showHeading />
      </div>

      {/* Main Content Layout - Responsive flex direction */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8">
        {/* Campaign Tabs Section - Responsive width */}
        <div className="w-full lg:w-[40%] order-1 lg:order-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-fit lg:sticky lg:top-4">
            <CampaignTabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedCampaign={selectedCampaign}
              setSelectedCampaign={setSelectedCampaign}
            />
          </div>
        </div>

        {/* Campaign Details Section - Responsive width and height */}
        <div className="w-full lg:w-[60%] order-2 lg:order-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-h-[70vh] lg:max-h-[100vh] overflow-y-auto">
            <CampaignDetails campaign={selectedCampaign} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingAnalytics;
