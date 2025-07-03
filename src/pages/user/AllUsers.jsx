import React, { useEffect, useState } from "react";
import Heading from "../../common/Heading";
import DataTable from "react-data-table-component";
import { columns } from "./columns";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import { useDispatch, useSelector } from "react-redux";
import MyButton from "../../components/buttons/MyButton";
import { LuListFilter } from "react-icons/lu";
import UserFilter from "./UserFilter";
import { useNavigate } from "react-router-dom";
import { getNotificationData } from "../../redux/features/notification";
import { getDashboardData } from "../../redux/features/dashboard";

const AllUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDashboardData());
    // dispatch(getNotificationData());
  }, [dispatch]);

  const navigate = useNavigate();

  const { dashboardData } = useSelector((state) => state.dashboard);
  const { role } = useSelector((state) => state.auth);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tableData, setTableData] = useState(dashboardData?.allUsers || []);

  const openFilter = () => setIsFilterOpen(true);

  const filterSubmit = (filterCriteria) => {
    const filteredData = dashboardData?.allUsers?.filter((user) => {
      return Object.entries(filterCriteria).every(([key, value]) => {
        if (!value) return true;

        return String(user[key])
          .toLowerCase()
          .includes(String(value).toLowerCase());
      });
    });

    setTableData(filteredData);
    setIsFilterOpen(false);
  };

  const handleResetCall = () => {
    setTableData(dashboardData?.allUsers);
  };

  const handleRowClick = (row) => {
    // const link = `/${role}/userdetails`;
    const link = `/${role}/userDetails`;
    navigate(link, { state: { userData: row } });
  };

  return (
    <>
      <div className="flex flex-col w-full px-4 gap-y-4 py-5">
        <div className="grid grid-cols-2">
          <Heading text="All Users" showHeading />
          <div className="flex justify-end">
            <MyButton
              className="main-bg py-2 flex justify-center items-center text-[15px] font-medium px-4 gap-x-1"
              onClick={openFilter}
            >
              <LuListFilter size={16} />
              <span>Filter</span>
            </MyButton>
          </div>
        </div>

        <div>
          <DataTable
            columns={columns}
            data={tableData} // Use filtered table data
            noDataComponent="No data to be displayed..."
            customStyles={tableCustomStyles}
            selectableRows
            onRowClicked={handleRowClick}
            pagination
          />
        </div>
      </div>
      <UserFilter
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
        filterSubmit={filterSubmit}
        handleResetCall={handleResetCall}
      />
    </>
  );
};

export default AllUsers;
