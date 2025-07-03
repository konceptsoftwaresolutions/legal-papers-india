import React, { useEffect, useMemo } from "react";

// buttons
import BackButton from "../../components/buttons/BackButton";
import { IoEye } from "react-icons/io5";

// table
import DataTable from "react-data-table-component";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import Heading from "../../common/Heading";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationData } from "../../redux/features/notification";
import usePath from "../../hooks/usePath";
import { getServiceCategoryStatusQuantityTotalLeadsThunkMiddleware } from "../../redux/features/bucket";
import { TiArrowForwardOutline } from "react-icons/ti";

const TotalLeadsStatus = () => {
  const dispatch = useDispatch();
  const path = usePath();

  const { openNCBucketLeads } = useSelector((state) => state.leads);
  const { serviceCategoryStatusQuantityTotalLeads } = useSelector(
    (state) => state.bucket
  );
  // console.log(serviceCategoryStatusQuantityTotalLeads);
  const serviceCategory = useMemo(
    () => path.searchQuary?.[0]?.serviceCategory,
    [path.location]
  );

  const handleRow = (row) => {
    // console.log(row);
    // path.navigate(`/${path.role}/admin-bucket-details`, { state: { row } });
    path.changeEndPoint(
      `total-leads-bucket-view?page=1&serviceCategory=${serviceCategory}&status=${row?.status}`
    );
  };

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
          onClick={() => handleRow(row)} // Call function correctly
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

  useEffect(() => {
    // dispatch(getNotificationData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getServiceCategoryStatusQuantityTotalLeadsThunkMiddleware({
        serviceCategory,
      })
    );
  }, []);

  return (
    <>
      <div className="p-3">
        <div className="flex justify-start main-text items-center gap-x-3">
          <Heading text="Total Leads Bucket Detail" showHeading />
        </div>
        <div className="w-full py-4">
          <DataTable
            columns={columns}
            data={
              serviceCategoryStatusQuantityTotalLeads
                ? serviceCategoryStatusQuantityTotalLeads
                : []
            }
            onRowClicked={handleRow}
            pagination
            customStyles={tableCustomStyles}
            highlightOnHover
          />
        </div>
      </div>
    </>
  );
};

export default TotalLeadsStatus;
