import React, { useEffect } from "react";
import Heading from "../../common/Heading";
import DataTable from "react-data-table-component";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationData } from "../../redux/features/notification";
import { getServiceCategoryQuantityTotalLeadsThunkMiddleware } from "../../redux/features/bucket";
import usePath from "../../hooks/usePath";

const TotalLeads = () => {

  const dispatch = useDispatch();
  const path = usePath();

  useEffect( () => {
    // dispatch(getNotificationData());
  } , [dispatch])

  const { totalBucketLeads } = useSelector((state) => state.leads);
  const { serviceCategoryQuantityTotalLeads } = useSelector(state => state.bucket);

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

  useEffect(() => {
    dispatch(getServiceCategoryQuantityTotalLeadsThunkMiddleware());
  }, []);

  const handleRow = (row) => {
    path.changeEndPoint(`total-leads-status?serviceCategory=${row?.serviceCategory}`);
  }

  return (
    <>
      <div className="p-3">
        <div className="flex justify-start main-text items-center gap-x-3">
          <Heading text="Total Leads" showHeading />
        </div>
        <div className="w-full py-4">
          <DataTable
            columns={columns}
            data={serviceCategoryQuantityTotalLeads ? serviceCategoryQuantityTotalLeads : []}
            pagination
            customStyles={tableCustomStyles}
            onRowClicked={handleRow}
            highlightOnHover
            paginationPerPage={30}
                    paginationRowsPerPageOptions={[30]}
          />
        </div>
      </div>
    </>
  );
};

export default TotalLeads;
