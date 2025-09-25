import React, { useEffect, useState } from "react";

// table
import DataTable from "react-data-table-component";
import { tableCustomStyles } from "../../constants/tableCustomStyle";
import MyButton from "../../components/buttons/MyButton";
import { LuListFilter } from "react-icons/lu";
import { MdOutlineCreate } from "react-icons/md";
import { BiExport } from "react-icons/bi";
import { deleteTask, getAllTasks } from "../../redux/features/tasks";
import { useDispatch, useSelector } from "react-redux";
import { columns } from "./columns";
import Heading from "../../common/Heading";
import { useNavigate } from "react-router-dom";
import AddTaskModal from "./AddTaskModal";
import TasksFilter from "./TasksFilter";
import { getNotificationData } from "../../redux/features/notification";
import { Spinner } from "@material-tailwind/react";
import CSVExportButton from "../../common/CSVExportButton";

const Tasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = () => {
    dispatch(getAllTasks());
    // dispatch(getNotificationData());
  };

  useEffect(() => {
    getData();
  }, [dispatch]);

  const { allTasks } = useSelector((state) => state.tasks);
  const { role } = useSelector((state) => state.auth);
  const [showQuotation, setShowQuotation] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const [filteredTasks, setFilteredTasks] = useState([]);

  const handleRowClick = (row) => {
    const link = `/${role}/editLead`;
    navigate(link, { state: { leadData: row } });
  };

  const filterTasks = (filterCriteria) => {
    const filteredData = allTasks?.filter((user) => {
      return Object.entries(filterCriteria).every(([key, value]) => {
        if (!value) return true;

        return String(user[key])
          .toLowerCase()
          .includes(String(value).toLowerCase());
      });
    });

    setFilteredTasks(filteredData);
    console.log(filteredData);
  };

  const resetTasks = () => {
    setFilteredTasks(allTasks);
  };

  useEffect(() => {
    if (Array.isArray(allTasks)) {
      setFilteredTasks(allTasks);
    } else {
      console.error("Expected an array but got:", allTasks);
      setFilteredTasks([]); // Handle non-array response gracefully
    }
  }, [allTasks]);

  const handleTaskDelete = (taskId) => {
    // console.log(taskId)
    dispatch(
      deleteTask(taskId, (success) => {
        if (success) {
          getData();
        }
      })
    );
  };

  return (
    <>
      <div className="p-3 md:p-4 lg:p-6 w-full">
        {/* Header Section */}
        <div className="mb-4 md:mb-6">
          <Heading text="Tasks" showHeading />
        </div>

        {/* Action Buttons - Responsive Layout */}
        <div className="mb-4 md:mb-6">
          {/* Mobile Layout */}
          <div className="block md:hidden space-y-3">
            {/* Primary Action Button */}
            <div className="w-full">
              <MyButton
                className="main-bg py-2.5 flex justify-center items-center text-[15px] font-medium px-4 gap-x-2 w-full transition-all duration-200 hover:shadow-lg"
                onClick={() => {
                  setShowQuotation(!showQuotation);
                }}
              >
                <MdOutlineCreate size={16} />
                <span>Create Task</span>
              </MyButton>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-2">
              {/* Export Button - Mobile */}
              {!(
                role === "salesTl" ||
                role === "operationsTl" ||
                role === "salesExecutive"
              ) && (
                <div className="flex-1">
                  <CSVExportButton
                    data={filteredTasks ? filteredTasks : []}
                    filename="tasks_data"
                    className="w-full py-2.5 text-[14px] font-medium flex justify-center items-center gap-x-1 main-bg text-white rounded transition-all duration-200 hover:shadow-lg"
                  />
                </div>
              )}

              {/* Filter Button - Mobile */}
              <div className="flex-1">
                <MyButton
                  className="main-bg py-2.5 flex justify-center items-center text-[14px] font-medium px-4 gap-x-1 w-full transition-all duration-200 hover:shadow-lg"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <LuListFilter size={16} />
                  <span>Filter</span>
                </MyButton>
              </div>
            </div>
          </div>

          {/* Tablet & Desktop Layout */}
          <div className="hidden md:flex md:justify-end md:items-center gap-x-3">
            <MyButton
              className="main-bg py-2 flex justify-center items-center text-[15px] font-medium px-4 gap-x-1 transition-all duration-200 hover:shadow-lg"
              onClick={() => {
                setShowQuotation(!showQuotation);
              }}
            >
              <MdOutlineCreate size={16} />
              <span>Create Task</span>
            </MyButton>

            {!(
              role === "salesTl" ||
              role === "operationsTl" ||
              role === "salesExecutive"
            ) && (
              <CSVExportButton
                data={filteredTasks ? filteredTasks : []}
                filename="tasks_data"
                className="py-2 text-[15px] font-medium flex justify-center items-center gap-x-1 px-4 main-bg text-white rounded transition-all duration-200 hover:shadow-lg"
              />
            )}

            <MyButton
              className="main-bg py-2 flex justify-center items-center text-[15px] font-medium px-4 gap-x-1 transition-all duration-200 hover:shadow-lg"
              onClick={() => setIsFilterOpen(true)}
            >
              <LuListFilter size={16} />
              <span>Filter</span>
            </MyButton>
          </div>
        </div>
        <div className="py-3 w-full">
          {isFilterActive && (
            <div className="flex justify-center mb-4">
              <p className="main-bg py-2 px-3 text-white rounded-md">
                You are viewing the filtered data...
              </p>
            </div>
          )}
          {filteredTasks ? (
            <>
              <DataTable
                columns={columns(handleTaskDelete, role, navigate)}
                data={filteredTasks ? [...filteredTasks].reverse() : []}
                selectableRows
                noDataComponent="There is no record to display..."
                customStyles={tableCustomStyles}
                // onRowClicked={handleRowClick}
                pagination
              />
            </>
          ) : (
            <div className="h-[90vh] w-full flex justify-center items-center gap-2">
              <p className="md:text-lg flex gap-2">
                <Spinner /> Loading ...
              </p>
            </div>
          )}
        </div>
      </div>
      <AddTaskModal
        showTaskModal={showQuotation}
        setShowTaskModal={setShowQuotation}
      />
      <TasksFilter
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
        setIsFilterActive={setIsFilterActive}
        filterTasks={filterTasks}
        resetTasks={resetTasks}
      />
    </>
  );
};

export default Tasks;
