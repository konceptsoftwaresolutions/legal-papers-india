import React from "react";

const NumberCard = ({ title = "", number = 0, icon  , showSign = true}) => {
  return (
    <>
      <div className=" main-bg p-10 rounded-xl custom-tile overflow-hidden relative">
        <p className="text-lg text-white">{title}</p>
        <h2 className="text-4xl text-white">{ showSign ? "₹":''} {number}</h2>
      </div>
    </>
  );
};

export default NumberCard;
