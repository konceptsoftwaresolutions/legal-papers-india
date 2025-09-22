import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { LuListFilter, LuPlus } from "react-icons/lu";
import { FiTrash2 } from "react-icons/fi";
import { Spinner } from "@material-tailwind/react";
import FilterAddresses from "./FilterAddresses";
import {
  deleteAddress,
  getAllAddresses,
} from "../../../redux/features/services";
import MyButton from "../../../components/buttons/MyButton";
import Heading from "../../../common/Heading";
import { tableCustomStyles } from "../../../constants/tableCustomStyle";
import AddressModal from "./AddressModal"; // ✅ नया modal import

const Addresses = () => {
  const { addresses, loading } = useSelector((s) => s.services);
  const dispatch = useDispatch();

  const [filterOpen, setFilterOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [filteredAddresses, setFilteredAddresses] = useState([]);

  // ✅ modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    dispatch(getAllAddresses());
  }, [dispatch]);

  const filterAddresses = (criteria) => {
    const filtered = addresses.filter((item) =>
      String(item.addressLine1 || "")
        .toLowerCase()
        .includes(criteria.addressLine1.toLowerCase())
    );
    setFilteredAddresses(filtered);
    setIsFilterActive(true);
  };

  const resetAddresses = () => {
    setFilteredAddresses([]);
    setIsFilterActive(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      dispatch(deleteAddress(id));
    }
  };

  const handleEdit = (row) => {
    setModalMode("edit");
    setSelectedAddress(row);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setModalMode("add");
    setSelectedAddress(null);
    setModalOpen(true);
  };

  const cols = [
    {
      name: "Address Line 1",
      selector: (row) =>
        row.addressLine1
          ? new DOMParser().parseFromString(row.addressLine1, "text/html").body
              .textContent || ""
          : "",
    },
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
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Edit"
          >
            ✏️
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const displayData = Array.isArray(addresses?.data) ? addresses.data : [];

  return (
    <div className="p-4 w-full">
      <Heading text="Addresses" showHeading />
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
          Add Address
        </MyButton>
      </div>

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
            onRowClicked={(row) => handleEdit(row)}
            noDataComponent="No addresses found"
            selectableRows
          />
        </>
      )}

      <FilterAddresses
        isOpen={filterOpen}
        setIsOpen={setFilterOpen}
        setIsFilterActive={setIsFilterActive}
        filterAddresses={filterAddresses}
        resetAddresses={resetAddresses}
      />

      {/* ✅ Add/Edit Modal */}
      <AddressModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        mode={modalMode}
        data={selectedAddress}
      />
    </div>
  );
};

export default Addresses;
