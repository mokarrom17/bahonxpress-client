import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import useAuth from "../../../hooks/useAuth";

import Swal from "sweetalert2";
import { useNavigate } from "react-router";

import {
  FaChevronDown,
  FaChevronUp,
  FaBoxOpen,
  FaMoneyBillWave,
} from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";

import TrackingTimeline from "../../../components/TrackingTimeline.jsx";
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";

const MyParcels = () => {
  const { user } = useAuth();

  const axiosSecure = useAxiosSecure();

  const navigate = useNavigate();

  // 🔥 Tracking toggle state
  const [openId, setOpenId] = useState(null);

  const MotionDiv = motion.div;

  /* --------------------------------------------------
     Status Styles
  -------------------------------------------------- */
  const statusStyle = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",

    delivered: "bg-green-100 text-green-700 border-green-300",

    in_transit: "bg-blue-100 text-blue-700 border-blue-300",

    picked: "bg-indigo-100 text-indigo-700 border-indigo-300",

    rider_assigned: "bg-purple-100 text-purple-700 border-purple-300",
  };

  /* --------------------------------------------------
     Fetch Parcels
  -------------------------------------------------- */
  const {
    data: parcels = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["my-parcels", user?.email],

    enabled: !!user?.email,

    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);

      return res.data;
    },
  });

  /* --------------------------------------------------
     Toggle Tracking
  -------------------------------------------------- */
  const handleView = (id) => {
    setOpenId(openId === id ? null : id);

    // 🔥 smooth scroll
    setTimeout(() => {
      const el = document.getElementById(`tracking-${id}`);

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  /* --------------------------------------------------
     Payment
  -------------------------------------------------- */
  const handlePay = (id) => {
    navigate(`/dashboard/payment/${id}`);
  };

  /* --------------------------------------------------
     Delete
  -------------------------------------------------- */
  const handleDelete = (id) => {
    Swal.fire({
      title: "Cancel Parcel?",
      text: "This parcel will be permanently deleted.",

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#ef4444",

      confirmButtonText: "Yes, Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/parcels/${id}`).then((res) => {
          if (res.data.deletedCount) {
            Swal.fire({
              icon: "success",
              title: "Parcel Cancelled",
              timer: 1500,
              showConfirmButton: false,
            });

            refetch();
          }
        });
      }
    });
  };

  /* --------------------------------------------------
     Loading State
  -------------------------------------------------- */
  if (isLoading) {
    return (
      <div className="flex justify-center mt-24">
        <span className="loading loading-spinner loading-lg text-black"></span>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-2xl shadow p-5 lg:p-7">
      {/* --------------------------------------------------
           Header
      -------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <FaBoxOpen className="text-black" />
            My Parcels
          </h2>

          <p className="text-gray-400 mt-1">Track and manage your deliveries</p>
        </div>

        {/* Count */}
        <div className="bg-black/10 border border-black/20 rounded-2xl px-5 py-3 w-fit">
          <p className="text-xs text-black font-medium">Total Parcels</p>

          <h3 className="text-2xl font-bold text-black">{parcels.length}</h3>
        </div>
      </div>

      {/* --------------------------------------------------
           Empty State
      -------------------------------------------------- */}
      {parcels.length === 0 && (
        <div className="text-center py-20 border rounded-2xl bg-base-200/40">
          <p className="text-5xl mb-4">📦</p>

          <h3 className="text-xl font-semibold mb-2">No Parcels Found</h3>

          <p className="text-gray-400">You have not created any parcels yet.</p>
        </div>
      )}

      {/* --------------------------------------------------
           Parcel List
      -------------------------------------------------- */}
      {parcels.length > 0 && (
        <div className="space-y-5">
          {parcels.map((p) => (
            <div
              key={p._id}
              className="border border-base-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* --------------------------------------------------
                   Main Card
              -------------------------------------------------- */}
              <div className="p-5 bg-base-100">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  {/* Tracking */}
                  <div className="lg:col-span-2">
                    <p className="text-xs text-gray-400 mb-1">Tracking ID</p>

                    <p className="font-mono font-semibold text-sm break-all">
                      {p.trackingId}
                    </p>
                  </div>

                  {/* Type */}
                  <div className="lg:col-span-1">
                    <p className="text-xs text-gray-400 mb-1">Type</p>

                    <span
                      className={`badge ${
                        p.type === "document" ? "badge-info" : "badge-warning"
                      }`}
                    >
                      {p.type === "document" ? "Document" : "Parcel"}
                    </span>
                  </div>

                  {/* Weight */}
                  <div className="lg:col-span-1">
                    <p className="text-xs text-gray-400 mb-1">Weight</p>

                    <p className="font-medium">
                      {p.type === "document" ? "—" : `${p.parcelWeight} kg`}
                    </p>
                  </div>

                  {/* Route */}
                  <div className="lg:col-span-2">
                    <p className="text-xs text-gray-400 mb-1">Route</p>

                    <p className="font-medium">
                      {p.senderWarehouse} → {p.receiverWarehouse}
                    </p>
                  </div>

                  {/* Delivery Status */}
                  <div className="lg:col-span-2">
                    <p className="text-xs text-gray-400 mb-1">
                      Delivery Status
                    </p>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${
                        statusStyle[p.delivery_status]
                      }`}
                    >
                      {p.delivery_status?.replace("_", " ")}
                    </span>
                  </div>

                  {/* Payment */}
                  <div className="lg:col-span-1">
                    <p className="text-xs text-gray-400 mb-1">Payment</p>

                    <span
                      className={`badge ${
                        p.paymentStatus === "paid"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {p.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                    </span>
                  </div>

                  {/* Cost */}
                  <div className="lg:col-span-1">
                    <p className="text-xs text-gray-400 mb-1">Cost</p>

                    <p className="font-bold text-black">৳{p.cost?.total}</p>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-2 flex flex-wrap gap-2 justify-start lg:justify-end">
                    {/* Track Button */}
                    <button
                      onClick={() => handleView(p._id)}
                      className="btn btn-sm btn-outline btn-black gap-2"
                    >
                      {openId === p._id ? (
                        <>
                          <FaChevronUp />
                          Hide
                        </>
                      ) : (
                        <>
                          <FaChevronDown />
                          Track
                        </>
                      )}
                    </button>

                    {/* Pay */}
                    {p.paymentStatus?.toLowerCase() === "unpaid" && (
                      <button
                        onClick={() => handlePay(p._id)}
                        className="btn btn-sm btn-success gap-2 text-white"
                      >
                        <FaMoneyBillWave />
                        Pay
                      </button>
                    )}

                    {/* Cancel */}
                    {p.delivery_status === "pending" &&
                      p.paymentStatus !== "paid" && (
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="btn btn-sm btn-error text-white"
                        >
                          Cancel
                        </button>
                      )}
                  </div>
                </div>
              </div>

              {/* --------------------------------------------------
                   Tracking Timeline
              -------------------------------------------------- */}
              <AnimatePresence>
                {openId === p._id && (
                  <MotionDiv
                    id={`tracking-${p._id}`}
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                    }}
                    transition={{
                      duration: 0.35,
                    }}
                    className="overflow-hidden"
                  >
                    <div className="border-t bg-base-200/40 p-5">
                      {/* Header */}
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-5">
                        <div>
                          <h3 className="font-bold text-lg">
                            Tracking Details
                          </h3>

                          <p className="text-sm text-gray-400">
                            Live parcel tracking timeline
                          </p>
                        </div>

                        {/* Current Status */}
                        <div
                          className={`px-4 py-2 rounded-xl border text-sm font-semibold capitalize w-fit ${
                            statusStyle[p.delivery_status]
                          }`}
                        >
                          Current Status: {p.delivery_status?.replace("_", " ")}
                        </div>
                      </div>

                      {/* Timeline */}
                      <TrackingTimeline trackingId={p.trackingId} />
                    </div>
                  </MotionDiv>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyParcels;
