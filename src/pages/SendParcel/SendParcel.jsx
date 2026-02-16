import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const SendParcel = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [cost, setCost] = useState(null);

  const saveParcel = (data, cost) => {
    const parcelData = {
      ...data,
      cost,
      creation_date: new Date().toISOString(),
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

  const onSubmit = (data) => {
    let baseCost = data.type === "document" ? 50 : 100;
    if (data.parcelWeight) baseCost += Number(data.parcelWeight) * 10;
    setCost(baseCost);

    Swal.fire({
      title: "Confirm Booking?",
      text: `Delivery charge will be ${baseCost} Taka`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes,  Confirm Booking",
    }).then((result) => {
      if (result.isConfirmed) {
        saveParcel(data, baseCost);
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
                  {...register("senderRegion", { required: true })}
                >
                  <option value="">Select your region</option>
                  <option>Dhaka</option>
                  <option>Chattogram</option>
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
              <div className="sm:col-span-2">
                <label className="block mb-2">Sender Pickup Warehouse</label>
                <select
                  className="select select-bordered w-full"
                  {...register("senderWarehouse", { required: true })}
                >
                  <option value="">Select Warehouse</option>
                  <option>Dhaka</option>
                  <option>Chattogram</option>
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
                  {...register("receiverRegion", { required: true })}
                >
                  <option value="">Select your region</option>
                  <option>Dhaka</option>
                  <option>Chattogram</option>
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

              <div className="sm:col-span-2">
                <label className="block mb-2">
                  Receiver Delivery Warehouse
                </label>
                <select
                  className="select select-bordered w-full"
                  {...register("receiverWarehouse", { required: true })}
                >
                  <option value="">Select Warehouse</option>
                  <option>Dhaka</option>
                  <option>Chattogram</option>
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
          <div className="alert alert-info">Estimated Cost: {cost} Taka</div>
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
