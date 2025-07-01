import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Pagination } from "antd";

// styles
import "./reacttable.css";
import { tableCustomStyles } from "../../constants/tableCustomStyle";

// Custom pagination item rendering
const itemRender = (current, type, originalElement) => {
    if (type === 'prev') return <span className="font-poppins font-medium select-none mr-1 text-[#000000]">Previous Page</span>;
    if (type === 'next') return <span className="font-poppins font-medium select-none ml-1 text-[#000000]">Next Page</span>;
    return originalElement;
};

const ReactTable = ({ 
    data = [], 
    Columns = function(){}, 
    totalPages = 1, 
    changePage = function(){}, 
    customStyles = null, 
    tableClass = "",
    paginationClass = "",
    selectedAll = function(){},
    onSelectedRowsChange = function(){},
}) => {
    const [selectedRows, setSelectedRows] = useState([]);

    // Function to wrap columns with a custom select field
    const WrapSelector = (cols = []) => {
        const selectColumn = {
            name: <input type="checkbox" className="cursor-pointer" onChange={() => selectedAll(true)} />,
            cell: row => (
                <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={selectedRows.some(selectedRow => selectedRow._id === row._id)}  // Check if row is selected
                    onChange={() => handleRowSelect(row)}  // Handle row selection
                />
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        };

        // Combine selectColumn with existing columns
        const combinedColumns = [selectColumn, ...cols];

        return combinedColumns;
    };

    // Handle row selection
    const handleRowSelect = (row) => {
        const isSelected = selectedRows.some(selectedRow => selectedRow._id === row._id);
        const newSelectedRows = isSelected
            ? selectedRows.filter(selectedRow => selectedRow._id !== row._id)
            : [...selectedRows, row];

        setSelectedRows(newSelectedRows);
        onSelectedRowsChange(newSelectedRows);
        // console.log("Selected Rows:", newSelectedRows);
    };

    return (
        <>
            <div className="w-full">
                <DataTable
                    columns={WrapSelector(Columns)}
                    data={data}
                    // selectableRows  // Enable row selection
                    // onSelectedRowsChange={handleSelectedRowsChange}  // Update state on selection change
                    customStyles={customStyles || tableCustomStyles}
                    className={`${tableClass}`}
                />
            </div>

            <div className="w-full flex my-6 justify-end items-center">
                <Pagination
                    total={totalPages ? (totalPages * 10) : 10}  // Total number of items
                    showLessItems  // Display less page items
                    hideOnSinglePage  // Hide pagination when there is only one page
                    showSizeChanger={false}  // Hide page size selector
                    itemRender={itemRender}  // Use custom item render function
                    className={`customPagination ${paginationClass}`}
                    onChange={changePage}
                />
            </div>
        </>
    );
}

export default ReactTable;
