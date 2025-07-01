import React from "react";

// icons
import { MdOutlinePlaylistAddCheck } from "react-icons/md"; // list
import { FiDownloadCloud } from "react-icons/fi"; // download
import { CgPlayListSearch } from "react-icons/cg"; // search list

// components
import TouchableOpacity from "../buttons/TouchableOpacity";

// hooks
import useDocument from "../../hooks/useDocument";

const UserList = ({
    title = "",
    list = [],
}) => {
    // hooks
    const docs = useDocument();

    const colors = ["bg-rose-700", "bg-blue-700", "bg-green-700", "bg-purple-700"];

    const Origin = ({ index }) => {
        // Cycle through colors based on index
        const bgColor = colors[index % colors.length];
        return (
            <div className={`flex justify-center items-center w-3.5 h-3.5 rounded-full ${bgColor}`}>
                <div className="bg-white rounded-full w-2 h-2"></div>
            </div>
        );
    };

    // download excel
    const handleExcel = () => {
        if(list && list?.length > 0){
            let fileName = title.toLowerCase().split(' ').join('');
            docs.downloadXLSX(list, fileName);
        }
    }

    return (
        <div className="rounded-md border border-solid main-text bg-white border-gray-300 w-full">
            <div className="w-full py-3 px-4 border-b border-solid border-gray-400 flex justify-between items-center">
                <div className="flex justify-center items-center gap-x-2">
                    <MdOutlinePlaylistAddCheck size={20} className="text-blue-800" />
                    <h2>{title}</h2>
                </div>
                <div>
                    <TouchableOpacity
                        title={"Download"} 
                        placement="top" 
                        className="text-gray-800 hover:text-blue-800"
                        onClick={handleExcel}
                    >
                        <FiDownloadCloud size={17} />
                    </TouchableOpacity>
                </div>
            </div>
            <div className="h-64 px-4 py-3 list-none space-y-5 overflow-y-scroll">
                {
                    list && list?.length > 0 ? list.map(({ name, email , mobile }, index) => (
                        <li key={index} className="flex justify-start items-center gap-x-5 my-2">
                            <Origin index={index} />
                            <div className="flex flex-col justify-start items-start">
                                <p className="text-[15px]">{name || ''}</p>
                                <p className="text-[13px]">{email || ''}</p>
                                <p className="text-[13px]">{mobile || ''}</p>
                            </div>
                        </li>
                    )): <div className="h-full w-full flex justify-center gap-x-1 items-center">
                        <CgPlayListSearch size={25} className="text-gray-800" />
                        <h2 className="text-gray-800">List Unavailable</h2>
                    </div>
                }
            </div>
        </div>
    );
};

export default UserList;
