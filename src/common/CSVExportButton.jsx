import React from "react";
import * as XLSX from "xlsx";
import MyButton from "../components/buttons/MyButton";
import { BiExport } from "react-icons/bi";

function flattenObject(ob) {
  var toReturn = {};

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == "object" && ob[i] !== null) {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + "." + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}

function downloadXLSX(array, filename) {
  console.log(array);
  const flattenedArray = array.map((item) => flattenObject(item));

  const worksheet = XLSX.utils.json_to_sheet(flattenedArray);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

const CSVExportButton = ({ data, filename }) => {
  return (
    // <button
    //   onClick={() => downloadXLSX(data, filename)}
    //   className="btn btn-primary px-3 py-2 fw-bold border-0"
    // >
    //   Export
    // </button>
    <MyButton
      className="main-bg py-2 flex justify-center items-center text-[15px] font-medium px-4 gap-x-1"
      onClick={() => downloadXLSX(data, filename)}
      // onClick={openFilter}
    >
      <BiExport size={16} className="rotate-90" />
      <span>Export</span>
    </MyButton>
  );
};

export default CSVExportButton;
