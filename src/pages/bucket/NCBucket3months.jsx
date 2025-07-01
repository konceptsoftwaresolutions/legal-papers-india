import React, { useEffect } from "react";

// buttons
import BackButton from "../../components/buttons/BackButton";

// table
import DataTable from "react-data-table-component";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import Heading from "../../common/Heading";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationData } from "../../redux/features/notification";
import usePath from "../../hooks/usePath";
import { useNavigate } from "react-router-dom";

const NCBucket3months = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const path = usePath();

  const { openNCBucketLeadsThreeMonths } = useSelector((state) => state.leads);
  const { role } = useSelector((state) => state.auth);

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

  const handleRow = (row) => {
    path.navigate(
      `/${role}/admin-bucket-details-3-months?serviceCategory=${row.serviceCategory}`
    );
  };

  useEffect(() => {
    dispatch(getNotificationData());
  }, [dispatch]);

  return (
    <>
      <div className="p-3">
        <div className="flex justify-start main-text items-center gap-x-3">
          <Heading text="Open NC Bucket Leads" showHeading />
        </div>
        <div className="w-full py-4">
          <DataTable
            columns={columns}
            data={
              openNCBucketLeadsThreeMonths ? openNCBucketLeadsThreeMonths : []
            }
            onRowClicked={handleRow}
            pagination
            customStyles={tableCustomStyles}
            highlightOnHover
            paginationPerPage={30}
            paginationRowsPerPageOptions={[30]}
          />
        </div>
      </div>
    </>
  );
};

export default NCBucket3months;
