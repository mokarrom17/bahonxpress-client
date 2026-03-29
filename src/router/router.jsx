import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import Coverage from "../pages/Coverage/Coverage";
import About from "../pages/About/About";
import SendParcel from "../pages/SendParcel/SendParcel";
import PrivateRoute from "../Routes/PrivateRoute";
import { districts } from "../Data/warehouse";
import DashboardLayout from "../layouts/DashboardLayout";
import MyParcels from "../pages/Dashboard/MyParcels/MyParcels";
import Payment from "../pages/Dashboard/Payment/Payment";
import PaymentHistory from "../pages/Dashboard/PaymentHistory/PaymentHistory";
import TrackParcel from "../pages/Dashboard/TrackParcel/TrackParcel";
import BeARider from "../pages/Dashboard/BeARIder/BeARider";
import PendingRiders from "../pages/Dashboard/PendingRiders/PendingRiders";
import ActiveRiders from "../pages/Dashboard/ActiveRiders/ActiveRiders";
import MakeAdmin from "../pages/Dashboard/MakeAdmin/MakeAdmin";
import Forbidden from "../pages/Forbidden/Forbidden";
import AdminRoute from "../Routes/AdminRoute";
import AssignRider from "../pages/Dashboard/AssignRider/AssignRider";
import AssignedParcels from "../pages/Dashboard/AssignedParcels/AssignedParcels";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "coverage",
        Component: Coverage,
      },
      {
        path: "about",
        Component: About,
      },
      {
        path: "forbidden",
        Component: Forbidden,
      },
      {
        path: "beARider",
        element: (
          <PrivateRoute>
            {" "}
            <BeARider></BeARider>{" "}
          </PrivateRoute>
        ),
        loader: () => districts,
      },
      {
        path: "send-parcel",
        element: (
          <PrivateRoute>
            <SendParcel />
          </PrivateRoute>
        ),
        loader: () => districts,
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "my-parcels",
        Component: MyParcels,
      },
      {
        path: "payment/:parcelId",
        Component: Payment,
      },
      {
        path: "paymentHistory",
        Component: PaymentHistory,
      },
      {
        path: "track",
        Component: TrackParcel,
      },
      {
        path: "assign-rider",
        element: (
          <AdminRoute>
            <AssignRider />
          </AdminRoute>
        ),
      },
      {
        path: "assigned-parcels",
        element: (
          <AdminRoute>
            <AssignedParcels />
          </AdminRoute>
        ),
      },
      {
        path: "pending-riders",
        element: (
          <AdminRoute>
            <PendingRiders />
          </AdminRoute>
        ),
      },
      {
        path: "active-riders",
        element: (
          <AdminRoute>
            {" "}
            <ActiveRiders />{" "}
          </AdminRoute>
        ),
      },
      {
        path: "make-admin",
        element: (
          <AdminRoute>
            <MakeAdmin />
          </AdminRoute>
        ),
      },
    ],
  },
]);
