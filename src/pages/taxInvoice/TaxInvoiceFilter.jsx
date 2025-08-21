import React from "react";
import Filters from "../../components/sliders/Filters";
import { useForm } from "react-hook-form";
import InputField from "../../components/fields/InputField";
import MyButton from "../../components/buttons/MyButton";

const TaxInvoiceFilter = ({
  isOpen = false,
  setIsOpen = () => {},
  allInvoices = [],
  setFilteredData,
  setIsFilterActive,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      gstNumber: "",
      fromDate: "",
      toDate: "",
      month: "",
      year: "",
    },
  });

  const onReset = () => {
    // Reset the form to defaultValues
    reset();

    // Reset table data
    setFilteredData(allInvoices);

    // Reset filter active state
    setIsFilterActive(false);

    // Close the filter panel
    setIsOpen(false);
  };

  const onSubmit = (data) => {
    let filtered = [...allInvoices];

    if (data.name) {
      filtered = filtered.filter((inv) =>
        inv.name?.toLowerCase().includes(data.name.toLowerCase())
      );
    }

    if (data.gstNumber) {
      filtered = filtered.filter((inv) =>
        inv.gstNumber?.toLowerCase().includes(data.gstNumber.toLowerCase())
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
      title="Tax Invoice Filter"
      onReset={onReset}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 font-extrabold"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
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
          name="gstNumber"
          type="text"
        />
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
        <InputField
          control={control}
          errors={errors}
          label="Month (1-12)"
          name="month"
          type="number"
        />
        <InputField
          control={control}
          errors={errors}
          label="Year"
          name="year"
          type="number"
        />

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

export default TaxInvoiceFilter;
