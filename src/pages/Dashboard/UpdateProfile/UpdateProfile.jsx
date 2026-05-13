import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import { useQuery } from "@tanstack/react-query";

import useAuth from "../../../hooks/useAuth";

import useAxiosSecure from "../../../hooks/useAxiosSecure";

/* =========================================
    Reusable Input Component
========================================= */
const InputField = ({
  label,
  icon,
  error,
  register,
  name,
  validation,
  ...props
}) => (
  <div className="group">
    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
      {label}
    </label>

    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg">
        {icon}
      </span>

      <input
        {...register(name, validation)}
        {...props}
        className={`w-full bg-gray-50 border rounded-2xl pl-11 pr-4 py-3.5 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-4 transition-all duration-200
          
          ${
            error
              ? "border-red-200 focus:ring-red-50"
              : "border-gray-100 focus:border-blue-300 focus:ring-blue-50"
          }`}
      />
    </div>

    {error && <p className="text-xs text-red-500 mt-2">{error.message}</p>}
  </div>
);

/* =========================================
    Main Component
========================================= */
const UpdateProfile = () => {
  const { user } = useAuth();

  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState("");

  const [imgError, setImgError] = useState(false);

  /* =========================================
      React Hook Form
  ========================================= */
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  /* =========================================
      TanStack Query
  ========================================= */
  const {
    data: userData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-profile"],

    queryFn: async () => {
      const res = await axiosSecure.get("/users/me");

      return res.data;
    },
  });

  /* =========================================
      Reset Form Data
  ========================================= */
  useEffect(() => {
    if (userData) {
      reset({
        name: userData?.name || "",

        phone: userData?.phone || "",

        alternatePhone: userData?.alternatePhone || "",

        gender: userData?.gender || "",

        dateOfBirth: userData?.dateOfBirth || "",

        nid: userData?.nid || "",

        emergencyContact: userData?.emergencyContact || "",

        district: userData?.district || "",

        address: userData?.address || "",

        photoURL: userData?.photoURL || "",
      });
    }
  }, [userData, reset]);

  /* =========================================
      Submit Handler
  ========================================= */
  const onSubmit = async (data) => {
    setLoading(true);

    setSuccess(false);

    setError("");

    try {
      await axiosSecure.patch("/users/profile", data);

      await refetch();

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
      Loading State
  ========================================= */
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  /* =========================================
      Avatar Preview
  ========================================= */
  const photoURL = watch("photoURL");

  const name = watch("name");

  const avatarSrc =
    !imgError && photoURL
      ? photoURL
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name || "User",
        )}&background=2563eb&color=fff&size=128`;

  return (
    <div className="w-full mx-auto px-4 pl-3">
      {/* =========================================
          Banner
      ========================================= */}
      <div className="relative h-80 rounded-3xl overflow-hidden bg-linear-to-br from-blue-500 via-blue-600 to-indigo-700">
        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
              radial-gradient(circle at 80% 20%, white 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* BX Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <h1 className="text-white/4 text-[220px] md:text-[280px] font-black tracking-tight leading-none">
            BX
          </h1>
        </div>

        {/* Text */}
        <div className="absolute bottom-10 left-7">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">
            Account Settings
          </p>

          <h1 className="text-white text-5xl font-black tracking-tight mt-1">
            Update Profile
          </h1>
        </div>

        {/* Avatar */}
        <div className="absolute top-1/2 -translate-y-1/2 right-8">
          <div className="relative">
            <img
              src={avatarSrc}
              alt="avatar"
              onError={() => setImgError(true)}
              className="w-28 h-28 rounded-3xl object-cover border border-white/40 shadow-2xl backdrop-blur-md bg-white/10 p-1"
            />

            <span className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" />
          </div>
        </div>
      </div>

      {/* =========================================
          Main Card
      ========================================= */}
      <div className="relative mt-2 bg-white rounded-4xl border border-gray-100 shadow-sm px-8 pt-20 pb-8">
        {/* User Info */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800">
            {name || "Your Name"}
          </h2>

          <p className="text-gray-400 mt-1">{user?.email}</p>
        </div>

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
            ✅ Profile updated successfully
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
            ❌ {error}
          </div>
        )}

        {/* =========================================
            Form
        ========================================= */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* =========================================
              Personal Information
          ========================================= */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <InputField
                label="Full Name"
                icon="👤"
                name="name"
                register={register}
                error={errors.name}
                placeholder="Your full name"
                validation={{
                  required: "Name is required",
                }}
              />

              {/* Email */}
              <InputField
                label="Email"
                icon="📧"
                name="email"
                register={register}
                defaultValue={user?.email}
                disabled
              />

              {/* Phone */}
              <InputField
                label="Phone Number"
                icon="📞"
                name="phone"
                register={register}
                error={errors.phone}
                placeholder="01XXXXXXXXX"
                validation={{
                  required: "Phone is required",

                  minLength: {
                    value: 11,

                    message: "Phone must be 11 digits",
                  },
                }}
              />

              {/* Alternate Phone */}
              <InputField
                label="Alternate Phone"
                icon="☎️"
                name="alternatePhone"
                register={register}
                placeholder="Backup number"
              />

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Gender
                </label>

                <select
                  {...register("gender")}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm text-gray-700 focus:outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                >
                  <option value="">Select Gender</option>

                  <option value="Male">Male</option>

                  <option value="Female">Female</option>

                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Date of Birth */}
              <InputField
                label="Date of Birth"
                icon="🎂"
                name="dateOfBirth"
                type="date"
                register={register}
              />
            </div>
          </div>

          {/* =========================================
              Identity Information
          ========================================= */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Identity Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* NID */}
              <InputField
                label="National ID"
                icon="🪪"
                name="nid"
                register={register}
                error={errors.nid}
                placeholder="NID number"
                validation={{
                  minLength: {
                    value: 10,

                    message: "NID too short",
                  },
                }}
              />

              {/* Emergency Contact */}
              <InputField
                label="Emergency Contact"
                icon="🚨"
                name="emergencyContact"
                register={register}
                placeholder="Emergency phone number"
              />

              {/* District */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  District
                </label>

                <select
                  {...register("district")}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm text-gray-700 focus:outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                >
                  <option value="">Select District</option>

                  <option value="Dhaka">Dhaka</option>

                  <option value="Chattogram">Chattogram</option>

                  <option value="Sylhet">Sylhet</option>

                  <option value="Rajshahi">Rajshahi</option>

                  <option value="Khulna">Khulna</option>

                  <option value="Barishal">Barishal</option>
                </select>
              </div>

              {/* Photo URL */}
              <InputField
                label="Photo URL"
                icon="🖼️"
                name="photoURL"
                register={register}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </div>

          {/* =========================================
              Address Information
          ========================================= */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Address Information
            </h3>

            <div className="relative">
              <span className="absolute left-4 top-4 text-gray-300 text-lg">
                📍
              </span>

              <textarea
                {...register("address")}
                rows={4}
                placeholder="Your full address"
                className="w-full bg-gray-50 border border-gray-100 rounded-3xl pl-11 pr-4 py-4 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50 resize-none"
              />
            </div>
          </div>

          {/* =========================================
              Account Information
          ========================================= */}
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Account Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role Badge */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Role Badge
                </p>

                <span
                  className={`inline-flex items-center px-5 py-2 rounded-full text-sm font-semibold
                  
                    ${
                      userData?.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : userData?.role === "rider"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                    }
                  `}
                >
                  {userData?.role?.toUpperCase()}
                </span>
              </div>

              {/* Created */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Account Created
                </p>

                <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-700">
                  {userData?.createdAt
                    ? new Date(userData.createdAt).toLocaleDateString("en-US", {
                        month: "short",

                        year: "numeric",
                      })
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-md shadow-blue-100 hover:shadow-lg hover:shadow-blue-200"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
