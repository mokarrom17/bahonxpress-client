import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

/* =========================================
    Reusable Input
========================================= */
const InputField = ({ label, icon, error, register, name, ...props }) => (
  <div className="group">
    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
      {label}
    </label>

    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg">
        {icon}
      </span>

      <input
        {...register(name)}
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
    Component
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
      Load User
  ========================================= */
  useEffect(() => {
    axiosSecure.get("/users/me").then((res) => {
      reset({
        name: res.data?.name || user?.displayName || "",

        phone: res.data?.phone || "",

        alternatePhone: res.data?.alternatePhone || "",

        gender: res.data?.gender || "",

        dateOfBirth: res.data?.dateOfBirth || "",

        nid: res.data?.nid || "",

        emergencyContact: res.data?.emergencyContact || "",

        district: res.data?.district || "",

        address: res.data?.address || "",

        photoURL: res.data?.photoURL || user?.photoURL || "",
      });
    });
  }, [axiosSecure, reset, user?.displayName, user?.photoURL]);

  /* =========================================
      Submit
  ========================================= */
  const onSubmit = async (data) => {
    setLoading(true);

    setSuccess(false);

    setError("");

    try {
      await axiosSecure.patch("/users/profile", data);

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
      Avatar
  ========================================= */
  const photoURL = watch("photoURL");

  const name = watch("name");

  const avatarSrc =
    !imgError && photoURL
      ? photoURL
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name || "User",
        )}&background=3b82f6&color=fff&size=128`;

  return (
    <div className="w-full mx-auto pl-3 px-4">
      {/* 
      =========================================
        Banner
      ========================================= */}
      <div className="relative rounded-4xl overflow-hidden h-44 bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full border border-white" />
          <div className="absolute bottom-5 right-10 w-24 h-24 rounded-full border border-white" />
        </div>

        <div className="absolute bottom-7 left-8">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-[0.3em]">
            Account Settings
          </p>

          <h1 className="text-white text-4xl font-bold mt-2">Update Profile</h1>
        </div>
      </div>

      {/* =========================================
          Main Card
      ========================================= */}
      <div className="bg-white rounded-4xl shadow-sm border border-gray-100 px-8 pt-20 pb-8 relative -mt-10">
        {/* Avatar */}
        <div className="absolute -top-14 left-8">
          <div className="relative">
            <img
              src={avatarSrc}
              alt="avatar"
              onError={() => setImgError(true)}
              className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-xl"
            />

            <span className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full" />
          </div>
        </div>

        {/* User Info */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800">
            {name || user?.displayName || "Your Name"}
          </h2>

          <p className="text-gray-400 mt-1">{user?.email}</p>
        </div>

        {/* Alerts */}
        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium">
            ✅ Profile updated successfully
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
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
              <InputField
                label="Full Name"
                icon="👤"
                name="name"
                register={register}
                error={errors.name}
                placeholder="Your full name"
              />

              <InputField
                label="Email"
                icon="📧"
                name="email"
                register={register}
                defaultValue={user?.email}
                disabled
              />

              <InputField
                label="Phone Number"
                icon="📞"
                name="phone"
                register={register}
                error={errors.phone}
                placeholder="01XXXXXXXXX"
              />

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
              <InputField
                label="National ID"
                icon="🪪"
                name="nid"
                register={register}
                placeholder="NID number"
              />

              <InputField
                label="Emergency Contact"
                icon="🚨"
                name="emergencyContact"
                register={register}
                placeholder="Emergency number"
              />

              <InputField
                label="District"
                icon="📍"
                name="district"
                register={register}
                placeholder="Your district"
              />

              <InputField
                label="Photo URL"
                icon="🖼️"
                name="photoURL"
                register={register}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* =========================================
              Address
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
              {/* Role */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Role Badge
                </p>

                <span className="inline-flex items-center px-5 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                  USER
                </span>
              </div>

              {/* Joined */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Account Created
                </p>

                <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-700">
                  Apr 2026
                </div>
              </div>
            </div>
          </div>

          {/* =========================================
              Submit
          ========================================= */}
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
