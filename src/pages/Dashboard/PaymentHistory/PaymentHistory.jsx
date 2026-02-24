import React from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isPending, data: payments = [] } = useQuery({
    queryKey: ["payment", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email =$[user.email]`);
      return res.data;
    },
  });
  if (isPending) {
    return <span className="loading loading-bars loading-xl"></span>;
  }
  return (
    <div className="p-6 bg-base-100 shadow rounded-xl">
      <h2 className="text-3xl font-bold mb-6">💳 Payment History</h2>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="text-base font-semibold">
              <th>Parcel ID</th>
              <th>Amount</th>
              <th>Transaction</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {payments.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No payment records found.
                </td>
              </tr>
            )}

            {payments.map((p) => (
              <tr key={p._id} className="hover">
                <td className="font-semibold text-black">
                  {p.parcelId.slice(0, 8)}...
                </td>

                <td className="font-semibold">৳{p.amount}</td>

                <td>{p.transactionId.slice(0, 12)}...</td>

                <td className="capitalize">{p.paymentMethod}</td>

                <td>
                  <div
                    className={`badge ${
                      p.status === "success" ? "badge-success" : "badge-error"
                    }`}
                  >
                    {p.status}
                  </div>
                </td>

                <td>{new Date(p.createdAt).toLocaleString()}</td>
                <td className="flex gap-2">
                  {/* View Button */}
                  <button className="btn btn-xs btn-outline btn-info">
                    👁 View
                  </button>

                  {/* Receipt Download */}
                  <button className="btn btn-xs btn-outline btn-success">
                    ⬇ Receipt
                  </button>

                  {/* Refund (optional) */}
                  {/* <button className="btn btn-xs btn-outline btn-error">
    ↩ Refund
  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
