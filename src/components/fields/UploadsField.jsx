import React, { useState } from "react";
import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import { Upload as AntUpload, Button, message } from 'antd';
import { FiTrash2, FiUpload } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { Controller } from "react-hook-form";
import { GoUpload } from "react-icons/go";

import "./styles/UploadsStyles.css";

const { Dragger } = AntUpload;

const UploadsField = ({
    control,
    errors,
    placeholder = "",
    className = "",
    label = "",
    parentClass = "",
    name = "",
    labelClass = "",
    disabled = "",
    modalLabel = "",
    modalHeadClass = "",
    modalClass = "",
    modalBodyClass = "",
    modalLabelClass = "",
    max = 1,
}) => {
    const [fileList, setFileList] = useState([]);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
        setShowModal(!showModal);
    };

    const handleDeleteFile = (file) => {
        const updatedFileList = fileList.filter(f => f.uid !== file.uid);
        setFileList(updatedFileList);
        setError(''); // Clear any existing errors when a file is removed
    };

    return (
        <>
            <div className={`flex flex-col w-full gap-2 ${parentClass}`}>
                {label && <label htmlFor={name} className={`font-medium ml-0.5 text-[#000000] ${labelClass}`}>{label}</label>}
                <div
                    className={`flex items-center border relative w-full py-2 border-solid border-[#6E6E6E] overflow-hidden ${disabled ? "bg-[#eceff1] cursor-not-allowed" : "bg-transparent cursor-pointer"} rounded-sm`}
                    onClick={disabled ? () => { } : handleShowModal}
                >
                    <h2 className={`w-full px-2.5 text-[#6E6E6E] text-sm font-poppins placeholder:font-poppins placeholder:not-italic placeholder:text-sm placeholder:leading-normal placeholder:font-medium placeholder:text-[#6E6E6E] not-italic leading-normal bg-transparent font-medium outline-none border-none ${className}`}>
                        {fileList.length > 0 ? `Selected Files: ${fileList.length}` : placeholder}
                    </h2>
                    <GoUpload size={"18px"} className="text-[#6E6E6E] bg-transparent mr-3" />
                </div>
                {errors[name] && <p className="text-red-500">{errors[name]?.message}</p>}
            </div>

            <Dialog
                open={showModal}
                handler={handleShowModal}
                className={`overflow-hidden rounded-md w-full scroll-remove max-w-lg ${modalClass}`}
            >
                <DialogHeader className={`text-xl text-white bg-[#181818] poppins-font ${modalHeadClass}`}>
                    <div className="flex w-full justify-between font-poppins not-italic leading-normal text-[16px] items-center">
                        <span className={modalLabelClass}>{modalLabel}</span>
                        <button onClick={handleShowModal} className="active:text-red-600 transition-all outline-none select-none">
                            <RxCross2 size={"20px"} />
                        </button>
                    </div>
                </DialogHeader>
                <DialogBody className={`bg-transparent lg:p-3 overflow-y-scroll h-72 uploads-field ${modalBodyClass}`}>
                    <form className="flex flex-col gap-y-4 p-4">
                        {/* Ant Design Dragger Component */}
                        <Controller
                            name={name}
                            control={control}
                            rules={{ required: 'Please upload at least one file.' }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Dragger
                                    name={name}
                                    multiple={true} // Allow multiple file selection
                                    beforeUpload={() => false} // Prevent automatic upload
                                    onChange={(info) => {
                                        const { fileList } = info;
                                        if (fileList.length > max) {
                                            message.error(`You can only upload up to ${max} files.`);
                                            return;
                                        }
                                        setFileList(fileList); // Update file list
                                        setError('');
                                        onChange(fileList); // Update form value
                                    }}
                                    fileList={fileList}
                                    onRemove={(file) => {
                                        handleDeleteFile(file);
                                        onChange(fileList.filter(f => f.uid !== file.uid)); // Update form value
                                    }}
                                    className="bg-transparent h-auto border-none" // Custom styling for Dragger
                                >
                                    <p className="w-full flex justify-center items-center my-3">
                                        <FiUpload size={"50px"} />
                                    </p>
                                    <p className="ant-upload-text font-semibold">Click or drag file to this area to upload</p>
                                    <p className=" text-[#4b4b4b] font-medium">
                                        Upload up to {max} files. Strictly prohibited from uploading company data or other banned files.
                                    </p>
                                </Dragger>
                            )}
                        />
                        {/* Error Message */}
                        {errors[name] && <p className="text-red-500 mt-2">{errors[name]?.message}</p>}
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                        {/*
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Selected Files:</h3>
                            <ul className="list-disc pl-5 mt-2">
                                {fileList.map((file) => (
                                    <li key={file.uid} className="py-1 flex items-center justify-between">
                                        {file.name}
                                        <Button
                                            icon={<FiTrash2 />}
                                            size="small"
                                            onClick={() => handleDeleteFile(file)}
                                            className="ml-2"
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div> */}
                    </form>
                </DialogBody>
            </Dialog>
        </>
    );
};

export default UploadsField;
