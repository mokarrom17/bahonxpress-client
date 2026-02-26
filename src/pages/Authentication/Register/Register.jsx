import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import axios from "axios";

const Register = () => {
  const { createUser, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    createUser(data.name, data.email, data.password)
      .then((result) => {
        console.log(result.user);
        // update UserInfo in the database

        // update user profile in the firebase
        const userProfile = {
          displayName: data.name,
          photoURL: profilePic,
        };
        updateUserProfile(userProfile)
          .then(() => {
            console.log("Profile name pic updated");
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
          {/* Profile Picture */}
          <div>
            <label className="block text-sm mb-1">Profile Picture</label>
            <input
              type="file"
              name="profilePicture"
              onChange={handleImageUpload}
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#CAEB66]"
              placeholder="Profile Picture"
            />
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
