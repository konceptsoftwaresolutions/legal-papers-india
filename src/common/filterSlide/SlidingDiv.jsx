import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Drawer } from "antd";
import { Button } from "@material-tailwind/react";
import { RxCross2 } from "react-icons/rx";
import InputField from "../../components/fields/InputField";


function SlidingDiv({ isOpen, onClose }) {


  const typeOption = [
    { label: "Sales & Services", value: "sales&services" },
    { label: "Sales", value: "sales" },
    { label: "Services", value: "services" },
  ]
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      leadType: "",
      hod: "",
      name: "",
      contactPerson: "",
      mobile: "",
      email: "",
      assignSalesExecutiveID: "",
      date: "",
    }
  });

  const onSubmit = (data) => {
    console.log("filter submit" , data)
  };

  const onCancel = () => {
    onClose();
    reset();
  }

  const onReset = () => {
    reset();
  }

  return (
    <Drawer
      placement="right"
      closable={false} // This removes the close button
      onClose={() => {
        onClose();
        reset();
      }}
      visible={isOpen}
      width={400}
      headerStyle={{ display: 'none' }} // This hides the top bar
    >
      <div className="flex justify-between items-center w-full mb-3">
        <h2 className="not-italic leading-normal font-poppins font-semibold text-xl text-[#2c2c2c]">Filters</h2>
        <button className="cursor-pointer active:text-red-700 transition-all" onClick={onClose}>
          <RxCross2 size={20} />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col"
      >
        <InputField
          name="leadType"
          control={control}
          options={typeOption}
          label="Type"
          type="option"
          placeholder="Select Type"
          errors={errors}
        />
        
        <InputField
          control={control}
          name="mobile"
          label="Contact No."
          placeholder="Contact No."
          errors={errors}
        />
        <InputField
          control={control}
          name="email"
          label="Email"
          type="email"
          placeholder="Email"
          errors={errors}
        />
        {/* <SelectField
          name="executive"
          control={control}
          options={options1}
          label="Name of Executive"
          errors={errors}
          placeholder="Select"
        /> */}
        {/* <InputField
          name="assignSalesExecutiveID"
          type="option"
          control={control}
          options={executiveOptions}
          label="Name of Executive"
          errors={errors}
          placeholder="Select"
        /> */}
        <InputField
          control={control}
          name="date"
          label="Date"
          type="date"
          placeholder="Date"
          errors={errors}
        />
        <div>
          <Button
            type="submit"
            variant="filled"
            className="cstm-btn rounded-md text-sm md:text-md poppins-font cstm-btn mr-2"
          >
            Save
          </Button>
          <Button
            onClick={onCancel}
            className="cstm-green-outline-btn rounded-md text-sm md:text-md poppins-font mr-2"
          >
            Cancel
          </Button>
          <Button
            onClick={onReset}
            className="cstm-green-outline-btn rounded-md text-sm md:text-md poppins-font mr-2"
          >
            Reset
          </Button>
        </div>
      </form>
    </Drawer>
  );
}

export default SlidingDiv;
