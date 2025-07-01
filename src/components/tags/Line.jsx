import React from "react";

/**
 * @param Object
 * @param {'x' | 'y'} props.axis default x axis
 * @returns 
 */
const Line = ({
    axis = "x",
}) => {
    return <>
        <div className={`${axis === "x" ? "w-full h-[1px]": "h-full w-[1px]"} bg-gray-300`}></div>
    </>
}

export default Line;