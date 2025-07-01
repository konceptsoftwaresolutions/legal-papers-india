import React, { useMemo } from "react";
import { Navigate, useRoutes, useLocation } from "react-router-dom";

// ... Layouts ...
import DashboardLayout from "../layouts/DashboardLayout";

// panels
import panels from "./panels";
import Login from "../pages/validations/Login";
import { useSelector } from "react-redux";

const Routing = () => {
  // ... changes ....
  // const isAuth = true; // Change as needed
  // const role = "superAdmin";
  const { isAuthenticated, role, token } = useSelector((state) => state.auth);
  const isAuth = isAuthenticated;

  // hooks
  const location = useLocation();
  // const ability = useAbility();
  // const panels = ability.pages(AdminRoutes) || AdminRoutes;

  const destination = useMemo(() => {
    if (isAuth) {
      return `/${role}/dashboard`;
    } else if (!isAuth) {
      return `/login`;
    } else {
      return `/${role}`;
    }
  }, [role, isAuth, token]);

  const metaConfig = (meta = {}) => {
    try {
      if (meta.title) {
        window.document.title = meta.title;
      }
      if (meta.desc || meta.description) {
        const description = document.querySelector("meta[name='description']");
        if (description) {
          description.setAttribute("content", meta.desc || meta.description);
        } else {
          const metaDesc = document.createElement("meta");
          metaDesc.name = "description";
          metaDesc.content = meta.desc || meta.description;
          document.head.appendChild(metaDesc);
        }
      }
    } catch (err) {
      console.error("Error in meta configuration:", err);
    }
  };

  const childrenElement = (item, parentPath) => {
    const path = `${item.path || ""}`;

    if (
      item.meta &&
      location.pathname === `${parentPath}/${path}` &&
      item.permission !== false
    ) {
      metaConfig(item.meta);
    }

    if (item.element) {
      return {
        path,
        element:
          item.permission === false ? <Navigate to={"/"} /> : item.element,
      };
    } else {
      throw new Error("Element must have `element` or `children`!");
    }
  };

  const processElement = (item) => {
    const path = `${role ? `/${role}/` : ""}${item.path || ""}`;

    if (item.meta && location.pathname === path && item.permission !== false) {
      metaConfig(item.meta);
    }

    if (item.children && Array.isArray(item.children) && item.element) {
      return {
        path,
        element:
          item.permission === false ? <Navigate to={"/"} /> : item.element,
        children: item.children.map((child) => childrenElement(child, path)),
      };
    } else if (item.children && Array.isArray(item.children)) {
      return {
        path,
        children: item.children.map((child) => childrenElement(child, path)),
      };
    } else if (item.element) {
      return {
        path,
        element:
          item.permission === false ? <Navigate to={"/"} /> : item.element,
      };
    } else {
      throw new Error("Element must have `element` or `children`!");
    }
  };

  const parentElement = (item) => {
    const path = `/${role}/${item.path || ""}`;

    if (item.meta && location.pathname === path && item.permission !== false) {
      metaConfig(item.meta);
    }

    if (item.children && Array.isArray(item.children) && item.element) {
      return {
        path,
        element:
          item.permission === false ? <Navigate to={"/"} /> : item.element,
        children: item.children.map((child) => childrenElement(child, path)),
      };
    } else if (item.children && Array.isArray(item.children)) {
      return {
        path,
        children: item.children.map((child) => childrenElement(child, path)),
      };
    } else if (item.element) {
      return {
        path,
        element:
          item.permission === false ? <Navigate to={"/"} /> : item.element,
      };
    } else {
      throw new Error("Element must have `element` or `children`!");
    }
  };

  // panel
  const homePanel = panels.map((item) => parentElement(item));

  const routes = [
    {
      path: "/",
      element: <Navigate to={destination} />,
    },
    {
      path: "/",
      element: isAuth ? <DashboardLayout /> : <Navigate to={"/login"} />,
      children: homePanel,
    },
    {
      path: "/login",
      element: !isAuth ? <Login /> : <Navigate to={"/"} />,
    },
    {
      path: "*",
      element: <Navigate to={"/"} />,
    },
  ];

  const element = useRoutes(routes);
  return element;
};

export default Routing;
