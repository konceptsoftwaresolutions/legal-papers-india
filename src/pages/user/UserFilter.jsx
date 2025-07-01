import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Drawer } from "antd";
import { Button } from "@material-tailwind/react";
import { RxCross2 } from "react-icons/rx";
import InputField from "../../components/fields/InputField";

function UserFilter({ isOpen, onClose, setIsOpen, filterSubmit , handleResetCall}) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("filter submit", data);
    const filterObject = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );
    filterSubmit(filterObject);
  };

  const onCancel = () => {
    reset();
    setIsOpen(false);
  };

  const onReset = () => {
    reset();
  };

  return (
    <Drawer
      placement="right"
      closable={false} // Remove default close button
      onClose={onCancel} // Ensure this triggers closing logic
      open={isOpen} // Ant Design now uses "open" instead of "visible"
      width={400}
      headerStyle={{ display: "none" }} // Hide default drawer header
      maskClosable={true} // Allows closing when clicking outside the drawer
    >
      <div className="flex justify-between items-center w-full mb-3">
        <h2 className="not-italic leading-normal font-poppins font-semibold text-xl text-[#2c2c2c]">
          User Filter
        </h2>
        <button
          className="cursor-pointer active:text-red-700 transition-all"
          onClick={() => setIsOpen(false)}
        >
          <RxCross2 size={20} />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col"
      >
        {/* <InputField
          name="leadType"
          control={control}
          options={typeOption}
          label="Type"
          type="option"
          placeholder="Select Type"
          errors={errors}
        /> */}

        <InputField
          control={control}
          name="email"
          label="Email"
          placeholder="Email"
          errors={errors}
        />
        <InputField
          control={control}
          name="name"
          label="Name"
          placeholder="Name"
          errors={errors}
        />
        <div className="flex flex-wrap gap-3">
          <Button
            type="submit"
            variant="filled"
            className="main-bg rounded-md text-sm md:text-md poppins-font capitalize "
          >
            Filter
          </Button>
          <Button
            onClick={ () => { setIsOpen(false); handleResetCall()}}
            className="bg-[#388e3c] rounded-md text-sm md:text-md capitalize"
          >
            Reset
          </Button>
        </div>
      </form>
    </Drawer>
  );
}

export default UserFilter;
