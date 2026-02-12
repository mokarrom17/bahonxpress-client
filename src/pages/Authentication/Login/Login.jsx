import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <div className="w-full max-w-md mt-6">
      {/* Title */}
      <div className="mb-8">
        <h2 className="text-4xl font-extrabold mb-2">Welcome Back</h2>
        <p className="text-gray-600">Login with BahonXpress</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#CAEB66]"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">Email is required</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            {...register("password", {
              required: true,
              minLength: 6,
            })}
            className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#CAEB66]"
            placeholder="Password"
          />
          {errors.password?.type === "required" && (
            <p className="text-red-500 text-sm">Password is required</p>
          )}
          {errors.password?.type === "minLength" && (
            <p className="text-red-500 text-sm">
              Password must be at least 6 characters
            </p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <button
            type="button"
            className="text-sm text-[#8FA748] hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-[#CAEB66] py-3 rounded-md font-semibold hover:bg-lime-500 transition-all duration-300"
        >
          Login
        </button>
      </form>

      {/* Register Link */}
      <p className="mt-6 text-sm text-center">
        Don’t have any account?{" "}
        <Link
          className="text-[#8FA748] font-medium hover:underline"
          to="/register"
        >
          Register
        </Link>
      </p>

      {/* Social Login */}
      <div className="mt-6">
        <SocialLogin type="login" />
      </div>
    </div>
  );
};

export default Login;
