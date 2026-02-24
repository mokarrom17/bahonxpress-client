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

  const [error, setError] = useState("");

  const { data: parcelInfo = {}, isPending } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });
  if (isPending) {
    return <span className="loading loading-bars loading-xl"></span>;
  }

  console.log(parcelInfo);

  const amount = parcelInfo.cost?.total || 0;
  const amountInCents = amount * 100;
  console.log(amountInCents);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);

    if (!card) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
    } else {
      setError("");
      console.log("payment method", paymentMethod);
      //step-2: Create Payment Intent
      const res = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
        parcelId,
      });
      const clientSecret = res.data.clientSecret;
      // step-3:Confirm Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName,
            email: user.email,
          },
        },
      });
      if (result.error) {
        setError(result.error.message);
      } else {
        setError("");
        if (result.paymentIntent.status === "succeeded") {
          console.log("Payment Succeeded");
          console.log(result);

          // STEP 4A — Update parcel payment status
          await axiosSecure.patch(`/parcels/payment/${parcelId}`);

          // STEP 4B — Save payment history
          await axiosSecure.post("/payments", {
            parcelId,
            userEmail: user.email,
            amount: amount, // in BDT
            transactionId: result.paymentIntent.id,
            paymentMethod: result.paymentIntent.payment_method_types,
            status: "success",
          });

          // STEP 4C — Success UI message
          Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            text: "Your parcel is now paid.",
            confirmButtonColor: "#16a34a",
          });

          // Redirect user if needed:
          navigate("/dashboard/my-parcels");
        }
      }
      console.log("res from intent", res);
    }
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4  bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto"
      >
        <CardElement className="p-4 border rounded-md"></CardElement>
        <button
          className="btn btn-primary text-black mt-4 w-full"
          type="submit"
          disabled={!stripe}
        >
          Pay${amount}
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
