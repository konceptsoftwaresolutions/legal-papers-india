import React from "react";
import { Button } from "@material-tailwind/react";

const OpacityButton = ({
    children,
    className = "",
    update = false,
    count,
    onClick = () => { },
    onMouseEnter = () => { },
    onMouseLeave = () => { },
}) => {
    return <>
        <div className="w-auto h-auto relative">
            { update ? <p className="text-white absolute right-[0px] bg-red-800 px-1 text-sm rounded-full py-0">{count}</p> : ''}
            {/* { update ? <div className="bg-[#ff0000] p-2 w-2 top-0 z-20 right-1 h-2 absolute rounded-full text-white"><span>{count}</span></div>: null } */}
            <Button
                className={`bg-[#ffffff00] shadow-none hover:shadow-none main-text p-2 ${className}`}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
            >{children}</Button>
        </div>
    </>
}

export default OpacityButton;