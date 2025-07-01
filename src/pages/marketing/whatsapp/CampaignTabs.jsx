import React from "react";
import { Tabs } from "antd";
import "./Tab.css";
import { MdDelete } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { IoEye } from "react-icons/io5";

// Custom components for each tab
const CampaignOverview = () => (
  <div>
    <div className="border-violet-500 border-[1px] p-3 rounded-md hover:bg-violet-100 cursor-pointer">
      <div className="flex justify-between">
        <p className="text-base font-semibold">Campaign Name</p>
        <p className="flex justify-end gap-3">
          <IoEye size={20} className="cursor-pointer" />
          <MdDelete size={20} className="cursor-pointer" />
        </p>
      </div>
      <div className="flex justify-between border-t mt-3 pt-3 border-violet-500">
        <p>
          <span className="flex">
            <FaUserCircle size={20} /> &nbsp; Legal Papers
          </span>
        </p>
        <p>Date- 20-05-2025</p>
      </div>
    </div>
  </div>
);
const CampaignAnalytics = () => <div>📈 Email Content</div>;
const CampaignSettings = () => <div>⚙️ Whatsapp Content</div>;

const CampaignTabs = () => {
  const onChange = (key) => {
    console.log("Active tab key:", key);
  };

  const items = [
    {
      label: "SMS",
      key: "overview",
      children: (
        <div
          style={{
            border: "1px solid #d9d9d9",
            padding: "16px",
            borderRadius: "0 0 8px 8px",
          }}
        >
          <CampaignOverview />
        </div>
      ),
    },
    {
      label: "Email",
      key: "analytics",
      children: (
        <div
          style={{
            border: "1px solid #d9d9d9",
            padding: "16px",
            borderRadius: "0 0 8px 8px",
          }}
        >
          <CampaignAnalytics />
        </div>
      ),
    },
    {
      label: "Whatsapp",
      key: "settings",
      children: (
        <div
          style={{
            border: "1px solid #d9d9d9",
            padding: "16px",
            borderRadius: "0 0 8px 8px",
          }}
        >
          <CampaignSettings />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Tabs
        onChange={onChange}
        type="card"
        items={items}
        className="custom-tabs"
      />
    </div>
  );
};

export default CampaignTabs;
