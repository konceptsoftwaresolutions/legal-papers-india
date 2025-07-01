import React, { useState } from "react";

// icons
import { MdOutlineSearch } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";

// components
import OpacityButton from "../../components/buttons/OpacityButton";
import NavProfile from "./NavProfile";
import Notification from "./Notification";
import SearchModal from "./SearchModal";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [showQuotation, setShowQuotation] = useState(false);

  const { role } = useSelector((state) => state.auth);

  const currentPath = window.location.pathname; // Path segment of the URL

  const extractSectionAfterRole = () => {
    const segments = currentPath.split("/").filter(Boolean);
    const roleIndex = segments.indexOf(role);
    if (roleIndex !== -1 && roleIndex + 1 < segments.length) {
      return segments[roleIndex + 1];
    }

    return null;
  };

  const sectionAfterRole = extractSectionAfterRole();
  console.log(sectionAfterRole, "navbar");

  return (
    <>
      <nav className="sticky top-0 left-0 main-bg py-3 z-30 flex justify-between items-center px-4">
        <div className="flex justify-center items-center">
          {!(
            sectionAfterRole === "leads" ||
            sectionAfterRole === "bucket" ||
            sectionAfterRole === "no-claim-bucket" ||
            sectionAfterRole === "assigned-nc-bucket" ||
            sectionAfterRole === "total-nc-bucket" ||
            sectionAfterRole === "iec-renewal-lead" ||
            sectionAfterRole === "total-leads" ||
            sectionAfterRole === "renewal" ||
            sectionAfterRole === "editLead" ||
            sectionAfterRole === "editlead" ||
            sectionAfterRole === "admin-bucket-details" ||
            sectionAfterRole === "nc-bucket-share-by-selecting" ||
            sectionAfterRole === "no-claim-bucket-3-months" ||
            sectionAfterRole === "admin-bucket-details-3-months" ||
            sectionAfterRole === "nc-bucket-share-by-selecting-3-months" ||
            sectionAfterRole === "total-bucket-details" ||
            sectionAfterRole === "total-nc-bucket-view" ||
            sectionAfterRole === "total-leads-status" ||
            sectionAfterRole === "total-leads-bucket-view"
          ) ? (
            ""
          ) : (
            <OpacityButton
              className="rounded-full"
              onClick={() => setShowQuotation(true)}
            >
              <MdOutlineSearch size={22} className="rotate-90" />
            </OpacityButton>
          )}
        </div>

        <div className="flex justify-center gap-x-3 items-center">
          {/* <OpacityButton className="rounded-full" update={true}>
                    <IoMdNotificationsOutline size={22} />
                </OpacityButton> */}
          <Notification />

          <NavProfile />
        </div>
      </nav>
      <SearchModal
        showQuotation={showQuotation}
        setShowQuotation={setShowQuotation}
      />
    </>
  );
};

export default Navbar;
