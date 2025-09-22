import React, { useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { createAddress, updateAddress } from "../../../redux/features/services";

const AddressModal = ({ isOpen, setIsOpen, mode, data }) => {
  const dispatch = useDispatch();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      addressLine1: "",
      isActive: false, // ✅ Added checkbox default value
    },
  });

  useEffect(() => {
    if (mode === "edit" && data) {
      reset({
        addressLine1: data.addressLine1 || "",
        isActive: data.isActive ?? false, // ✅ Added checkbox value for edit mode
      });
    } else {
      reset({
        addressLine1: "",
        isActive: false, // ✅ Reset checkbox to false for add mode
      });
    }
  }, [mode, data, reset]);

  const handleClose = () => {
    reset({
      addressLine1: "",
      isActive: false, // ✅ Reset checkbox when closing
    });
    setIsOpen(false);
  };

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      addressLine2: data?.addressLine2 || "Suite 456",
      city: data?.city || "Mumbai",
      state: data?.state || "Maharashtra",
      postalCode: data?.postalCode || "400001",
      country: data?.country || "India",
      addressType: data?.addressType || "office",
      isDefault: data?.isDefault ?? true,
      contactPerson: data?.contactPerson || "John Doe",
      contactPhone: data?.contactPhone || "+919876543210",
      isActive: formData.isActive, // ✅ This will be boolean true/false
    };

    if (mode === "add") {
      dispatch(
        createAddress(payload, (success) => {
          if (success) {
            handleClose();
          }
        })
      );
    } else {
      dispatch(
        updateAddress({ id: data._id, ...payload }, (success) => {
          if (success) {
            handleClose();
          }
        })
      );
    }
  };

  return (
    <Dialog open={isOpen} handler={handleClose} size="lg">
      <DialogHeader>
        {mode === "add" ? "Add Address" : "Edit Address"}
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody>
          <div className="mb-4">
            <label className="block font-medium mb-2">Address</label>
            <Controller
              name="addressLine1"
              control={control}
              rules={{ required: "Address is required" }}
              render={({ field }) => (
                <ReactQuill {...field} theme="snow" className="bg-white" />
              )}
            />
          </div>

          {/* ✅ Added Checkbox Field */}
          <div className="mb-4">
            <label className="flex items-center gap-2 font-medium cursor-pointer">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    checked={field.value || false}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                )}
              />
              <span>Is Active</span>
            </label>
          </div>
        </DialogBody>
        <DialogFooter className="flex gap-3">
          <Button
            variant="text"
            color="red"
            onClick={handleClose}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button type="submit" className="main-bg">
            {mode === "add" ? "Save" : "Update"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default AddressModal;
