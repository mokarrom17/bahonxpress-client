import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import useAuth from "../../../hooks/useAuth";

import Swal from "sweetalert2";
import { useNavigate } from "react-router";

import {
  FaChevronDown,
  FaChevronUp,
  FaBoxOpen,
  FaMoneyBillWave,
  FaSearch,
} from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";

import TrackingTimeline from "../../../components/TrackingTimeline.jsx";
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";

const MyParcels = () => {
  const { user } = useAuth();

  const axiosSecure = useAxiosSecure();

  const navigate = useNavigate();

  // ==========================================
  // State
  // ==========================================
  const [openId, setOpenId] = useState(null);

  const [searchText, setSearchText] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

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
     Filter + Search
  -------------------------------------------------- */
  const filteredParcels = useMemo(() => {
    return parcels.filter((p) => {
      const trackingId = p.trackingId?.toLowerCase() || "";

      const receiverName = p.receiverName?.toLowerCase() || "";

      const search = searchText.toLowerCase();

      const matchesSearch =
        trackingId.includes(search) || receiverName.includes(search);

      const matchesStatus =
        statusFilter === "all" || p.delivery_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [parcels, searchText, statusFilter]);

  /* --------------------------------------------------
     Pagination
  -------------------------------------------------- */
  const totalPages = Math.ceil(filteredParcels.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedParcels = filteredParcels.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  /* --------------------------------------------------
     Toggle Tracking
  -------------------------------------------------- */
  const handleView = (id) => {
    setOpenId(openId === id ? null : id);

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
    <div className="bg-base-100 rounded-3xl shadow-sm border border-base-200 p-5 lg:p-7">
      {/* --------------------------------------------------
           Header
      -------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black flex items-center gap-3">
            <FaBoxOpen className="text-black" />
            My Parcels
          </h2>

          <p className="text-gray-400 mt-1">Track and manage your deliveries</p>
        </div>

        {/* Count */}
        <div className="bg-black/5 border border-black/10 rounded-2xl px-5 py-3 w-fit">
          <p className="text-xs text-gray-500 font-medium">Total Parcels</p>

          <h3 className="text-2xl font-black text-black">
            {filteredParcels.length}
          </h3>
        </div>
      </div>

      {/* --------------------------------------------------
           Search + Filter
      -------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative w-full lg:max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search tracking ID or receiver..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
            className="input input-bordered w-full pl-11 rounded-2xl"
          />
        </div>

        {/* Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="select select-bordered rounded-2xl w-full lg:w-56"
        >
          <option value="all">All Status</option>

          <option value="pending">Pending</option>

          <option value="picked">Picked</option>

          <option value="rider_assigned">Rider Assigned</option>

          <option value="in_transit">In Transit</option>

          <option value="delivered">Delivered</option>
        </select>
      </div>

      {/* --------------------------------------------------
           Empty State
      -------------------------------------------------- */}
      {filteredParcels.length === 0 && (
        <div className="text-center py-24 border rounded-3xl bg-base-200/30">
          <p className="text-6xl mb-5">📦</p>

          <h3 className="text-2xl font-bold mb-3">No Matching Parcels Found</h3>

          <p className="text-gray-400">
            Try changing your search or filter options.
          </p>
        </div>
      )}

      {/* --------------------------------------------------
           Parcel List
      -------------------------------------------------- */}
      {filteredParcels.length > 0 && (
        <div className="space-y-5">
          {paginatedParcels.map((p) => (
            <div
              key={p._id}
              className="border border-base-200 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300"
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

                  {/* Receiver */}
                  <div className="lg:col-span-2">
                    <p className="text-xs text-gray-400 mb-1">Receiver</p>

                    <p className="font-semibold">{p.receiverName}</p>
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
                  <div className="lg:col-span-12 flex flex-wrap gap-2 justify-end pt-2">
                    {/* Track Button */}
                    <button
                      onClick={() => handleView(p._id)}
                      className="btn btn-sm btn-outline btn-black gap-2 rounded-xl"
                    >
                      {openId === p._id ? (
                        <>
                          <FaChevronUp />
                          Hide Tracking
                        </>
                      ) : (
                        <>
                          <FaChevronDown />
                          Track Parcel
                        </>
                      )}
                    </button>

                    {/* Pay */}
                    {p.paymentStatus?.toLowerCase() === "unpaid" && (
                      <button
                        onClick={() => handlePay(p._id)}
                        className="btn btn-sm btn-success gap-2 text-white rounded-xl"
                      >
                        <FaMoneyBillWave />
                        Pay Now
                      </button>
                    )}

                    {/* Cancel */}
                    {p.delivery_status === "pending" &&
                      p.paymentStatus !== "paid" && (
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="btn btn-sm btn-error text-white rounded-xl"
                        >
                          Cancel Parcel
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

          {/* --------------------------------------------------
               Pagination
          -------------------------------------------------- */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`btn btn-sm rounded-xl ${
                    currentPage === i + 1
                      ? "bg-black text-white border-black"
                      : "btn-outline"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyParcels;
