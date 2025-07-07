import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import FilterClientFiles from "./FilterClientFiles";
import { setClientFilePage } from "../../redux/features/clientFiles/clientFilesSlice";
import { useNavigate } from "react-router-dom";
import MyButton from "../../components/buttons/MyButton";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import Heading from "../../common/Heading";
import { LuListFilter, LuPlus } from "react-icons/lu";

const ClientFiles = () => {
  const { items, currentPage, perPage } = useSelector((s) => s.clientFiles);
  const userRole = useSelector((s) => s.auth?.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filterOpen, setFilterOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [filteredClientFiles, setFilteredClientFiles] = useState([]);

  // Update filtered data only if active
  useEffect(() => {
    if (!isFilterActive) {
      setFilteredClientFiles([]);
    }
  }, [items, isFilterActive]);

  const filterClientFiles = (criteria) => {
    const keyMap = {
      name: "name",
      mobileNumber: "mobileNumber",
      leadId: "leadID", // map the form's leadId to leadID in data
    };

    const filtered = items.filter((item) =>
      Object.entries(criteria).every(([formKey, value]) => {
        const actualKey = keyMap[formKey];
        return String(item[actualKey] || "")
          .toLowerCase()
          .includes(String(value).toLowerCase());
      })
    );

    setFilteredClientFiles(filtered);
    setIsFilterActive(true);
  };

  const resetClientFiles = () => {
    setFilteredClientFiles([]);
    setIsFilterActive(false);
  };

  const handleAddNavigate = () => {
    if (userRole === "superAdmin") {
      navigate("/superAdmin/add-client-file");
    }
  };

  const handleEdit = (id) => {
    if (userRole === "superAdmin") {
      navigate(`/superAdmin/edit-client-file/${id}`);
    }
  };

  const cols = [
    { name: "Lead ID", selector: (row) => row.leadID },
    { name: "Name", selector: (row) => row.name },
    { name: "Mobile", selector: (row) => row.mobileNumber },
    {
      name: "Action",
      cell: (row) =>
        row.photoNote ? (
          <a href={row.photoNote} target="_blank" rel="noreferrer">
            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              Download
            </button>
          </a>
        ) : (
          <span className="text-gray-500">N/A</span>
        ),
    },
  ];

  // Correct data based on filter state
  const displayData = isFilterActive ? filteredClientFiles : items;

  return (
    <div className="p-4 w-full">
      <Heading text="Client Files" showHeading />
      <div className="flex justify-end my-2">
        <div className="flex gap-2">
          <MyButton
            className="main-bg py-2 flex justify-center items-center text-[15px] font-medium px-4 gap-x-1"
            onClick={() => setFilterOpen(true)}
          >
            <LuListFilter className="text-white" />
            Filter
          </MyButton>
          <MyButton
            className="main-bg py-2 flex justify-center items-center text-[15px] font-medium px-4 gap-x-1"
            onClick={handleAddNavigate}
          >
            <LuPlus className="text-white" />
            Add Client File
          </MyButton>
        </div>
      </div>

      {isFilterActive && (
        <div className="flex justify-center mb-4">
          <p className="main-bg py-2 px-3 text-white rounded-md">
            You are viewing the filtered data...
          </p>
        </div>
      )}

      <DataTable
        data={[...displayData].reverse()}
        columns={cols}
        customStyles={tableCustomStyles}
        pagination
        selectableRows
        paginationPerPage={perPage}
        paginationTotalRows={displayData.length}
        paginationDefaultPage={currentPage || 1}
        onChangePage={(page) => dispatch(setClientFilePage(page))}
        onRowClicked={(row) => handleEdit(row.id)}
        noDataComponent="There is no record to display..."
      />

      <FilterClientFiles
        isOpen={filterOpen}
        setIsOpen={setFilterOpen}
        setIsFilterActive={setIsFilterActive}
        filterClientFiles={filterClientFiles}
        resetClientFiles={resetClientFiles}
      />
    </div>
  );
};

export default ClientFiles;
