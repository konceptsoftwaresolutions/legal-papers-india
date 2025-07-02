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
    dispatch(getNotificationData());
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
      <div className="p-3 w-full">
        <Heading text="Tasks" showHeading />
        <div className="w-full flex justify-end items-center gap-x-3">
          <MyButton
            className="main-bg py-2 flex justify-center items-center text-[15px] font-medium px-4 gap-x-1"
            onClick={() => {
              setShowQuotation(!showQuotation);
              console.log(":cll", showQuotation);
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
            <>
              {/* <MyButton
                className="main-bg py-2 flex justify-center items-center text-[15px] font-medium px-4 gap-x-1"
                // onClick={openFilter}
              >
                <BiExport size={16} className="rotate-90" />
                <span>Export</span>
              </MyButton> */}
              {/* <XLSXExportButton data={filteredTasks ? filteredTasks : []} filename="tasks_data" /> */}
              <CSVExportButton
                data={filteredTasks ? filteredTasks : []}
                filename="leads_data"
              />
            </>
          )}
          <MyButton
            className="main-bg py-2 flex justify-center items-center text-[15px] font-medium px-4 gap-x-1"
            onClick={() => setIsFilterOpen(true)}
          >
            <LuListFilter size={16} />
            <span>Filter</span>
          </MyButton>
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
