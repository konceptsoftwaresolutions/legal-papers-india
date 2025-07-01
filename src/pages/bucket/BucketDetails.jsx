import React, { useEffect } from "react";
import Heading from "../../common/Heading";
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import { getAdminBucketDetails } from "../../redux/features/bucket";

const BucketDetails = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAdminBucketDetails());
  }, []);

  return (
    <div>
      <div className="p-3">
        <div className="flex justify-start main-text items-center gap-x-3">
          <Heading text="Open NC Bucket Leads" showHeading />
        </div>
        <div className="w-full py-4">
          <DataTable
            columns={columns}
            data={[]}
            // onRowClicked={handleRow}
            pagination
            customStyles={tableCustomStyles}
            highlightOnHover
            paginationPerPage={30}
            paginationRowsPerPageOptions={[30]}
          />
        </div>
      </div>
    </div>
  );
};

export default BucketDetails;
