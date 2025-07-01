import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { tableCustomStyles } from "../../constants/tableCustomStyle";

const EditableTable = ({
  columns,
  data,
  onSave,
  customStyles,
  paginationPerPage = 10,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState(data);

  // Toggle edit mode
  const toggleEdit = () => {
    if (isEditing && onSave) {
      onSave(editableData); // Save updated data when exiting edit mode
    }
    setIsEditing(!isEditing);
  };

  // Handle changes to editable fields
  const handleInputChange = (value, rowIndex, field) => {
    const updatedData = [...editableData];
    updatedData[rowIndex][field] = value;
    setEditableData(updatedData);
  };

  // Generate editable columns dynamically
  const editableColumns = columns.map((col) => ({
    ...col,
    cell: (row, rowIndex) =>
      isEditing && col.isEditable ? (
        <input
          type="text"
          value={row[col.selector(row)] || ""}
          onChange={(e) =>
            handleInputChange(e.target.value, rowIndex, col.selector(row))
          }
          className="border border-gray-300 rounded p-1"
        />
      ) : (
        col.selector(row)
      ),
  }));

  return (
    <div>
      <button
        onClick={toggleEdit}
        className="main-bg py-2 px-4 text-white rounded-md mb-4"
      >
        {isEditing ? "Save" : "Edit"}
      </button>
      <DataTable
        columns={editableColumns}
        data={editableData}
        noDataComponent="No data available"
        customStyles={tableCustomStyles}
        paginationPerPage={paginationPerPage}
        selectableRows
      />
    </div>
  );
};

export default EditableTable;
