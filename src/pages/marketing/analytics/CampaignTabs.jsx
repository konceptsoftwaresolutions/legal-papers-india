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
  const [loading, setLoading] = useState(false); // ✅ loading state

  const handleTabClick = (label) => {
    console.log("tab clicked", label);
    setLoading(true); // ✅ jab bhi tab click hoga loading start

    if (label === "WhatsApp Campaigns") {
      dispatch(
        getWhatsAppTemplateLogs((success, data) => {
          setLoading(false); // ✅ API complete hone ke baad loading false
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
    <Tabs value={activeTab} onChange={(val) => setActiveTab(val)}>
      <TabsHeader>
        {tabs.map(({ label, value }) => (
          <Tab key={value} value={value} onClick={() => handleTabClick(label)}>
            {label}
          </Tab>
        ))}
      </TabsHeader>

      <TabsBody>
        {tabs?.map(({ value }) => (
          <TabPanel key={value} value={value}>
            {loading ? (
              <p className="text-blue-500">Loading campaigns...</p> // ✅ loader text
            ) : logsData && logsData.length > 0 ? (
              <div className="min-h-[100vh] max-h-[100vh] overflow-y-scroll pr-2">
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
              <p className="text-gray-500">No campaigns available.</p>
            )}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
};

export default CampaignTabs;
