import React, { useEffect, useMemo } from "react";

// buttons
import BackButton from "../../components/buttons/BackButton";

// table
import DataTable from "react-data-table-component";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import Heading from "../../common/Heading";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationData } from "../../redux/features/notification";
import usePath from "../../hooks/usePath";
import { getServiceCategoryStatusQuantityTotalLeadsThunkMiddleware } from "../../redux/features/bucket";

const TotalLeadsBucketDetails = () => {
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
  ];

  const handleRow = (row) => {
    // console.log(row);
    // path.navigate(`/${path.role}/admin-bucket-details`, { state: { row } });
    path.changeEndPoint(
      `total-nc-bucket-view?page=1&serviceCategory=${serviceCategory}&status=${row?.status}`
    );
  };

  useEffect(() => {
    dispatch(getNotificationData());
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
          <Heading text="Total Leads Bucket Details" showHeading />
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

export default TotalLeadsBucketDetails;
