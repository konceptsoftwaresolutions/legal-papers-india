import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Add Redux imports
import Filters from "../../components/sliders/Filters";
import { useForm, Controller } from "react-hook-form";
import InputField from "../../components/fields/InputField";
import MyButton from "../../components/buttons/MyButton";
import { DatePicker, Select } from "antd";
import dayjs from "dayjs";
import { getAllSalesExecutive } from "../../redux/features/leads";

const PerformaInvoiceFilter = ({
  isOpen = false,
  setIsOpen = () => {},
  allInvoices = [],
  setFilteredData,
  setIsFilterActive,
}) => {
  const dispatch = useDispatch();

  // Get sales executive data from Redux store
  const allSalesExecutive = useSelector(
    (state) => state.leads.allSalesExecutive
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch sales executive data when component mounts
  useEffect(() => {
    dispatch(getAllSalesExecutive());
  }, [dispatch]);

  const onReset = () => {
    reset({
      name: "",
      gstNo: "",
      fromDate: "",
      toDate: "",
      month: "",
      year: "",
    });
    setFilteredData(allInvoices);
    setIsFilterActive(false);
    setIsOpen(false);
  };

  const onSubmit = (data) => {
    let filtered = [...allInvoices];
    if (data.name) {
      filtered = filtered.filter((inv) =>
        inv.name?.toLowerCase().includes(data.name.toLowerCase())
      );
    }
    if (data.gstNo) {
      filtered = filtered.filter((inv) =>
        inv.gstNo?.toLowerCase().includes(data.gstNo.toLowerCase())
      );
    }
    if (data.fromDate) {
      filtered = filtered.filter(
        (inv) => new Date(inv.date) >= new Date(data.fromDate)
      );
    }
    if (data.toDate) {
      filtered = filtered.filter(
        (inv) => new Date(inv.date) <= new Date(data.toDate)
      );
    }

    // Updated filter logic to use salesExecutiveName instead of salesExecutive
    if (data.salesExecutive) {
      filtered = filtered.filter(
        (inv) =>
          inv.salesExecutiveName &&
          inv.salesExecutiveName.toLowerCase() ===
            data.salesExecutive.toLowerCase()
      );
    }

    if (data.service) {
      filtered = filtered.filter((inv) =>
        inv.services?.some(
          (srv) =>
            srv.name && srv.name.toLowerCase() === data.service.toLowerCase()
        )
      );
    }
    if (data.year) {
      filtered = filtered.filter(
        (inv) => new Date(inv.date).getFullYear() === parseInt(data.year)
      );
    }
    if (data.month) {
      filtered = filtered.filter(
        (inv) => new Date(inv.date).getMonth() + 1 === parseInt(data.month)
      );
    }
    setFilteredData(filtered);
    setIsFilterActive(true);
    setIsOpen(false);
  };

  return (
    <Filters
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Invoice Filter"
      onReset={onReset}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 font-extrabold"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <InputField
          control={control}
          errors={errors}
          label="Name"
          name="name"
          type="text"
        />
        <InputField
          control={control}
          errors={errors}
          label="GST Number"
          name="gstNo"
          type="text"
        />
        {/* From - To Date in one row */}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            control={control}
            errors={errors}
            label="From Date"
            name="fromDate"
            type="date"
          />
          <InputField
            control={control}
            errors={errors}
            label="To Date"
            name="toDate"
            type="date"
          />
        </div>

        {/* Sales Executive Dropdown - Shows API data, filters by salesExecutiveName */}
        <InputField
          name="salesExecutive"
          label="Sales Executive"
          type="select"
          mode="single"
          control={control}
          errors={errors}
          options={[
            { label: "All", value: "" },
            // Map through Redux data to create dropdown options
            ...(allSalesExecutive && Array.isArray(allSalesExecutive)
              ? allSalesExecutive.map((executive) => ({
                  label: executive.name, // Show name from API in dropdown
                  value: executive.name, // Use name as value for filtering
                }))
              : []),
          ]}
        />

        {/* Services Dropdown */}
        <InputField
          name="service"
          label="Service"
          type="select"
          mode="single"
          control={control}
          errors={errors}
          options={[
            { label: "All", value: "" },
            ...Array.from(
              new Set(
                allInvoices
                  .flatMap((inv) => inv.services?.map((s) => s.name))
                  .filter(Boolean)
              )
            ).map((srv) => ({ label: srv, value: srv })),
          ]}
        />
        <InputField
          name="month"
          label="Select Month"
          type="select"
          mode="single"
          control={control}
          errors={errors}
          options={[
            { label: "January", value: "01" },
            { label: "February", value: "02" },
            { label: "March", value: "03" },
            { label: "April", value: "04" },
            { label: "May", value: "05" },
            { label: "June", value: "06" },
            { label: "July", value: "07" },
            { label: "August", value: "08" },
            { label: "September", value: "09" },
            { label: "October", value: "10" },
            { label: "November", value: "11" },
            { label: "December", value: "12" },
          ]}
        />
        {/* Year Picker */}
        <div>
          <label className="block font-medium text-black mb-1">
            Year (YYYY)
          </label>
          <Controller
            name="year"
            control={control}
            render={({ field }) => (
              <DatePicker
                picker="year"
                className="w-full border border-gray-600 rounded-none"
                format="YYYY"
                value={field.value ? dayjs(field.value, "YYYY") : null}
                onChange={(date, dateString) => field.onChange(dateString)}
              />
            )}
          />
        </div>
        {/* Buttons */}
        <div className="w-full flex justify-end items-center py-3 gap-x-2 sticky bottom-0 border-t-4 bg-white">
          <MyButton
            type="button"
            className="bg-green-700 py-2 px-4 text-[14px]"
            onClick={onReset}
          >
            Reset
          </MyButton>
          <MyButton type="submit" className="main-bg py-2 px-4 text-[14px]">
            Apply
          </MyButton>
        </div>
      </form>
    </Filters>
  );
};

export default PerformaInvoiceFilter;
