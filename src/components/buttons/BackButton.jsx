import React from "react";

// button
import MyButton from "./MyButton";

// icons
import { BsArrowLeftShort } from "react-icons/bs";

// hooks
import usePath from "../../hooks/usePath";

const BackButton = () => {
    // hooks
    const path = usePath();

    // functions
    const handleBack = () => path.back();

    return <>
        <MyButton className="py-1 px-3 main-bg" title="Back" placement="rightBottom" onClick={handleBack}>
            <BsArrowLeftShort size={25} />
        </MyButton>
    </>
}

export default BackButton;