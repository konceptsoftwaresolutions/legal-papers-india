import React, { Suspense } from "react";
import Sidebar from "../common/sidebar/Sidebar";
import Navbar from "../common/navbar/Navbar";
import Loader from "../components/loaders/Loader";

const ScreenView = ({ children }) => {
  const [collapse, setCollapse] = React.useState(false);

  return (
    <>
      <main className="w-full flex justify-start items-start min-h-screen">
        <Sidebar collapse={collapse} onCollapse={setCollapse} />
        <div
          className={`
          transition-all duration-300 ease-in-out content-div
          
          ${collapse ? "md:w-[95%]" : "md:w-[84%]"}
          
          w-full
        `}
        >
          <Navbar />
          <Suspense fallback={<Loader />}>
            <div className="md:p-0">{children}</div>
          </Suspense>
        </div>
      </main>
    </>
  );
};

export default ScreenView;
