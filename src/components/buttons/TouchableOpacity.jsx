import React from "react";
import { Button } from "@material-tailwind/react";
import { Tooltip } from "antd";

const TouchableOpacity = ({
    children,
    className = "",
    onClick = () => { },
    onMouseEnter = () => { },
    onMouseLeave = () => { },
    title = null,
    placement = "bottom"
}) => {
    return <>
        <Tooltip title={title} placement={placement}>
            <Button
                className={`main-text bg-transparent py-1 px-2 shadow-none hover:shadow-none rounded-md ${className}`}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {children}
            </Button>
        </Tooltip>
    </>
}

export default TouchableOpacity;