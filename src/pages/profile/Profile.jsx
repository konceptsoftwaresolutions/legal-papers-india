import React from "react";
import MyButton from "../../components/buttons/MyButton";
import { AiOutlineEdit } from "react-icons/ai";
import { useForm } from "react-hook-form";
import InputField from "../../components/fields/InputField";
import { BsShieldLock } from "react-icons/bs";


const Profile = () => {
    // form
    const {
        control,
        formState: {
            errors
        },
        handleSubmit,
    } = useForm({
        defaultValues: {
            email: "deepak@gmail.com",
            mobile: "1234567890"
        }
    });

    return <>
        <div className="w-full px-8 py-6">
            <div className="w-full flex justify-start gap-x-10 items-center">
                <div className="w-36 h-36 rounded-full relative p-1 bg-gray-300">
                    <img src="https://cdn-icons-png.flaticon.com/512/9703/9703596.png" alt="profile image" className="w-full h-full rounded-full" />
                </div>
                <div className="flex flex-col main-text justify-start items-start">
                    <h2 className="text-[28px]">Deepak Dhiman</h2>
                    <p>superAdmin</p>
                    <div className="flex justify-center mt-3 items-center gap-x-2">
                        <MyButton className="py-1.5 px-3 text-[12px] text-white flex justify-center items-center gap-x-1">
                            <AiOutlineEdit size={14} />
                            Edit Picture
                        </MyButton>
                    </div>
                </div>
            </div>
            <div className="w-full grid my-8 grid-cols-2 gap-x-4 gap-y-6">
                <InputField
                    control={control}
                    errors={errors}
                    type="email"
                    placeholder="Email Id"
                    name="email"
                    disabled={true}
                />
                <InputField
                    control={control}
                    errors={errors}
                    type="number"
                    placeholder="Mobile Number"
                    name="mobile"
                    disabled={true}
                />
            </div>

            <h2 className="main-text text-[18px] w-full flex justify-start gap-x-2 items-center font-medium">
                <BsShieldLock size={18} />
                Change Login Password
            </h2>

            <div className="profile-form-container w-full grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                <InputField
                    control={control}
                    name="currentPassword"
                    label="Current Password"
                    placeholder="Current Password"
                    type="password"
                    errors={errors}
                />
                <InputField
                    control={control}
                    name="newPassword"
                    label="New Password"
                    placeholder="New Password"
                    type="password"
                    errors={errors}
                />
                <InputField
                    control={control}
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    type="password"
                    errors={errors}
                />
            </div>
            <MyButton className="text-[14px] text-white px-6 py-2 main-bg">
                Change Password
            </MyButton>
        </div>
    </>
}

export default Profile;