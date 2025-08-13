//     children: [
//       {
//         path: "/:type/dashboard",
//         element: <Dashboard />,
//       },
//       ...(!(role === "operationsExecutive")  ? [{ path: "/:type/bucket", element: <Bucket /> },] : []),
//       { path: "/:type/leads", element: <Leads /> },
//       ...(!(role === "salesTl" || role === 'salesExecutive') ? [{path: "/:type/follow-ups",element: <FollowUps />,},] : []),
//       { path: "/:type/revenue", element: <Revenue /> },
//       { path: "/:type/renewal", element: <Renewal /> },
//       { path: "/:type/tasks", element: <Tasks /> },
//       { path: "/:type/editLead", element: <EditLead /> },
//       ...(!(role === "operationsTl" || role ==="operationsExecutive" )? [{ path: "/:type/no-claim-bucket", element: <NoClaimBucket /> },] : []),
//       ...(!(role === "salesTl" || role === "operationsExecutive") ? [{ path: "/:type/assigned-nc-bucket", element: <AssignedNCBucket /> },] : []),
//       ...(!(role === "salesTl" || role === "operationsExecutive") ? [{ path: "/:type/total-nc-bucket", element: <TotalNCBucket /> },] : []),
//       ...(!(role === "salesTl" || role === "operationsExecutive") ? [{ path: "/:type/total-leads", element: <TotalLeads /> },] : []),
//       // { path: "/:type/all-users", element: <AllUsers /> },
//       ...(!(role === "operationsExecutive") ? [{ path: "/:type/all-users", element: <AllUsers /> },] : []),
//       { path: "/:type/userDetails", element: <UserDetails /> },
//       ...(role === "operationsTl" ? [{ path: "/:type/important-leads", element: <ImportantLeads /> }] : []),
//       { path: "*", element: <Navigate to="/" replace /> }, // Redirects to /home
//     ],
//   },
// ];

import React, { useMemo } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { useSelector } from "react-redux";
import ProtectedRoutes from "./ProtectedRoutes";

import Dashboard from "../pages/dashboard/Dashboard";
import Bucket from "../pages/bucket/Bucket";
import Login from "../pages/validations/Login";
import DashboardLayout from "../layouts/DashboardLayout";
import Leads from "../pages/leads/Leads";
import FollowUps from "../pages/follows/FollowUps";
import Revenue from "../pages/revenue/Revenue";
import Renewal from "../pages/renewal/Renewal";
import Tasks from "../pages/tasks/Tasks";
import EditLead from "../pages/leads/EditLead";
import NoClaimBucket from "../pages/bucket/NoClaimBucket";
import AssignedNCBucket from "../pages/bucket/AssignedNCBucket";
import TotalNCBucket from "../pages/bucket/TotalNCBucket";
import TotalLeads from "../pages/bucket/TotalLeads";
import AllUsers from "../pages/user/AllUsers";
import UserDetails from "../pages/user/UserDetails";
import ImportantLeads from "../pages/leads/ImportantLeads";
import IECRenewalLeads from "../pages/bucket/IECRenewalLeads";
import AdminBucketDetails from "../pages/bucket/AdminBucketDetails";
import TotalLeadsStatus from "../pages/bucket/TotalLeadsStatus";
import TotalLeadsBucketView from "../pages/bucket/TotalLeadsBucketView";
import NcBucketShareBySelecting from "../pages/bucket/NcBucketShareBySelecting";
import TotalNCBucketView from "../pages/bucket/TotalNCBucketView";
import TotalNCBucketDetails from "../pages/bucket/TotalNCBucketDetails";
import EmpActivity from "../pages/empActivityTracker/EmpActivity";
import NCBucket3months from "../pages/bucket/NCBucket3months";
import AdminBucketDetailsThreeMonths from "../pages/bucket/AdmintBucketDetails3Months";
import ThreeMonthsNCBucketSharing from "../pages/bucket/ThreeMonthsNCBucketShare";

import Marketing from "../pages/marketing/Marketing";
import Email from "../pages/marketing/email/Email";
import SMS from "../pages/marketing/sms/SMS";
import Whatsapp from "../pages/marketing/whatsapp/Whatsapp";
import EmailTemplate from "../pages/marketing/email/EmailTemplate";
import SMSTemplate from "../pages/marketing/sms/SMSTemplate";
import WhatsAppTemplate from "../pages/marketing/whatsapp/WhatsAppTemplate";
import MarketingAnalytics from "../pages/marketing/analytics/MarketingAnalytics";
import ClientFiles from "../pages/clientFile/ClientFiles";
import AddClientFile from "../pages/clientFile/AddClientFile";
import EditClientFile from "../pages/clientFile/EditClientFile";
import UsedNCBucket from "../pages/bucket/UsedNCBucket";
import UsedNCBucketDetails from "../pages/bucket/UsedNCBucketDetails";
import UsedNCBucketShare from "../pages/bucket/UsedNCBucketShare";
import PerformaInvoiceNo from "../pages/performaInvoice/PerformaInvoiceNo";
import Services from "../pages/services/Services";
import AddService from "../pages/services/AddService";
import EditService from "../pages/services/EditService";
import TaxInvoiceNo from "../pages/taxInvoice/TaxInvoiceNo";
import WhatsAppInHouse from "../pages/marketing/whatsappInHouse/WhatsAppInHouse";
import WhatsAppInHouseTemplate from "../pages/marketing/whatsappInHouse/WhatsAppInHouseTemplate";

