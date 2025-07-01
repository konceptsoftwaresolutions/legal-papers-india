import React from "react";
import { Button } from "@material-tailwind/react";
import { Tooltip } from "antd";

/**
 * 
 * @param {Object} props
 * @param {'button' | 'submit' | 'reset'} props.type
 * @param {String} props.title
 * @param {String} props.className
 * @param {Function} props.onClick
 * @param {Object} props.children
 * @param {'bottom' | 'bottomLeft' | 'bottomRight' | 'top' | 'topLeft' | 'topRight' | 'left' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom'} props.placement default bottom
 * @returns 
 */
const MyButton = ({
    title = null,
    children,
    placement = "bottom",
    onClick = () => { },
    className = "",
    type = "button"
}) => {
    return <>
        <Tooltip title={title} placement={placement}>
            <Button
                type={type}
                className={`main-text normal-case font-medium shadow-sm hover:shadow-sm rounded-md ${className}`}
                onClick={onClick}
            >{children}</Button>
        </Tooltip>
    </>
}

export default MyButton;