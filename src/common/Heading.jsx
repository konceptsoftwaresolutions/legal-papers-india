import { Button } from "@material-tailwind/react";
import React from "react";
import { FaAngleDoubleLeft } from "react-icons/fa";
import usePath from "../hooks/usePath";
import MyButton from "../components/buttons/MyButton";

function Heading({ text, showHeading = false , className}) {
  const path = usePath();
  return (
    <div className="flex items-center gap-x-3">
      {showHeading ? (
        <>
          {" "}
          <MyButton
            className="main-bg py-2 text-[15px] font-medium px-4"
            onClick={() => path.back()}
          >
            <FaAngleDoubleLeft size={18} />
          </MyButton>
          {/* <Button
            variant="filled"
            className="cstm-btn py-1 px-3 rounded-md poppins-font"
            // onClick={callApis}
            onClick={() => path.back()}
          >
            <FaAngleDoubleLeft size={18} />
          </Button> */}
        </>
      ) : (
        ""
      )}
      <h2 className={`text-lg lg:text-2xl head-color font-medium	font-poppins ${className}`}>{text}</h2>
    </div>
  );
}

export default Heading;
