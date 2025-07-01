import { Tooltip } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const MyLink = ({ children, to = "", className = "", title = null, placement = "bottom" }) => {

    const {role} = useSelector( (state) => state.auth )

    // const role = "superAdmin";
    // const { role } = useSelector(state => state.auth);

    return <>
        <Tooltip title={title} placement={placement}>
            <Link to={`/${role}/${to}`} className={className}>{children}</Link>
        </Tooltip>
    </>
}

export default MyLink;