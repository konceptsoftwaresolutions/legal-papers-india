import React from "react";
import Charts from "./charts/Charts";
import ReportCard from "./ReportCard";
import DataTable from "react-data-table-component";
import { waTemplateColumnns } from "../../user/columns";
import { tableCustomStyles } from "../../../constants/tableCustomStyle";
import { useSelector } from "react-redux";
import LeadDetails from "./LeadDetails";

const CampaignDetails = ({ campaign }) => {
  if (!campaign) {
    return (
      <p className="text-gray-500 italic">Select a campaign to view details</p>
    );
  }

  const details = Object.entries(campaign).filter(
    ([_, value]) => typeof value !== "object" || Array.isArray(value)
  );

  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "N/A");
  [
    {
      number: 8,
      title: "Total",
      color: "blue",
    },
    {
      number: 9,
      title: "Sent",
      color: "lightgreen",
    },
    {
      number: 12,
      title: "Delivered",
      color: "green",
    },
    {
      number: 0,
      title: "Failed",
      color: "red",
    },
    {
      number: 15,
      title: "Read",
      color: "blue",
    },
    {
      number: 2,
      title: "Invalid Number",
      color: "red",
    },
  ];

  const DataArray = [
    {
      number: 8,
      title: "Total",
      color: "blue",
    },
    {
      number: 0,
      title: "Sent",
      color: "lightgreen",
    },
    {
      number: 0,
      title: "Delivered",
      color: "green",
    },
    {
      number: 0,
      title: "Failed",
      color: "red",
    },
    {
      number: 0,
      title: "Read",
      color: "blue",
    },
    {
      number: 2,
      title: "Invalid Number",
      color: "red",
    },
  ];

  const { role } = useSelector((state) => state.auth);

  const handleTemplateNavigation = (row) => {
    const url = `/${role}/editlead?leadId=${row.leadId}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h2 className="text-lg font-semibold mb-3 text-indigo-700">
        Campaign Name - {campaign?.campaignName}
      </h2>
      <div className="w-full flex justify-between font-poppins font-medium not-italic leading-normal items-center  mb-3">
        <div className="flex justify-center  items-center">
          <h2 className="text-[18px] font-semibold">
            Sent At: {formatDate(campaign?.sentAt)}
          </h2>
        </div>
      </div>

      <DataTable
        columns={waTemplateColumnns}
        data={campaign?.leadIds}
        noDataComponent={
          <p className="text-center text-gray-500 text-lg p-3">
            No data to be displayed...
          </p>
        }
        customStyles={tableCustomStyles}
        pagination
        paginationPerPage={8}
        onRowClicked={handleTemplateNavigation}
      />
      <div className="grid grid-cols-3 gap-3">
        <ReportCard
          // key={index}
          number={campaign?.skippedCount}
          color={campaign?.color}
          title={"Skipped Count"}
        />
        <ReportCard
          // key={index}
          number={campaign?.successCount}
          color={campaign?.color}
          title={"Success Count"}
        />
        <ReportCard
          // key={index}
          number={campaign?.failedCount}
          color={campaign?.color}
          title={"Failed Count"}
        />
      </div>
      <LeadDetails
        leadData={campaign?.filterObject}
        ending={campaign?.ending}
        starting={campaign?.starting}
      />

      {/* <Charts /> */}
    </div>
  );
};

export default CampaignDetails;
