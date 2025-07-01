import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const usePersistentPreviousLocation = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [prevPath, setPrevPath] = useState(
    sessionStorage.getItem("prevPath") || null
  );

  useEffect(() => {
    const storedPrev = sessionStorage.getItem("currentPath");
    if (storedPrev) {
      setPrevPath(storedPrev);
      sessionStorage.setItem("prevPath", storedPrev); // Save previous path
    }

    setCurrentPath(location.pathname);
  }, [location.pathname]);

  // Save current path when unmounting (before route change)
  useEffect(() => {
    return () => {
      sessionStorage.setItem("currentPath", location.pathname);
    };
  }, [location.pathname]);

  return { currentPath, prevPath };
};
