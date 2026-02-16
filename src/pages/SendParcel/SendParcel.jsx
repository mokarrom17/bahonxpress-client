import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

// Utility function to generate tracking ID
const generateTrackingId = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `BX-${year}${month}${day}-${random}`;
};

const SendParcel = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { user } = useAuth();

  const [cost, setCost] = useState(null);
  // Load districts data from loader
  const districts = useLoaderData();
  // Extract unique regions for sender dropdown
  const regions = [...new Set(districts.map((d) => d.region))];
  // State for sender region and district selection
  const [senderRegion, setSenderRegion] = useState("");
  // Filter districts based on selected sender region
  const [senderDistrict, setSenderDistrict] = useState("");
  // Get districts for selected sender region
  const senderDistricts = districts.filter((d) => d.region === senderRegion);
  // Get covered areas for selected sender district
  const senderDistrictData = districts.find(
    (d) => d.district === senderDistrict,
  );

  // For receiver region and district, you can implement similar logic if needed
  const [receiverRegion, setReceiverRegion] = useState("");
  const [receiverDistrict, setReceiverDistrict] = useState("");
  const receiverDistricts = districts.filter(
    (d) => d.region === receiverRegion,
  );

  const receiverDistrictData = districts.find(
    (d) => d.district === receiverDistrict,
  );

  const saveParcel = (data, cost) => {
    const parcelData = {
      ...data,
      userEmail: user?.email, // ✅ logged-in user
      cost: cost,
      status: "pending", // ✅ initial status
      delivery_status: "pending", // ✅ initial delivery status
      deliveryType: "standard", // future upgrade
      trackingId: generateTrackingId(), // ✅ generate tracking ID
      createdAt: new Date().toISOString(), // ✅ proper ISO format
    };
    console.log("Saving to DB: ", parcelData);
    Swal.fire({
      icon: "success",
      title: "Booking Successful!",
      text: `Your parcel has been booked successfully. Charge: ${cost} Taka`,
      confirmButtonColor: "#16a34a",
    });
    // Send to backend using axios/fetch here
  };
  // Watch parcel type and weight for cost calculation
  const parcelType = watch("type");
  const parcelWeight = watch("parcelWeight");

  useEffect(() => {
    if (!parcelType || !parcelWeight || !senderDistrict || !receiverDistrict) {
      setCost(null);
      return;
    }

    const weight = Number(parcelWeight);
    const isDocument = parcelType === "document";
    const isSameDistrict = senderDistrict === receiverDistrict;

    let base = 0;
    let extra = 0;
    let outside = 0;

    if (isDocument) {
      base = isSameDistrict ? 60 : 80;
    } else {
      if (weight <= 3) {
        base = isSameDistrict ? 110 : 150;
      } else {
        base = isSameDistrict ? 110 : 150;
        extra = (weight - 3) * 40;

        if (!isSameDistrict) {
          outside = 40;
        }
      }
    }

    const total = base + extra + outside;

    setCost({
      base,
      extra,
      outside,
      total,
    });
  }, [parcelType, parcelWeight, senderDistrict, receiverDistrict]);

  const onSubmit = (data) => {
    if (!cost) return;

    Swal.fire({
      title: "Confirm Booking?",
      text: `Delivery charge will be ${cost} Taka`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Confirm Booking",
    }).then((result) => {
      if (result.isConfirmed) {
        saveParcel(data, cost);
      }
    });
  };

  return (
    <div className="bg-base-100 text-neutral px-6 md:px-12 lg:px-28 py-12 md:py-16 lg:py-20 rounded-2xl shadow-lg">
      <div className="mb-6">
        <h1 className="text-6xl font-extrabold mb-12">Add Parcel</h1>
        <h2 className="text-xl font-semibold mb-5">
          Enter your parcel details
        </h2>

        <div className="flex gap-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="document"
              {...register("type")}
              defaultChecked
            />
            <span>Document</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" value="non-document" {...register("type")} />
            <span>Non-Document</span>
          </label>
        </div>
      </div>
      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* 🔹 Top Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block mb-2 font-medium">Parcel Name</label>
            <input
              type="text"
              placeholder="Parcel Name"
              className="input input-bordered w-full"
              {...register("parcelName", { required: true })}
            />
            {errors.parcelName && (
              <p className="text-red-500 text-sm">Parcel name is required</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">Parcel Weight (KG)</label>
            <input
              type="number"
              placeholder="Parcel Weight (KG)"
              className="input input-bordered w-full"
              {...register("parcelWeight", { required: true })}
            />
          </div>
        </div>

        <div className="divider"></div>

        {/* 🔹 Sender + Receiver */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Sender Details */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-neutral">Sender Details</h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">Sender Name</label>
                <input
                  type="text"
                  placeholder="Sender Name"
                  className="input input-bordered w-full"
                  {...register("senderName", { required: true })}
                />
              </div>
              <div className="block mb-2">
                <label className="block mb-2">Your Region</label>
                <select
                  className="select select-bordered w-full"
                  value={senderRegion}
                  onChange={(e) => {
                    setSenderRegion(e.target.value);
                    setSenderDistrict(""); // reset district
                  }}
                >
                  <option value="">Select Region</option>

                  {regions.map((region, index) => (
                    <option key={index} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2">Address</label>
                <input
                  type="text"
                  placeholder="Address"
                  className="input input-bordered w-full"
                  {...register("senderAddress", { required: true })}
                />
              </div>

              <div>
                <label className="block mb-2">Sender Contact No</label>
                <input
                  type="tel"
                  placeholder="Sender Contact No"
                  className="input input-bordered w-full"
                  {...register("senderPhone", { required: true })}
                />
              </div>
              <div>
                <label className="block mb-2">Sender District</label>
                <select
                  className="select select-bordered w-full"
                  value={senderDistrict}
                  onChange={(e) => setSenderDistrict(e.target.value)}
                  disabled={!senderRegion}
                >
                  <option value="">Select District</option>

                  {senderDistricts.map((d, index) => (
                    <option key={index} value={d.district}>
                      {d.district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2">Sender Pickup Warehouse</label>
                <select
                  className="select select-bordered w-full"
                  {...register("senderWarehouse", { required: true })}
                  disabled={!senderDistrict}
                >
                  <option value="">Select Warehouse</option>

                  {senderDistrictData?.covered_area.map((area, index) => (
                    <option key={index} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block mb-2">Pickup Instruction</label>
                <textarea
                  rows="4"
                  placeholder="Pickup Instruction"
                  className="textarea textarea-bordered w-full"
                  {...register("pickupInstruction", { required: true })}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Receiver Details */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-neutral">Receiver Details</h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">Receiver Name</label>
                <input
                  type="text"
                  placeholder="Receiver Name"
                  className="input input-bordered w-full"
                  {...register("receiverName", { required: true })}
                />
              </div>

              <div>
                <label className="block mb-2">Receiver Region</label>
                <select
                  className="select select-bordered w-full"
                  value={receiverRegion}
                  onChange={(e) => {
                    setReceiverRegion(e.target.value);
                    setReceiverDistrict("");
                  }}
                >
                  <option value="">Select Region</option>

                  {regions.map((region, index) => (
                    <option key={index} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2">Receiver Address</label>
                <input
                  type="text"
                  placeholder="Address"
                  className="input input-bordered w-full"
                  {...register("receiverAddress", { required: true })}
                />
              </div>

              <div>
                <label className="block mb-2">Receiver Contact No</label>
                <input
                  type="tel"
                  placeholder="Receiver Contact No"
                  className="input input-bordered w-full"
                  {...register("receiverPhone", { required: true })}
                />
              </div>
              <div>
                <label className="block mb-2">Receiver District</label>
                <select
                  className="select select-bordered w-full"
                  value={receiverDistrict}
                  onChange={(e) => setReceiverDistrict(e.target.value)}
                  disabled={!receiverRegion}
                >
                  <option value="">Select District</option>

                  {receiverDistricts.map((d, index) => (
                    <option key={index} value={d.district}>
                      {d.district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2">
                  Receiver Delivery Warehouse
                </label>
                <select
                  className="select select-bordered w-full"
                  {...register("receiverWarehouse", { required: true })}
                  disabled={!receiverDistrict}
                >
                  <option value="">Select Warehouse</option>

                  {receiverDistrictData?.covered_area.map((area, index) => (
                    <option key={index} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block mb-2">Delivery Instruction</label>
                <textarea
                  rows="4"
                  placeholder="Delivery Instruction"
                  className="textarea textarea-bordered w-full"
                  {...register("deliveryInstruction", { required: true })}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <p className="text-sm text-gray-500">* PickUp Time 4pm-7pm Approx.</p>
        {/* Estimated Cost */}

        {cost !== null && (
          <div className="alert alert-info shadow-md text-lg font-semibold">
            <div className="w-full space-y-1">
              <div className="flex justify-between">
                <span>Base Charge:</span>
                <span>{cost.base} Taka</span>
              </div>

              {cost.extra > 0 && (
                <div className="flex justify-between">
                  <span>Extra Weight Charge:</span>
                  <span>{cost.extra} Taka</span>
                </div>
              )}

              {cost.outside > 0 && (
                <div className="flex justify-between">
                  <span>Outside District Charge:</span>
                  <span>{cost.outside} Taka</span>
                </div>
              )}

              <hr />

              <div className="flex justify-between font-bold text-xl">
                <span>Total:</span>
                <span>{cost.total} Taka</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div>
          <button type="submit" className="btn btn-primary text-neutral px-10">
            Proceed to Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendParcel;
