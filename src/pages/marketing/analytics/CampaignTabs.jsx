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

  const handleTabClick = (label) => {
    console.log("tab clicked", label);

    if (label === "WhatsApp Campaigns") {
      dispatch(
        getWhatsAppTemplateLogs((success, data) => {
          if (success) {
            console.log(data);
            setLogsData(data);
          }
        })
      );
    } else if (label === "Email Campaigns") {
      dispatch(
        getEmailTemplateLogs((success, data) => {
          if (success) {
            console.log(data);
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
        {tabs?.map(({ value, data }) => (
          <TabPanel key={value} value={value}>
            {logsData && logsData.length > 0 ? (
              <div className=" min-h-[100vh] max-h-[100vh] overflow-y-scroll pr-2">
                {logsData?.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    name={campaign?.campaignName}
                    campaign={campaign}
                    onClick={setSelectedCampaign}
                    date={campaign?.sentAt}
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
