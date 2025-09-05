import React, { useEffect, useState } from "react";
import Heading from "../../common/Heading";
import { useLocation } from "react-router-dom";

import { useForm } from "react-hook-form";
import InputField from "../../components/fields/InputField";
import {
  activeOption,
  serviceCategoryOption,
  userOptions,
} from "../../constants/options";
import SelectField from "../../components/fields/SelectField";
import { useDispatch, useSelector } from "react-redux";
import {
  getCallLogs,
  updateUserDetails,
  userDelete,
} from "../../redux/features/user";
import DataTable from "react-data-table-component";
import { callColumns } from "./columns";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import { Button, Spinner } from "@material-tailwind/react";
import { FiRefreshCcw } from "react-icons/fi";
import MyButton from "../../components/buttons/MyButton";
import ChangePassModal from "../../common/navbar/ChangePassModal";
import { MdDelete } from "react-icons/md";
import UserPassModal from "./UserPassModal";
import { getNotificationData } from "../../redux/features/notification";

const UserDetails = () => {
  const location = useLocation();
  const userData = location.state?.userData;
  console.log(userData);

  const dispatch = useDispatch();

  const [callLogs, setCallLogs] = useState([]);
  const [filteredCallLogs, setFilteredCallLogs] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [passModal, setPassModal] = useState(false);

  const { updateUserLoader, userDeleteLoader } = useSelector(
    (state) => state.user
  );

  const [updateLoader, setUpdateLoader] = useState(false);

  useEffect(() => {
    dispatch(getCallLogs(userData?.email))
      .then((data) => {
        setCallLogs(data);
        setFilteredCallLogs(data);
      })
      .catch((err) => console.log(err));
  }, [dispatch, userData]);

  // useEffect(() => {
  //   dispatch(getNotificationData());
  // }, [dispatch]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({});

  useEffect(() => {
    if (userData) {
      reset({
        name: userData?.name,
        mobile: userData?.mobile,
        profile: userData?.profile,
        email: userData?.email,
        teamLeadName: userData?.teamLeadName,
        userStatus: userData?.userStatus === true ? "true" : "false",
        userAssignment: userData?.userAssignment,
        dob: userData?.dob
        ? new Date(userData.dob).toISOString().split("T")[0] // 👈 yyyy-mm-dd format
        : "",
      });
    }
  }, [userData]);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      userStatus: data.userStatus === "true" ? true : false,
      // userAssignment: userData.userAssignment,
    };
    console.log(payload);
    dispatch(updateUserDetails(payload, setUpdateLoader));
  };

  const {
    handleSubmit: handleDateFilterSubmit,
    control: controlDateFilter,
    reset: dateFilterReset,
    formState: { errors: errorsDateFilter },
  } = useForm();

  const onSubmitDateFilter = (data) => {
    const { startDate, endDate } = data;

    if (!startDate && !endDate) {
      alert("Please enter at least one date to filter.");
      return;
    }

    const filteredLogs = filteredCallLogs.filter((log) => {
      const callDate = new Date(parseInt(log.timestamp)); // Convert timestamp to Date
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        return callDate >= start && callDate <= end; // Between the range
      } else if (start) {
        return callDate >= start; // After or on start date
      } else if (end) {
        return callDate <= end; // Before or on end date
      }
      return true;
    });

    console.log(
      `Filtered logs between ${startDate || "beginning"} and ${
        endDate || "end"
      }:`,
      filteredLogs
    );

    setFilteredCallLogs(filteredLogs); // Update state
  };

  const handleDelete = () => {
    const payload = userData?.email;
    dispatch(userDelete(payload));
  };

  return (
    <>
      <div className="flex flex-col w-full px-4 gap-y-4 py-5">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-y-3">
          <Heading text="User Details" showHeading />
        </div>
        <div className="flex justify-end gap-x-3">
          <MyButton className="" onClick={() => setIsEditable(!isEditable)}>
            Edit
          </MyButton>
          <MyButton className="main-bg" onClick={() => setPassModal(true)}>
            Change Password
          </MyButton>
          <MyButton
            className="bg-[#dc3545] text-lg flex "
            onClick={handleDelete}
          >
            {userDeleteLoader ? <Spinner size="10px" /> : <MdDelete />}
          </MyButton>
        </div>
        <form
          className="border-b-[1px] pb-10 mb-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
            <InputField
              type="text"
              name="name"
              control={control}
              errors={errors}
              label="Name"
              disabled={!isEditable}
            />
            <InputField
              type="number"
              name="mobile"
              control={control}
              errors={errors}
              label="Mobile"
              disabled={!isEditable}
            />
            <InputField
              type="date"
              name="dob"
              control={control}
              errors={errors}
              label="D.O.B"
              disabled={!isEditable}
            />
            <InputField
              type="option"
              options={userOptions}
              name="profile"
              control={control}
              errors={errors}
              label="Profile"
              disabled={!isEditable}
            />
            <InputField
              name="email"
              control={control}
              errors={errors}
              label="Email"
              disabled={!isEditable}
            />
            {userData?.teamLeadName && (
              <InputField
                type="text"
                name="teamLeadName"
                control={control}
                errors={errors}
                label="Team Lead Name"
                disabled={!isEditable}
              />
            )}
            <InputField
              type="option"
              options={activeOption}
              name="userStatus"
              control={control}
              errors={errors}
              label="Status"
              disabled={!isEditable}
            />

            <SelectField
              type="option"
              options={serviceCategoryOption}
              control={control}
              errors={errors}
              mode="multiple"
              name="userAssignment"
              label="Service Category"
              disabled={!isEditable}
            />
          </div>
          {isEditable && (
            <Button
              type="submit"
              className="main-bg mt-3 capitalize"
              loading={updateLoader}
            >
              Save
            </Button>
          )}
        </form>
        <div>
          <div className="mb-3 flex justify-between items-baseline">
            <Heading text="Call Logs" />
            <div>
              <form
                onSubmit={handleDateFilterSubmit(onSubmitDateFilter)}
                className="flex flex-col items-end gap-y-3"
              >
                <div className="grid grid-cols-2 gap-x-3">
                  <InputField
                    type="date"
                    control={controlDateFilter}
                    errors={errorsDateFilter}
                    name="startDate"
                    label="From"
                  />
                  <InputField
                    type="date"
                    control={controlDateFilter}
                    errors={errorsDateFilter}
                    name="endDate"
                    label="To"
                  />
                </div>
                <div className="flex gap-3">
                  <MyButton type="submit" className="main-bg">
                    Filter
                  </MyButton>
                  <button
                    type="button"
                    onClick={() => {
                      dateFilterReset();
                      setFilteredCallLogs(callLogs);
                    }}
                  >
                    <FiRefreshCcw />
                  </button>
                </div>
              </form>
            </div>
          </div>
          <DataTable
            columns={callColumns}
            data={filteredCallLogs ? filteredCallLogs : []}
            noDataComponent={
              <div className="p-7">
                {" "}
                <p>No data to be displayed...</p>
              </div>
            }
            customStyles={tableCustomStyles}
            // onRowClicked={handleRowClick}
            selectableRows
            pagination
          />
        </div>
      </div>
      <UserPassModal
        passModal={passModal}
        setPassModal={setPassModal}
        email={userData?.email || ""}
      />
    </>
  );
};

export default UserDetails;
