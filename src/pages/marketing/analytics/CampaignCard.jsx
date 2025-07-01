import React from "react";

const CampaignCard = ({ campaign, onClick, selectedCampaign, name, date }) => {
  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "N/A");

  const status = campaign.campaignStatus || campaign.status || "N/A";

  const isActive = selectedCampaign?._id === campaign._id;

  return (
    <div
      className={`border rounded-lg p-4 shadow-sm mb-3 cursor-pointer transition ${
        isActive
          ? "main-bg text-white"
          : "bg-white hover:bg-gray-100 text-black"
      }`}
      onClick={() => onClick(campaign)}
    >
      <div
        className={`font-semibold ${
          isActive ? "text-white" : "text-indigo-700"
        }`}
      >
        Campaign Name: {name}
      </div>
      {/* <div className="text-sm">
        Status:{" "}
        <span
          className={`font-semibold ${
            isActive
              ? "text-white"
              : status === "completed"
              ? "text-green-600"
              : "text-yellow-600"
          }`}
        >
          {status}
        </span>
      </div> */}
      <div className={`text-sm ${isActive ? "text-white" : "text-gray-500"}`}>
        Date: {formatDate(date)}
      </div>
    </div>
  );
};

export default CampaignCard;
