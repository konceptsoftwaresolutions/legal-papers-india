import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getImportantLeads } from "../../redux/features/leads";
import Heading from "../../common/Heading";
import DataTable from "react-data-table-component";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import { impleadCol } from "./columns";
import { useNavigate } from "react-router-dom";
import ImpLeadsFilter from "./ImpLeadsFilter";
import MyButton from "../../components/buttons/MyButton";
import { LuListFilter } from "react-icons/lu";
import useFilter from "../../hooks/useFilter";

const Important = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const filter = useFilter();

  useEffect(() => {
    dispatch(getImportantLeads());
  }, [dispatch]);

  const { impLeads } = useSelector((state) => state.leads);
  const { role } = useSelector((state) => state.auth);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [filteredData, setFilteredData] = useState(impLeads);

  const handleRowClick = (row) => {
    const link = `/${role}/editLead`;
    navigate(link, { state: { leadData: row } });
  };

  const filterData = (filter) => {
    console.log(filter);
    const { serviceCategory, emailId, date, mobileNumber, fromDate, toDate } = filter;
  
    // Get current date and other date ranges
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Start of this week
    const startOfMonth = new Date(currentDate);
    startOfMonth.setDate(1); // Start of this month
    const startOfYear = new Date(currentDate);
    startOfYear.setMonth(0, 1); // Start of this year
  
    // Function to check if a date is today
    const isToday = (date) => {
      const d = new Date(date);
      return (
        d.getDate() === currentDate.getDate() &&
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear()
      );
    };
  
    // Function to check if a date is yesterday
    const isYesterday = (date) => {
      const d = new Date(date);
      const yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1);
      return (
        d.getDate() === yesterday.getDate() &&
        d.getMonth() === yesterday.getMonth() &&
        d.getFullYear() === yesterday.getFullYear()
      );
    };
  
    // Function to check if a date is within this week
    const isThisWeek = (date) => {
      const d = new Date(date);
      return d >= startOfWeek && d <= currentDate;
    };
  
    // Function to check if a date is within this month
    const isThisMonth = (date) => {
      const d = new Date(date);
      return (
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear()
      );
    };
  
    // Function to check if a date is within this year
    const isThisYear = (date) => {
      const d = new Date(date);
      return d.getFullYear() === currentDate.getFullYear();
    };
  
    // Function to check if a date falls within the range of fromDate and toDate
    const isWithinDateRange = (date) => {
      const d = new Date(date);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
  
      // If both fromDate and toDate are provided
      if (from && to) {
        return d >= from && d <= to;
      }
  
      // If only fromDate is provided
      if (from) {
        return d >= from;
      }
  
      // If only toDate is provided
      if (to) {
        return d <= to;
      }
  
      // If neither fromDate nor toDate is provided, return true
      return true;
    };
  
    // Apply filters
    const filteredLeads = impLeads.filter((lead) => {
      const formData = lead.formData;
  
      // Check if each filter condition is met (if the value exists in the filter and matches part of the lead data)
      const matchesServiceCategory = serviceCategory
        ? formData.serviceCategory
            .toLowerCase()
            .includes(serviceCategory.toLowerCase())
        : true;
  
      const matchesEmail = emailId
        ? formData.emailId &&
          formData.emailId.toLowerCase().includes(emailId.toLowerCase())
        : true;
  
      const matchesMobileNumber = mobileNumber
        ? formData.mobileNumber.includes(mobileNumber)
        : true;
  
      // Handle the date filter based on the selected date range
      let matchesDate = true;
      if (date) {
        switch (date) {
          case "Today":
            matchesDate = isToday(lead.date);
            break;
          case "Yesterday":
            matchesDate = isYesterday(lead.date);
            break;
          case "This week":
            matchesDate = isThisWeek(lead.date);
            break;
          case "This month":
            matchesDate = isThisMonth(lead.date);
            break;
          case "This year":
            matchesDate = isThisYear(lead.date);
            break;
          default:
            matchesDate = true;
            break;
        }
      }
  
      // Combine date filter with fromDate and toDate
      const matchesDateRange = isWithinDateRange(lead.date);
  
      // Return true if all filter conditions are matched
      return (
        matchesServiceCategory &&
        matchesEmail &&
        matchesDate &&
        matchesDateRange &&
        matchesMobileNumber
      );
    });
  
    console.log(filteredLeads);
    setFilteredData(filteredLeads);
    return filteredLeads;
  };
  
  

  const resetFilter = () => {
    setFilteredData(impLeads);
  };


  useEffect(() => {
    // Update filteredData whenever impLeads is fetched
    if (impLeads && impLeads.length > 0) {
      setFilteredData(impLeads);
    }
  }, [impLeads]);

  return (
    <>
      <div className="flex flex-col w-full px-4 gap-y-4 py-5">
        <div className="grid grid-cols-2">
          <Heading text="Important Leads" showHeading />
        </div>
        <div className="flex justify-end">
          <MyButton
            className="main-bg py-2 flex justify-center items-center text-[15px] font-medium px-4 gap-x-1"
            onClick={() => setIsFilterOpen(true)}
          >
            <LuListFilter size={16} />
            <span>Filter</span>
          </MyButton>
        </div>
        <div>
        {isFilterActive && (
            <div className="flex justify-center mb-4">
              <p className="main-bg py-2 px-3 text-white rounded-md">
                You are viewing the filtered data...
              </p>
            </div>
          )}
          <DataTable
            columns={impleadCol}
            data={filteredData ? filteredData : []}
            noDataComponent="No data to be displayed..."
            customStyles={tableCustomStyles}
            onRowClicked={handleRowClick}
            selectableRows
            pagination
          />
        </div>
      </div>
      <ImpLeadsFilter
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
        filterData={filterData}
        setIsFilterActive={setIsFilterActive}
        resetFilter={resetFilter}
      />
    </>
  );
};

export default Important;
