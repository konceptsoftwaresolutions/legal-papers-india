import React, { useEffect, useMemo, useState } from "react";
import usePath from "../../hooks/usePath";
import { useDispatch, useSelector } from "react-redux";
import { getServiceCategoryStatusQuantityThreeMonthsThunkMiddleware } from "../../redux/features/bucket";
import MyButton from "../../components/buttons/MyButton";
import { IoEye } from "react-icons/io5";
import Heading from "../../common/Heading";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import DataTable from "react-data-table-component";
import { Select } from "antd";
import { TiArrowForwardOutline } from "react-icons/ti";
import {
  adminBucketNCLeadShare,
  getAllSalesExecutivesThunkMiddleware,
} from "../../redux/features/leads";
import toastify from "../../constants/toastify";
import { useLocation } from "react-router-dom";

const AdminBucketDetailsThreeMonths = () => {
  const path = usePath();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serviceCategoryParams = queryParams.get("serviceCategory");
  console.log(location);
  const dispatch = useDispatch();
  const { serviceCategoryStatusQuantityThreeMonths } = useSelector(
    (state) => state.bucket
  );
  const { allSalesExecutive } = useSelector((state) => state.leads);

  // State to manage row-specific input and select values
  const [rowState, setRowState] = useState({});

  const convertOptions = (data) => {
    if (!Array.isArray(data)) return [{ label: "Select an option", value: "" }];

    return [
      { label: "Select an option", value: "" },
      ...data.map((item) => ({
        label: item?.name,
        value: item?.name,
      })),
    ];
  };

  const salesExecutiveOptions = useMemo(() => {
    return convertOptions(allSalesExecutive);
  }, [allSalesExecutive]);

  useEffect(() => {
    const serviceCategory = path.searchQuary?.[0]?.serviceCategory;
    console.log(serviceCategory);
    dispatch(
      getServiceCategoryStatusQuantityThreeMonthsThunkMiddleware(
        serviceCategory
      )
    );
    dispatch(getAllSalesExecutivesThunkMiddleware());
  }, [location]);

  const [inputValues, setInputValues] = useState({});
  const [selectedExecutives, setSelectedExecutives] = useState({});

  const handleInputChange = (rowId, value) => {
    setInputValues((prev) => ({ ...prev, [rowId]: value }));
  };

  const handleSelectChange = (rowId, selectedOption) => {
    setSelectedExecutives((prev) => ({ ...prev, [rowId]: selectedOption }));
  };

  const handleShare = (row) => {
    const rowId = row?.id || row?.status;
    const inputValue = inputValues[rowId] || "";
    const selectedExecutive = selectedExecutives[rowId];
    const sharedData = {
      serviceCategory: serviceCategoryParams,
      status: row?.status || "N/A",
      quantity: inputValue || 0,
      // inputValue:  || "",
      userName: selectedExecutive || "",
    };
    console.log(sharedData);
    dispatch(adminBucketNCLeadShare(sharedData));
  };

  // const handleShare = (row) => {
  //   try {
  //     const rowId = row?.id || row?.status; // Unique identifier for each row
  //     const rowData = rowState[rowId];

  //     if (!rowData) {
  //       toastify({ msg: "No data for this row.", type: "error" });
  //       return;
  //     }

  //     // Validate: Ensure one of the fields is filled
  //     if (!rowData.inputValue && !rowData.selectValue) {
  //       toastify({
  //         msg: "Both input and select fields are empty.",
  //         type: "error",
  //       });
  //       return;
  //     }

  //     // Combine row data
  //     const sharedData = {
  //       status: row?.status || "N/A",
  //       quantity: row?.count || 0,
  //       inputValue: rowData?.inputValue || "",
  //       selectValue: rowData?.selectValue || "",
  //     };

  //     console.log("Shared Data:", sharedData);

  //     // Perform your logic here (e.g., send data to an API)
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const handleOpen = (row) => {
    console.log(row);
    console.log(path);
    const serviceCategory = path.searchQuary?.[0]?.serviceCategory;
    path.changeEndPoint(
      `nc-bucket-share-by-selecting-3-months?page=${1}&serviceCategory=${serviceCategory}&status=${
        row?.status
      }`
    );
  };

  const columns = [
    {
      name: "Status",
      selector: (row) => row?.status || "-",
      wrap: true,
    },
    {
      name: "Quantity",
      selector: (row) => row?.count || "-",
    },
    {
      name: "Share by selecting",
      cell: (row) => (
        <MyButton
          className="bg-blue-700 py-2 px-3"
          onClick={() => handleOpen(row)}
        >
          <IoEye size={18} />
        </MyButton>
      ),
    },
    {
      name: "Action",
      cell: (row) => {
        const rowId = row?.id || row?.status;
        return (
          <input
            className="outline-none border border-solid border-slate-800 disabled:bg-gray-100 disabled:cursor-not-allowed w-full rounded-md p-1"
            value={inputValues[rowId] || ""}
            onChange={(e) => handleInputChange(rowId, e.target.value)}
          />
        );
      },
      width: "200px",
    },
    {
      name: "SalesExecutive",
      cell: (row) => {
        const rowId = row?.id || row?.status;
        return (
          <Select
            placeholder="Select a option"
            options={salesExecutiveOptions}
            value={selectedExecutives[rowId] || null}
            onChange={(option) => handleSelectChange(rowId, option)}
            className="w-full my-select-field"
          />
        );
      },
      width: "200px",
    },
    {
      name: "Share",
      cell: (row) => (
        <MyButton
          className="bg-green-700 py-2 px-3"
          onClick={() => handleShare(row)}
        >
          <TiArrowForwardOutline size={18} />
          sdfdsf
        </MyButton>
      ),
    },
  ];

  return (
    <div className="p-3">
      <div className="flex justify-start main-text items-center gap-x-3">
        <Heading text="Admin Bucket Details" showHeading />
      </div>
      <div className="w-full py-4">
        <DataTable
          columns={columns}
          data={
            serviceCategoryStatusQuantityThreeMonths
              ? serviceCategoryStatusQuantityThreeMonths
              : []
          }
          pagination
          customStyles={tableCustomStyles}
        />
      </div>
    </div>
  );
};

export default AdminBucketDetailsThreeMonths;
