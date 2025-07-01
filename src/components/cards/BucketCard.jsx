import React from "react";
import MyButton from "../buttons/MyButton";
import usePath from "../../hooks/usePath";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const BucketCard = ({ icon, title = "", to = "", subText = "" }) => {
  // hooks
  const path = usePath();
  const navigate = useNavigate();

  const { role } = useSelector((state) => state.auth);

  // functions
  const handleNavigate = () => navigate(`/${role}/${to}`);

  return (
    <>
      <div className="flex justify-center relative items-center rounded-2xl shadow-lg shadow-gray-300 hover:scale-105 transition-all duration-300 cursor-pointer main-black-bg w-[250px] h-[300px]">
        <div className="w-full absolute top-0 left-0 flex justify-center items-center">
          <div className="w-[60%] rounded-b-full py-1.5 shadow-md main-bg"></div>
        </div>
        <div className="h-full w-full text-white gap-y-10 main-text flex flex-col justify-center items-center">
          <div className="flex justify-center flex-col items-center gap-y-4">
            <div className="main-bg rounded-xl p-3 flex justify-center items-center text-white">
              {icon}
            </div>
            <h2 className="font-medium text-[18px] text-center mb-[-10px]">
              {title}
            </h2>
            {subText && <p className="">({subText})</p>}
          </div>
          <MyButton
            className="main-bg py-2 px-4 text-[14px]"
            onClick={handleNavigate}
          >
            View
          </MyButton>
        </div>
      </div>
    </>
  );
};

export default BucketCard;
