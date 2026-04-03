import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { parcelId } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // ✅ Load parcel info
  const { data: parcelInfo = {}, isPending } = useQuery({
    queryKey: ["parcel", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });

  if (isPending) {
    return <span className="loading loading-bars loading-xl"></span>;
  }

  const amount = parcelInfo.cost?.total || 0;
  const amountInCents = amount * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔒 Prevent multiple clicks
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // 🔒 Stripe ready check
      if (!stripe || !elements) {
        setIsProcessing(false);
        return;
      }

      const card = elements.getElement(CardElement);
      if (!card) {
        setIsProcessing(false);
        return;
      }

      // 🔒 Prevent duplicate payment
      if (parcelInfo.paymentStatus === "paid") {
        Swal.fire("Already Paid!", "This parcel is already paid.", "info");
        setIsProcessing(false);
        return;
      }

      setError("");

      // ✅ Create payment intent
      const res = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
        parcelId,
      });

      const clientSecret = res.data.clientSecret;

      // ✅ Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.displayName || "Anonymous",
            email: user?.email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        setIsProcessing(false);
        return;
      }

      // ✅ Success flow
      if (result.paymentIntent.status === "succeeded") {
        // 🔥 Update parcel payment
        await axiosSecure.patch(`/parcels/payment/${parcelId}`);

        // 🔥 Save payment history
        await axiosSecure.post("/payments", {
          parcelId,
          userEmail: user.email,
          amount,
          transactionId: result.paymentIntent.id,
          paymentMethod: result.paymentIntent.payment_method_types,
          status: "success",
          paidAt: new Date().toISOString(),
        });

        Swal.fire({
          icon: "success",
          title: "Payment Successful!",
          text: "Your parcel is now paid.",
          confirmButtonColor: "#16a34a",
        });

        navigate("/dashboard/my-parcels");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      setError("Something went wrong. Please try again.");
    }

    setIsProcessing(false);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto"
      >
        <CardElement className="p-4 border rounded-md" />

        <button
          className="btn btn-primary text-black mt-4 w-full"
          type="submit"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? "Processing..." : `Pay ৳${amount}`}
        </button>

        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
