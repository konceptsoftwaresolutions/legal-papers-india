// import React from "react";
// import { Button, IconButton } from "@material-tailwind/react";
// import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

// const Pagination = ({ totalPages, currentPage = 1, onPageChange }) => {
//   const getVisiblePages = (current, total) => {
//     const range = [];
//     const maxVisible = 3; // Maximum number of pages to display (including first and last)
//     const halfRange = Math.floor(maxVisible / 2);
//     console.log("inside page", currentPage);

//     const start = Math.max(2, current - halfRange);
//     const end = Math.min(total - 1, current + halfRange);

//     if (start > 2) range.push("...");
//     for (let i = start; i <= end; i++) range.push(i);
//     if (end < total - 1) range.push("...");
//     return [1, ...range, total];
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       onPageChange(currentPage + 1);
//     }
//   };

//   const handlePrev = () => {
//     if (currentPage > 1) {
//       onPageChange(currentPage - 1);
//     }
//   };

//   const visiblePages = getVisiblePages(currentPage, totalPages);

//   return (
//     <div className="flex items-center justify-end gap-4 mt-3">
//       <Button
//         variant="text"
//         className="flex items-center gap-2"
//         onClick={handlePrev}
//         disabled={currentPage === 1}
//       >
//         <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
//       </Button>
//       <div className="flex items-center gap-2">
//         {visiblePages.map((page, index) => (
//           <IconButton
//             key={index}
//             variant={currentPage === page ? "filled" : "text"} // Highlight the active page
//             color={currentPage === page ? "blue" : "gray"} // Use a different color for the active page
//             className={`${currentPage === page ? "font-bold main-bg" : ""}`} // Optionally apply bold styling to the active page
//             onClick={() => typeof page === "number" && onPageChange(page)}
//             disabled={typeof page !== "number"}
//           >
//             {page}
//           </IconButton>
//         ))}
//       </div>
//       <Button
//         variant="text"
//         className="flex items-center gap-2"
//         onClick={handleNext}
//         disabled={currentPage === totalPages}
//       >
//         Next
//         <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
//       </Button>
//     </div>
//   );
// };

// export default Pagination;


import React from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const Pagination = ({ totalPages, currentPage = 1, onPageChange }) => {
  const getVisiblePages = (current, total) => {
    const range = [];
    const maxVisible = 3;
    const halfRange = Math.floor(maxVisible / 2);
    console.log("inside page", currentPage);

    const start = Math.max(2, current - halfRange);
    const end = Math.min(total - 1, current + halfRange);

    if (start > 2) range.push("...");
    for (let i = start; i <= end; i++) range.push(i);
    if (end < total - 1) range.push("...");
    return [1, ...range, total];
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 mt-3 w-full">
      
      {/* Previous Button */}
      <Button
        variant="text"
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 min-w-[80px] sm:min-w-[100px]"
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
        <span className="text-sm">Previous</span>
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-[150px] sm:max-w-none">
        {visiblePages.map((page, index) => (
          <IconButton
            key={index}
            variant={currentPage === page ? "filled" : "text"}
            color={currentPage === page ? "blue" : "gray"}
            className={`${currentPage === page ? "font-bold main-bg" : ""} flex-shrink-0 min-w-[32px] h-8 sm:min-w-[40px] sm:h-10`}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={typeof page !== "number"}
          >
            {page}
          </IconButton>
        ))}
      </div>

      {/* Next Button */}
      <Button
        variant="text"
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 min-w-[80px] sm:min-w-[100px]"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        <span className="text-sm">Next</span>
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
