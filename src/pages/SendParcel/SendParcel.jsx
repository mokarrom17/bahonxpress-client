import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
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
    const weight = Number(data.parcelWeight);
    const isDocument = data.type === "document";
    const isSameDistrict = senderDistrict === receiverDistrict;

    let cost = 0;

    if (isDocument) {
      cost = isSameDistrict ? 60 : 80;
    } else {
      if (weight <= 3) {
        cost = isSameDistrict ? 110 : 150;
      } else {
        const extraKg = weight - 3;

        if (isSameDistrict) {
          cost = 110 + extraKg * 40;
        } else {
          cost = 150 + extraKg * 40 + 40;
        }
      }
    }

    setCost(cost);

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
