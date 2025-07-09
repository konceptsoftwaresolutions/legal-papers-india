import React, { useEffect, useState } from "react";

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
import { getUsedNCBucketLeadsThreeMonthsData } from "../../redux/features/leads";

const UsedNCBucket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const path = usePath();

  const { role } = useSelector((state) => state.auth);
  const [data, setData] = useState();

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
      `/${role}/used-nc-bucket-details?serviceCategory=${row.serviceCategory}`
    );
  };

  useEffect(() => {
    dispatch(
      getUsedNCBucketLeadsThreeMonthsData((success, data) => {
        if (success) {
          setData(data);
        }
      })
    );
  }, [dispatch]);

  return (
    <>
      <div className="p-3">
        <div className="flex justify-start main-text items-center gap-x-3">
          <Heading text="Open Used NC Bucket Leads" showHeading />
        </div>
        <div className="w-full py-4">
          <DataTable
            columns={columns}
            data={data ? data : []}
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

export default UsedNCBucket;
