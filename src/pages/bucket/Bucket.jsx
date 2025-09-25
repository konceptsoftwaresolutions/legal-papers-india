import React, { useEffect } from "react";

// icons
import { TbBucket } from "react-icons/tb";
import { TbBucketDroplet } from "react-icons/tb";

// components
import BucketCard from "../../components/cards/BucketCard";
import {
  getOpenNCBucketLeadsData,
  getOpenNCBucketLeadsThreeMonthsData,
  getTotalBucketLeadsData,
  getTotalNCBucketLeadsData,
} from "../../redux/features/leads";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationData } from "../../redux/features/notification";

const Bucket = () => {
  const dispatch = useDispatch();

  const { role } = useSelector((state) => state.auth);
  if (role) console.log(role);

  useEffect(() => {
    dispatch(getOpenNCBucketLeadsThreeMonthsData());
    dispatch(getOpenNCBucketLeadsData());
    dispatch(getTotalNCBucketLeadsData());
    dispatch(getTotalBucketLeadsData());
    // dispatch(getNotificationData());
  }, [dispatch]);

  return (
    <>
      <div className="p-3 flex justify-center flex-wrap gap-x-4 gap-y-6 sm:gap-x-10 sm:gap-y-8 md:gap-x-20 md:gap-y-10 pt-10 sm:pt-14 md:pt-6 items-center">
        {/* {(role === "superAdmin" || role === "salesTl") && (
          <BucketCard
            icon={<TbBucket size={50} />}
            title="Open nc bucket leads"
            subText="before 3 months "
            to="no-claim-bucket-3-months"
          />
        )} */}

        {(role === "superAdmin" || role === "salesTl") && (
          <BucketCard
            icon={<TbBucket size={50} />}
            title="Used nc bucket leads"
            to="used-nc-bucket"
          />
        )}

        {!(role === "salesExecutive") && (
          <BucketCard
            icon={<TbBucket size={50} />}
            title="Open NCBucket Leads"
            to="no-claim-bucket"
          />
        )}

        {/* {(role === "superAdmin" || role === "salesTl" || role === "salesExecutive") && ( */}
        {(role === "superAdmin" ||
          role === "salesTl" ||
          role === "salesExecutive") && (
          <>
            <BucketCard
              icon={<TbBucketDroplet size={50} />}
              title="Assigned NCBucket Leads"
              to="assigned-nc-bucket"
            />
          </>
        )}
        {!(role === "salesTl" || role === "salesExecutive") && (
          <>
            <BucketCard
              icon={<TbBucketDroplet size={50} />}
              title="Total NC Bucket Leads"
              to="total-nc-bucket"
            />{" "}
          </>
        )}
        {!(role === "salesTl" || role === "salesExecutive") && (
          <>
            <BucketCard
              icon={<TbBucketDroplet size={50} />}
              title="Total Leads"
              to="total-leads"
            />
          </>
        )}
        <>
          <BucketCard
            icon={<TbBucketDroplet size={50} />}
            title="IEC Renewal Leads"
            to="iec-renewal-lead"
          />
        </>
      </div>
    </>
  );
};

export default Bucket;