const Routes = () => {
  const { isAuthenticated, role, token } = useSelector((state) => state.auth);

  const destinationRoute = useMemo(() => {
    if (isAuthenticated) {
      return `/${role}/dashboard`;
    } else if (!isAuthenticated) {
      return "/login";
    } else {
      return "/";
    }
  }, [isAuthenticated, token, role]);

  const routes = [
    {
      path: "/",
      element: <Navigate to={destinationRoute} />,
    },
    {
      path: "*",
      element: <Navigate to={"/"} />,
    },
    {
      path: "/login",
      element: (
        <ProtectedRoutes isAuthenticated={!isAuthenticated} redirect={"/"}>
          <Login />
        </ProtectedRoutes>
      ),
    },
    {
      path: "/",
      element: (
        <ProtectedRoutes isAuthenticated={isAuthenticated} redirect={"/login"}>
          <DashboardLayout />
        </ProtectedRoutes>
      ),
      children: [
        {
          path: "/:type/dashboard",
          element: (
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/bucket",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={["operationsTl", "operationsExecutive"]}
            >
              <Bucket />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/employeeactivitytracker",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={["salesExecutive", "operationsExecutive"]}
            >
              <EmpActivity />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/leads",
          element: (
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <Leads />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/follow-ups",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={["salesTl"]}
            >
              <FollowUps />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/revenue",
          element: (
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <Revenue />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/renewal",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[]}
            >
              <Renewal />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/tasks",
          element: (
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <Tasks />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/editLead",
          element: (
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <EditLead />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/no-claim-bucket",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                "salesExecutive",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <NoClaimBucket />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/no-claim-bucket-3-months",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                "salesExecutive",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <NCBucket3months />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/used-nc-bucket",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                "salesExecutive",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <UsedNCBucket />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/admin-bucket-details",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                "salesExecutive",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <AdminBucketDetails />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/admin-bucket-details-3-months",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                "salesExecutive",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <AdminBucketDetailsThreeMonths />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/used-nc-bucket-details",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                "salesExecutive",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <UsedNCBucketDetails />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/total-leads-status",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                "salesExecutive",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <TotalLeadsStatus />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/total-leads-bucket-view",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                "salesExecutive",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <TotalLeadsBucketView />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/total-nc-bucket-view",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                "salesExecutive",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <TotalNCBucketView />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/total-bucket-details",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                "salesExecutive",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <TotalNCBucketDetails />
            </ProtectedRoutes>
          ),
        },

        {
          path: "/:type/nc-bucket-share-by-selecting",
          element: <NcBucketShareBySelecting />,
        },
        {
          path: "/:type/nc-bucket-share-by-selecting-3-months",
          element: <ThreeMonthsNCBucketSharing />,
        },
        {
          path: "/:type/used-nc-bucket-share-by-selecting",
          element: <UsedNCBucketShare />,
        },
        {
          path: "/:type/assigned-nc-bucket",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                // "salesTl",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <AssignedNCBucket />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/iec-renewal-lead",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[]}
            >
              <IECRenewalLeads />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/total-nc-bucket",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                "salesTl",
                "salesExecutive",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <TotalNCBucket />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/total-leads",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                "salesTl",
                "salesExecutive",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <TotalLeads />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/all-users",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={["salesExecutive", "operationsExecutive"]}
            >
              <AllUsers />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/userDetails",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={["salesExecutive", "operationsExecutive"]}
            >
              <UserDetails />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/important-leads",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={["salesExecutive"]}
            >
              <ImportantLeads />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/marketing-analytics",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                "salesTl",
                "salesExecutive",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <MarketingAnalytics />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/marketing",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                "salesTl",
                "salesExecutive",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <Marketing />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/emailcampaign",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                "salesTl",
                "salesExecutive",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <Email />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/emailtemplate",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                "salesTl",
                "salesExecutive",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <EmailTemplate />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/smscampaign",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                "salesTl",
                "salesExecutive",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <SMS />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/smstemplate",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                "salesTl",
                "salesExecutive",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <SMSTemplate />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/whatsappcampaign",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                "salesTl",
                "salesExecutive",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <Whatsapp />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/whatsapptemplate",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                "salesTl",
                "salesExecutive",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <WhatsAppTemplate />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/whatsapp-inhouse",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                "salesTl",
                "salesExecutive",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <WhatsAppInHouse />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/whatsappinhousetemplate",
          element: (
            <ProtectedRoutes
              isAuthenticated={isAuthenticated}
              notAllowedRoles={[
                "salesTl",
                "salesExecutive",
                "operationsTl",
                "operationsExecutive",
              ]}
            >
              <WhatsAppInHouseTemplate />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/clientfiles",
          element: (
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <ClientFiles />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/add-client-file",
          element: (
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <AddClientFile />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/edit-client-file/:id",
          element: (
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <EditClientFile />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/proformainvoice",
          element: (
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <PerformaInvoiceNo />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/taxinvoice",
          element: (
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <TaxInvoiceNo />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/services",
          element: (
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <Services />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/add-service",
          element: (
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <AddService />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:type/edit-service/:id",
          element: (
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <EditService />
            </ProtectedRoutes>
          ),
        },
        {
          path: "*",
          element: <Navigate to="/" replace />,
        },
      ],
    },
  ];

  const element = useRoutes(routes);

  return element;
};

export default Routes;
