import React, { Suspense } from "react";

// common
import Sidebar from "../common/sidebar/Sidebar";
import Navbar from "../common/navbar/Navbar";
import Loader from "../components/loaders/Loader";

const ScreenView = ({ children }) => {
  // state
  const [collapse, setCollapse] = React.useState(false);

  return (
    <>
      {/* screen viewer */}
      <main className="w-full flex justify-start items-start">
        <Sidebar collapse={collapse} onCollapse={setCollapse} />
        <div className={`${collapse ? "w-[95%]" : "w-[84%]"} transition-all content-div`}>
          <Navbar />
          <Suspense fallback={<Loader />}>{children}</Suspense>
        </div>
      </main>
    </>
  );
};

export default ScreenView;
