import React, { useRef, useState } from "react";
import SlidingDiv from "./SlidingDiv";
import { FiFilter } from "react-icons/fi";

function Filter({ onFilterSubmit }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const SliderRef = useRef(null);

  const toggleDiv = () => {
    SliderRef.current.className = " h-full fixed top-0 right-0 z-50";
    setIsOpen(!isOpen);
  };

  const CloseSlider = (e) => {
    const _id = e.target.id;
    if (_id === "slider") {
      setIsOpen(false);
      SliderRef.current.className = "w-0 h-full fixed top-0 right-0 z-50";
    }
  };

  const handleFormSubmit = (data) => {
    if (Object.keys(data).length > 0) {
      setIsFilterActive(true);
    } else {
      setIsFilterActive(false);
    }
    onFilterSubmit(data); // Pass data to parent component
    setIsOpen(false); // Close the sliding div
  };

  return (
    <>
      <button onClick={toggleDiv} className="cstm-green-outline-btn rounded-md">
        <span className="inline-block mb-[-2px] mr-1 font-medium">
          <FiFilter />
        </span>
        Filters
      </button>
      <div
        ref={SliderRef}
        className="h-full fixed top-0 right-0 z-50"
        id="slider"
        onClick={CloseSlider}
      >
        <SlidingDiv
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={handleFormSubmit}
        />
      </div>
    </>
  );
}

export default Filter;
