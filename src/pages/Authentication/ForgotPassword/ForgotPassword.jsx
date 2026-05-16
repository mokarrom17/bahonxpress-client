import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      await resetPassword(data.email);
      setSentEmail(data.email);
      setSent(true);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Success state
  if (sent) {
    return (
      <div className="w-full max-w-md mt-6">
        <div className="flex flex-col items-center text-center py-8">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-[#CAEB66] flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-extrabold mb-3">Check your inbox</h2>
          <p className="text-gray-500 mb-2">We sent a password reset link to</p>
          <p className="font-semibold text-gray-800 mb-6">{sentEmail}</p>

          <p className="text-sm text-gray-500 mb-8">
            Didn't receive the email? Check your spam folder or try again.
          </p>

          <button
            onClick={() => setSent(false)}
            className="w-full border border-gray-300 py-3 rounded-md font-semibold hover:bg-gray-50 transition-all duration-200 mb-4"
          >
            Try a different email
          </button>

          <Link
            to="/login"
            className="w-full block text-center bg-[#CAEB66] py-3 rounded-md font-semibold hover:bg-lime-500 transition-all duration-300"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  // 📝 Form state
  return (
    <div className="w-full max-w-md mt-6">
      {/* Title */}
      <div className="mb-8">
        <h2 className="text-4xl font-extrabold mb-2">Forgot Password?</h2>
        <p className="text-gray-600">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#CAEB66] outline-none"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#CAEB66] py-3 rounded-md font-semibold hover:bg-lime-500 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>

      {/* Back to login */}
      <p className="mt-6 text-sm text-center">
        Remember your password?{" "}
        <Link
          to="/login"
          className="text-[#8FA748] font-medium hover:underline"
        >
          Back to Login
        </Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
