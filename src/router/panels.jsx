import { lazy } from "react";
import { useSelector } from "react-redux";
import ProtectedRoutes from "./ProtectedRoutes";
import BucketDetails from "../pages/bucket/BucketDetails";

// dashboard
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));

// bucket
const Bucket = lazy(() => import("../pages/bucket/Bucket"));
const NoClaimBucket = lazy(() => import("../pages/bucket/NoClaimBucket"));
const AssignedNCBucket = lazy(() => import("../pages/bucket/AssignedNCBucket"));
const TotalNCBucket = lazy(() => import("../pages/bucket/TotalNCBucket"));
const AdminBucketDetails = lazy(() =>
  import("../pages/bucket/AdminBucketDetails")
);
const NCBucketShareBySelecting = lazy(() =>
  import("../pages/bucket/NcBucketShareBySelecting")
);
const TotalNCBucketDetails = lazy(() =>
  import("../pages/bucket/TotalNCBucketDetails")
);
const TotalNCBucketView = lazy(() =>
  import("../pages/bucket/TotalNCBucketView")
);
const TotalLeadsBucketDetails = lazy(() =>
  import("../pages/bucket/TotalLeadsBucketDetails")
);
const TotalLeadsStatus = lazy(() => import("../pages/bucket/TotalLeadsStatus"));
const TotalLeadsBucketView = lazy(() =>
  import("../pages/bucket/TotalLeadsBucketView")
);

// leads
const Leads = lazy(() => import("../pages/leads/Leads"));
const EditLead = lazy(() => import("../pages/leads/EditLead"));
const TotalLeads = lazy(() => import("../pages/bucket/TotalLeads"));
const ImportantLeads = lazy(() => import("../pages/leads/ImportantLeads"));

// followups
const FollowUps = lazy(() => import("../pages/follows/FollowUps"));

// revenue
const Revenue = lazy(() => import("../pages/revenue/Revenue"));

//renewal
const Renewal = lazy(() => import("../pages/renewal/Renewal"));

// tasks
const Tasks = lazy(() => import("../pages/tasks/Tasks"));

// users
const AllUsers = lazy(() => import("../pages/user/AllUsers"));
const UserDetails = lazy(() => import("../pages/user/UserDetails"));

const panels = [
  {
    path: "dashboard",
    element: <Dashboard />,
    meta: {
      title: "Legal Papers India CRM",
    },
  },
  // bucket
  {
    path: "bucket",
    element: <Bucket />,
    meta: {
      title: "Buckets",
    },
  },
  {
    path: "no-claim-bucket",
    element: <NoClaimBucket />,
    meta: {
      title: "No Claim Bucket",
    },
  },
  {
    path: "admin-bucket-details",
    element: <AdminBucketDetails />,
    meta: {
      title: "Admin Bucket Details",
    },
  },
  {
    path: "assigned-nc-bucket",
    element: <AssignedNCBucket />,
    meta: {
      title: "Assigned NC Bucket",
    },
  },
  {
    path: "total-nc-bucket",
    element: <TotalNCBucket />,
    meta: {
      title: "Total NC Bucket",
    },
  },
  {
    path: "nc-bucket-share-by-selecting",
    element: <NCBucketShareBySelecting />,
    meta: {
      title: "NC Bucket Share by Selecting",
    },
  },
  {
    path: "total-bucket-details",
    element: <TotalNCBucketDetails />,
    meta: {
      title: "Total NC Bucket Details",
    },
  },
  {
    path: "total-nc-bucket-view",
    element: <TotalNCBucketView />,
    meta: {
      title: "Total NC Bucket View",
    },
  },
  {
    path: "total-leads-bucket-details",
    element: <TotalLeadsBucketDetails />,
    meta: {
      title: "Total Leads Bucket Details",
    },
  },
  {
    path: "total-leads",
    element: <TotalLeads />,
    meta: {
      title: "Total Leads",
    },
  },
  {
    path: "total-leads-status",
    element: <TotalLeadsStatus />,
    meta: {
      title: "Total Leads Status",
    },
  },
  {
    path: "total-leads-bucket-view",
    element: <TotalLeadsBucketView />,
    meta: {
      title: "Total Leads Bucket View",
    },
  },
  // revenue
  {
    path: "revenue",
    element: <Revenue />,
    meta: {
      title: "Revenue",
    },
  },
  {
    path: "renewal",
    element: <Renewal />,
    meta: {
      title: "Renewal",
    },
  },
  {
    path: "tasks",
    element: <Tasks />,
    meta: {
      title: "Tasks",
    },
  },
  {
    path: "follow-ups",
    element: <FollowUps />,
    meta: {
      title: "Follow Ups",
    },
  },
  // {
  //   path: "admin-bucket-details",
  //   element: <BucketDetails />,
  //   meta: {
  //     title: "Follow Ups",
  //   },
  // },
  {
    path: "users",
    children: [
      {
        path: "",
        element: <AllUsers />,
        meta: {
          title: "All Users",
        },
      },
      {
        path: "details",
        element: <UserDetails />,
        meta: {
          title: "User Details",
        },
      },
    ],
    meta: {
      title: "All Users",
    },
  },
  {
    path: "leads",
    children: [
      {
        path: "",
        element: <Leads />,
        meta: {
          title: "Leads",
        },
      },
      {
        path: "details",
        element: <EditLead />,
        meta: {
          title: "Lead Details",
        },
      },
      {
        path: "important",
        element: <ImportantLeads />,
        meta: {
          title: "Important Leads",
        },
      },
    ],
    meta: {
      title: "Leads",
    },
  },
];

export default panels;
