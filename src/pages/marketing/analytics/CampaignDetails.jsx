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
      <div className="p-4 md:p-6 text-center">
        <div className="py-8 md:py-12">
          <div className="text-gray-400 mb-3">
            <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-gray-500 italic text-sm md:text-base">
            Select a campaign to view details
          </p>
        </div>
      </div>
    );
  }

  const details = Object.entries(campaign).filter(
    ([_, value]) => typeof value !== "object" || Array.isArray(value)
  );

  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "N/A");

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
    <div className="p-4 md:p-6">
      
      {/* Campaign Header */}
      <div className="mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-semibold mb-3 text-indigo-700">
          {campaign?.campaignName && (
            <div className="flex flex-col sm:flex-row sm:gap-2 sm:items-center">
              <span className="font-semibold text-sm md:text-base">
                Campaign Name - {campaign.campaignName}
              </span>
            </div>
          )}
        </h2>
        
        {/* Sent At Info */}
        <div className="bg-gray-50 p-3 md:p-4 rounded-lg border">
          <h3 className="text-sm md:text-base font-semibold text-gray-700">
            Sent At: {formatDate(campaign?.sentAt || campaign?.createdAt)}
          </h3>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="mb-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable
            columns={waTemplateColumnns}
            data={campaign?.leadIds || []}
            noDataComponent={
              <div className="text-center text-gray-500 py-8">
                <p className="text-base md:text-lg">No data to be displayed...</p>
              </div>
            }
            customStyles={{
              ...tableCustomStyles,
              table: {
                style: {
                  minWidth: '100%',
                },
              },
              headRow: {
                style: {
                  backgroundColor: '#f8fafc',
                  minHeight: '48px',
                },
              },
              rows: {
                style: {
                  minHeight: '52px',
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                  },
                },
              },
            }}
            pagination
            paginationPerPage={8}
            paginationRowsPerPageOptions={[5, 8, 10, 15]}
            onRowClicked={handleTemplateNavigation}
            responsive
            highlightOnHover
            pointerOnHover
          />
        </div>
      </div>

      {/* Report Cards Section */}
      <div className="mb-6">
        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-800">
          Campaign Statistics
        </h3>
        
        {/* Mobile: Single Column, Tablet: 2 Columns, Desktop: 3 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          
          <ReportCard
            number={campaign?.skippedCount}
            color={campaign?.color}
            title={"Skipped Count"}
          />
          
          {campaign?.totalRecords && (
            <ReportCard
              number={campaign?.totalRecords}
              color={campaign?.color}
              title={"Total Records"}
            />
          )}
          
          <ReportCard
            number={campaign?.successCount || campaign?.sentCount}
            color={campaign?.color}
            title={"Success Count"}
          />
          
          <ReportCard
            number={campaign?.failedCount}
            color={campaign?.color}
            title={"Failed Count"}
          />
        </div>
      </div>

      {/* Lead Details Section */}
      <div className="bg-gray-50 p-4 md:p-6 rounded-lg border">
        <LeadDetails
          leadData={campaign?.filterObject}
          ending={campaign?.ending}
          starting={campaign?.starting}
        />
      </div>

      {/* Charts Section - Commented */}
      {/* <div className="mt-6">
        <Charts />
      </div> */}
    </div>
  );
};

export default CampaignDetails;
