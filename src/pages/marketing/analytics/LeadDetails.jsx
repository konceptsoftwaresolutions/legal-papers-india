import React from "react";

const LeadDetails = ({ leadData , ending ,starting}) => {
  if (!leadData) return null;

  return (
    <div className="p-5 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Lead Details</h2>

      <div className="space-y-2 text-sm">
        {leadData.leadId && (
          <p>
            <strong>Lead ID:</strong> {leadData.leadId}
          </p>
        )}
        {leadData.emailId && (
          <p>
            <strong>Email:</strong> {leadData.emailId}
          </p>
        )}
        {leadData.mobileNumber && (
          <p>
            <strong>Mobile:</strong> {leadData.mobileNumber}
          </p>
        )}
        {leadData.freshOrFollow && (
          <p>
            <strong>Fresh/Follow:</strong> {leadData.freshOrFollow}
          </p>
        )}

        {Array.isArray(leadData.user) && leadData.user.length > 0 && (
          <RenderArray label="Users Involved" data={leadData.user} />
        )}
        {Array.isArray(leadData.status) && leadData.status.length > 0 && (
          <RenderArray label="Status" data={leadData.status} />
        )}
        {Array.isArray(leadData.operationStatus) &&
          leadData.operationStatus.length > 0 && (
            <RenderArray
              label="Operation Status"
              data={leadData.operationStatus}
            />
          )}
        {Array.isArray(leadData.leadSource) &&
          leadData.leadSource.length > 0 && (
            <RenderArray label="Lead Source" data={leadData.leadSource} />
          )}
        {Array.isArray(leadData.serviceCategory) &&
          leadData.serviceCategory.length > 0 && (
            <RenderArray
              label="Service Category"
              data={leadData.serviceCategory}
            />
          )}
        {Array.isArray(leadData.applicationType) &&
          leadData.applicationType.length > 0 && (
            <RenderArray
              label="Application Type"
              data={leadData.applicationType}
            />
          )}
        {Array.isArray(leadData.paymentMode) &&
          leadData.paymentMode.length > 0 && (
            <RenderArray label="Payment Mode" data={leadData.paymentMode} />
          )}

        {leadData.date && (
          <p>
            <strong>Lead Date:</strong> {leadData.date}
          </p>
        )}
        {(leadData.fromDate || leadData.toDate) && (
          <p>
            <strong>Lead Date Range:</strong> {leadData.fromDate} to{" "}
            {leadData.toDate}
          </p>
        )}
        {leadData.paymentDate && (
          <p>
            <strong>Payment Date:</strong> {leadData.paymentDate}
          </p>
        )}
        {(leadData.paymentFromDate || leadData.paymentToDate) && (
          <p>
            <strong>Payment Date Range:</strong> {leadData.paymentFromDate} to{" "}
            {leadData.paymentToDate}
          </p>
        )}

        <p>
          <strong>Important:</strong> {leadData.important ? "Yes" : "No"}
        </p>
        <p>
          <strong>Refund:</strong> {leadData.refund ? "Yes" : "No"}
        </p>
        <p>
          <strong>Manual Renewal Lead:</strong>{" "}
          {leadData.manualRenewalLead ? "Yes" : "No"}
        </p>
        <p>
          <strong>IEC Renewal Lead:</strong>{" "}
          {leadData.iecRenewalLead ? "Yes" : "No"}
        </p>
        <p>
          <strong>Exclude IEC Renewal Lead:</strong>{" "}
          {leadData.excludeIecRenewalLead ? "Yes" : "No"}
        </p>

        <p>
          <strong>Ending:</strong>{" "}
          {ending}
        </p>
        <p>
          <strong>Starting:</strong>{" "}
          {starting}
        </p>

      </div>
    </div>
  );
};

const RenderArray = ({ label, data }) => (
  <div>
    <strong>{label}:</strong>
    <ul className="list-disc ml-6">
      {data.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  </div>
);

export default LeadDetails;
