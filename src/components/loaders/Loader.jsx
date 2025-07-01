import { Spin } from "antd";
import React from "react";

/**
 * @param {Object} props
 * @param {'absolute' | 'fixed'} props.position 
 */
const Loader = ({
    position = "fixed"
}) => {
    return <>
        <div className={`${position} top-0 left-0 w-full h-full bg-white/50 z-50 flex justify-center items-center`}>
            <Spin />
        </div>
    </>
}

export default Loader;