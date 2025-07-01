import React, { useEffect, useState } from "react";
import Heading from "../../common/Heading";
import DataTable from "react-data-table-component";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationData } from "../../redux/features/notification";
import {
  getServiceCategoryQuantityTotalThunkMiddleware,
  getServiceCategoryStatusQuantityTotalThunk,
} from "../../redux/features/bucket";
import usePath from "../../hooks/usePath";
import { IoEye } from "react-icons/io5";

const TotalNCBucketDetails = () => {
  const dispatch = useDispatch();
  const path = usePath();

  useEffect(() => {
    dispatch(getNotificationData());
  }, [dispatch]);
  const { totalNCBucketLeads } = useSelector((state) => state.leads);
  const { serviceCategoryQuantityTotal, totalBucketDetailsPageData } =
    useSelector((state) => state.bucket);
  const [tableData, setTableData] = useState();

  useEffect(() => {
    const serviceCategory = path.searchQuary?.[0]?.serviceCategory;
    dispatch(
      getServiceCategoryStatusQuantityTotalThunk({
        serviceCategory: serviceCategory,
      })
    );
  }, []);

  // table
  const columns = [
    {
      name: "Status",
      selector: (row) => row?.status || "-",
      wrap: true,
    },
    {
      name: "Quantity",
      selector: (row) => row?.count || "-",
      wrap: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => handleRowClick(row)} // Call function correctly
          style={{
            background: "#198754",
            color: "#fff",
            border: "none",
            padding: "10px 10px",
            fontSize: "14px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          <IoEye />
        </button>
      ),
      wrap: true,
      style: { textAlign: "left", paddingLeft: "16px" },
      width: "100px",
    },
  ];

  const handleRowClick = (row) => {
    const serviceCategory = path.searchQuary?.[0]?.serviceCategory;

    console.log(row);
    path.changeEndPoint(
      `total-nc-bucket-view?serviceCategory=${serviceCategory}&page=${1}&status=${
        row.status
      }`
    );
  };

  return (
    <>
      <div className="p-3">
        <div className="flex justify-start main-text items-center gap-x-3">
          <Heading text="Total NC Bucket Leads" showHeading />
        </div>
        <div className="w-full py-4">
          <DataTable
            columns={columns}
            data={totalBucketDetailsPageData ? totalBucketDetailsPageData : []}
            pagination
            customStyles={tableCustomStyles}
            onRowClicked={handleRowClick}
            highlightOnHover
          />
        </div>
      </div>
    </>
  );
};

export default TotalNCBucketDetails;
