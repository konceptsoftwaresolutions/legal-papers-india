import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { deleteService, getAllServices } from "../../redux/features/services";
import { useNavigate } from "react-router-dom";
import MyButton from "../../components/buttons/MyButton";
import Heading from "../../common/Heading";
import { LuListFilter, LuPlus } from "react-icons/lu";
import FilterServices from "./FilterServices";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import { FiTrash2 } from "react-icons/fi";
import { Spinner } from "@material-tailwind/react";

const Services = () => {
  const { services, loading } = useSelector((s) => s.services);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filterOpen, setFilterOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    dispatch(getAllServices());
  }, [dispatch]);

  const filterServices = (criteria) => {
    const filtered = services.filter((item) =>
      Object.entries(criteria).every(([key, value]) =>
        String(item[key] || "")
          .toLowerCase()
          .includes(value.toLowerCase())
      )
    );
    setFilteredServices(filtered);
    setIsFilterActive(true);
  };

  const resetServices = () => {
    setFilteredServices([]);
    setIsFilterActive(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      dispatch(deleteService(id));
    }
  };

  const handleEdit = (id) => navigate(`/superAdmin/edit-service/${id}`);
  const handleAdd = () => navigate(`/superAdmin/add-service`);

  const cols = [
    { name: "Name", selector: (row) => row.name },
    { name: "HSN Code", selector: (row) => row.hsnCode },
    { name: "Price", selector: (row) => row.price },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-4">
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Delete"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
      ignoreRowClick: true, // prevents icon clicks from triggering row click
      allowOverflow: true,
      button: true,
    },
  ];

  const displayData = isFilterActive ? filteredServices : services || [];

  return (
    <div className="p-4 w-full">
      <Heading text="Services" showHeading />
      <div className="flex justify-end my-2 gap-2">
        <MyButton
          className="main-bg py-2 flex justify-center items-center text-[15px] font-medium px-4 gap-x-1"
          onClick={() => setFilterOpen(true)}
        >
          <LuListFilter />
          Filter
        </MyButton>
        <MyButton
          className="main-bg py-2 flex justify-center items-center text-[15px] font-medium px-4 gap-x-1"
          onClick={handleAdd}
        >
          <LuPlus />
          Add Service
        </MyButton>
      </div>

      {/* ✅ Spinner show while loading */}
      {loading ? (
        <div className="h-[90vh] w-full flex justify-center items-center gap-2">
          <p className="md:text-lg flex gap-2">
            <Spinner /> Loading ...
          </p>
        </div>
      ) : (
        <>
          {isFilterActive && (
            <p className="text-sm text-center text-green-600 mb-2">
              You are viewing the filtered data...
            </p>
          )}

          <DataTable
            data={[...displayData].reverse()}
            columns={cols}
            customStyles={tableCustomStyles}
            pagination
            paginationPerPage={10}
            paginationTotalRows={displayData.length}
            paginationDefaultPage={1}
            onRowClicked={(row) => handleEdit(row._id)}
            noDataComponent="No services found"
            selectableRows
          />
        </>
      )}

      <FilterServices
        isOpen={filterOpen}
        setIsOpen={setFilterOpen}
        setIsFilterActive={setIsFilterActive}
        filterServices={filterServices}
        resetServices={resetServices}
      />
    </div>
  );
};

export default Services;
