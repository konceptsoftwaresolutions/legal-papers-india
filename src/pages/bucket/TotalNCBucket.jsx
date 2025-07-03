import React, { useEffect } from "react";
import Heading from "../../common/Heading";
import DataTable from "react-data-table-component";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationData } from "../../redux/features/notification";
import { getServiceCategoryQuantityTotalThunkMiddleware } from "../../redux/features/bucket";
import usePath from "../../hooks/usePath";

const TotalNCBucket = () => {
  const dispatch = useDispatch();
  const path = usePath();

  useEffect(() => {
    // dispatch(getNotificationData());
  }, [dispatch]);
  const { totalNCBucketLeads } = useSelector((state) => state.leads);
  const { serviceCategoryQuantityTotal } = useSelector((state) => state.bucket);

  useEffect(() => {
    dispatch(getServiceCategoryQuantityTotalThunkMiddleware());
  }, []);

  // table
  const columns = [
    {
      name: "Service Category",
      selector: (row) => row?.serviceCategory || "-",
      wrap: true,
    },
    {
      name: "Quantity",
      selector: (row) => row?.count || "-",
      wrap: true,
    },
  ];

  const handleRowClick = (row) => {
    // console.log(row);
    path.changeEndPoint(
      `total-bucket-details?serviceCategory=${row?.serviceCategory}`
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
            data={
              serviceCategoryQuantityTotal ? serviceCategoryQuantityTotal : []
            }
            pagination
            customStyles={tableCustomStyles}
            onRowClicked={handleRowClick}
            highlightOnHover
            paginationPerPage={30}
            paginationRowsPerPageOptions={[30]}
          />
        </div>
      </div>
    </>
  );
};

export default TotalNCBucket;
