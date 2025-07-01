import React from "react";

const ReportCard = ({ color, title, number, total }) => {
  return (
    <div className="bg-white rounded-md border w-full border-slate-200 shadow-md p-4">
      <h2 className="uppercase text-slate-900 font-bold text-[15px] mb-2 border-b-[1px]">
        {title}
      </h2>
      <p className="text-lg font-semibold text-gray-800">Value: {number}</p>
      {total !== undefined && (
        <p className="text-sm text-gray-600">Total: {total}</p>
      )}
      {color && (
        <p className="text-sm mt-2 text-gray-500">Color: {color}</p>
      )}
    </div>
  );
};

export default ReportCard;
