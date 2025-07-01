import React, { useMemo } from "react";
// import CountUp from "react-countup/build/CountUp";

// icons
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import Counter from "../../common/Counter";

const GrowthCard = ({
    icon,
    title = "",
    number = 0,
    percentage = 0,
    midpoint = 50,
}) => {
    let percent = useMemo(() => {
        return typeof percentage === "string" ? parseFloat(percentage) : percentage;
    }, [percentage]);

    return <>
        <div className="flex main-text justify-start gap-x-6 items-center">
            <div className="flex justify-center items-center">
                {icon}
            </div>
            <div className="flex justify-start items-start w-full flex-col">
                <h2 className="font-medium text-gray-800">{title}</h2>
                <h2 className="font-medium text-[40px] text-gray-900"><Counter number={number}/></h2>
                <div className="flex justify-start flex-row text-[15px] w-full items-center gap-x-1">
                    <span>{percent > midpoint ? "Increased by": 'Decreased by'}</span>
                    <span className={`flex justify-center items-center gap-x-1 ${percent > midpoint ? "text-green-700" : "text-red-700"}`}>
                        {percent > midpoint ? <IoIosArrowUp size={18} /> : <IoIosArrowDown size={18} />}
                        {percent}%
                    </span>
                </div>
            </div>
        </div>
    </>
}

export default GrowthCard;