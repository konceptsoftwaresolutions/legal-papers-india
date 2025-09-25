import React, { useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import CampaignCard from "./CampaignCard";
import { useDispatch } from "react-redux";
import {
  getEmailTemplateLogs,
  getWhatsAppInHouseTemplateLogs,
  getWhatsAppTemplateLogs,
} from "../../../redux/features/marketing";

const CampaignTabs = ({
  tabs,
  activeTab,
  setActiveTab,
  selectedCampaign,
  setSelectedCampaign,
}) => {
  const dispatch = useDispatch();
  const [logsData, setLogsData] = useState();
  const [loading, setLoading] = useState(false);

  const handleTabClick = (label) => {
    console.log("tab clicked", label);
    setLoading(true);

    if (label === "WhatsApp Campaigns") {
      dispatch(
        getWhatsAppTemplateLogs((success, data) => {
          setLoading(false);
          if (success) {
            console.log(data);
            setLogsData(data);
          }
        })
      );
    } else if (label === "Email Campaigns") {
      dispatch(
        getEmailTemplateLogs((success, data) => {
          setLoading(false);
          if (success) {
            console.log(data);
            setLogsData(data);
          }
        })
      );
    } else if (label === "SMS Campaigns") {
      setLoading(false);
      setLogsData();
      console.log("SMS Campaigns tab clicked");
    } else if (label === "Whatsapp InHouse") {
      dispatch(
        getWhatsAppInHouseTemplateLogs((success, data) => {
          setLoading(false);
          if (success) {
            console.log("inhouse", data);
            setLogsData(data);
          }
        })
      );
    }
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onChange={(val) => setActiveTab(val)}>
        {/* Responsive TabsHeader */}
        <div className="overflow-x-auto overflow-y-hidden">
          <TabsHeader
            className="rounded-none border-b border-gray-200 bg-transparent p-0"
            indicatorProps={{
              className:
                "bg-transparent border-b-2 border-blue-500 shadow-none rounded-none",
            }}
          >
            <div className="flex min-w-max">
              {tabs.map(({ label, value }) => (
                <Tab
                  key={value}
                  value={value}
                  onClick={() => handleTabClick(label)}
                  className="whitespace-nowrap px-3 py-2 text-sm font-medium"
                >
                  {/* Mobile: Short labels */}
                  <span className="block sm:hidden">
                    {label === "Email Campaigns"
                      ? "Email"
                      : label === "WhatsApp Campaigns"
                      ? "WhatsApp"
                      : label === "SMS Campaigns"
                      ? "SMS"
                      : label === "Whatsapp InHouse"
                      ? "WA InHouse"
                      : label}
                  </span>
                  {/* Desktop: Full labels */}
                  <span className="hidden sm:block">{label}</span>
                </Tab>
              ))}
            </div>
          </TabsHeader>
        </div>

        {/* Responsive TabsBody */}
        <TabsBody>
          {tabs?.map(({ value }) => (
            <TabPanel key={value} value={value} className="p-0 mt-4">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mb-2"></div>
                    <p className="text-blue-500 text-sm">
                      Loading campaigns...
                    </p>
                  </div>
                </div>
              ) : logsData && logsData.length > 0 ? (
                <div className="min-h-[50vh] md:min-h-[70vh] lg:min-h-[100vh] max-h-[50vh] md:max-h-[70vh] lg:max-h-[100vh] overflow-y-auto pr-2 space-y-3">
                  {logsData?.map((campaign) => (
                    <CampaignCard
                      key={campaign.id || campaign._id}
                      name={campaign?.campaignName || campaign?.name}
                      campaign={campaign}
                      onClick={setSelectedCampaign}
                      date={campaign?.sentAt || campaign?.createdAt}
                      selectedCampaign={selectedCampaign}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <svg
                      className="w-12 h-12 mx-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">
                    No campaigns available.
                  </p>
                </div>
              )}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default CampaignTabs;
