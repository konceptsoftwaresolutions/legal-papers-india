import React from "react";
import { Link } from "react-router-dom";

const MyLink = ({
    children,
    className = "",
    to = null,
}) => {
    const role = "superAdmin";

    return to && to !== "" ? <Link to={`/${role}/${to}`} className={className}>{children}</Link> : children   
}

export default MyLink;