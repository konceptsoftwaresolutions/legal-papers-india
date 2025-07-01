import { useState } from "react";

const useFilter = () => {
  const [filter, setFilter] = useState([]);

  /**
   * Set filter data
   */
  const set = (filterData = []) => {
    // console.log("Filter data set:", filterData);
    setFilter(filterData);
  };

  /**
   * Get filtered data based on criteria
   */
  const get = (criteria = {}) => {
    // console.log("Criteria:", criteria);

    if (Object.keys(criteria).length === 0) return filter;

    // Filter the data based on the criteria
    const filteredData = filter.filter((item) =>
      Object.keys(criteria).every((key) => {
        const itemValue = item[key] ? item[key].toString().toLowerCase() : "";
        // console.log("Item Value:", itemValue, "Key:", key);
        const criteriaValue = criteria[key] ? criteria[key].toString().toLowerCase() : "";
        // console.log("Criteria Value:", criteriaValue, "Key:", key);

        // Handle date case separately if needed
        if (key === "date") {
          return item[key].split(" ")[0] === criteria[key];
        }

        // Use .includes() for partial matching
        return itemValue.includes(criteriaValue);
      })
    );

    // console.log("Filtered Data:", filteredData);
    return filteredData;
  };

  return {
    set,
    get,
    filter,
  };
};

export default useFilter;
