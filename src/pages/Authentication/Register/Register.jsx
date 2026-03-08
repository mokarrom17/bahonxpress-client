import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import axios from "axios";
import useAxios from "../../../hooks/useAxios";

const Register = () => {
  const { createUser, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState("");
  const axiosInstance = useAxios();
  const location = useLocation();
  console.log(location);
  const navigate = useNavigate();

  const from = location.state?.from || "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    createUser(data.name, data.email, data.password)
      .then(async (result) => {
        console.log(result.user);
        // update UserInfo in the database
        const userInfo = {
          email: data.email,
          role: "user",
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        const userResponse = await axiosInstance.post("/users", userInfo);
        console.log(userResponse.data);
        // update user profile in the firebase
        const userProfile = {
          displayName: data.name,
          photoURL: profilePic,
        };
        updateUserProfile(userProfile)
          .then(() => {
            console.log("Profile name pic updated");
            navigate(from);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    console.log(image);
    const formData = new FormData();
    formData.append("image", image);
    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`;

    const res = await axios.post(imageUploadUrl, formData);
    setProfilePic(res.data.data.url);
  };

  return (
    <div>
      <div>
        <h2 className="text-5xl font-extrabold">Create an Account</h2>
        <p className="text-lg">Register with BahonXpress</p>
      </div>
      <div className="w-full max-w-md mt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Profile Picture (Exact like screenshot) */}
          <div className="flex flex-col items-start mb-4">
            <label
              htmlFor="profilePic"
              className="w-16 h-16 rounded-full bg-gray-100 border flex flex-col items-center justify-center cursor-pointer relative overflow-hidden hover:bg-gray-200 transition"
            >
              {/* Preview Image */}
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    className="w-10 opacity-60"
                  />
                  {/* Upload Arrow – RIGHT BOTTOM */}
                  <div className="absolute top-9 left-8 bg-white rounded-full shadow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 "
                      fill="#CAEB66"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 3l5 5h-3v6h-4V8H7l5-5z" />
                    </svg>
                  </div>
                </>
              )}
            </label>

            {/* Hidden File Input */}
            <input
              type="file"
              id="profilePic"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          {/* Name */}
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#CAEB66]"
              placeholder="Name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">Name is Required</p>
            )}
          </div>

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
              <p className="text-red-500 text-sm">Email is Required</p>
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
              <p className="text-red-500 text-sm">Password is Required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500 text-sm">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#CAEB66] py-3 rounded-md font-semibold hover:bg-lime-500 transition"
          >
            Register
          </button>
        </form>
        {/* Register Link */}
        <p className="mt-6 text-sm text-center">
          Don’t have any account?{" "}
          <Link
            className="text-[#8FA748] font-medium hover:underline"
            to="/login"
          >
            Login
          </Link>
        </p>
        <SocialLogin type="register" />
      </div>
    </div>
  );
};

export default Register;
