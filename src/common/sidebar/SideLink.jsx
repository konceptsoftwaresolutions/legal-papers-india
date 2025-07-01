import React from "react";
import MyLink from "../../components/buttons/MyLink";
import { Button } from "@material-tailwind/react";

const SideLink = ({
    path,
    icon,
    text = "",
    active,
    collapse = false,
}) => {
    return <>
        <MyLink to={path} title={collapse ? text : null} placement="right" className="w-full flex justify-center items-center">
            <Button className={`font-poppins not-italic flex ${collapse ? "justify-center" : "justify-start"} my-1 px-3 items-center font-medium text-[15px] w-full leading-normal capitalize gap-x-3 text-[#FFFFFF] transition-none text-start rounded-md ${active ? "main-bg" : "bg-transparent shadow-none border-2 border-solid border-transparent main-border-hover"}`}>
                {icon}
                <span className={`${collapse ? "w-0 transition-all overflow-hidden hidden" : "w-auto"}`}>{text}</span>
            </Button>
        </MyLink>
    </>
}

export default SideLink;