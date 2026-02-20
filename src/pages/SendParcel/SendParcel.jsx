import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

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

  const axiosSecure = useAxiosSecure();

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

  const saveParcel = async (formData, costData) => {
    try {
      const parcelData = {
        ...formData,
        userEmail: user?.email,
        cost: costData,
        status: "pending",
        delivery_status: "pending",
        deliveryType: "standard",
        trackingId: generateTrackingId(),
        createdAt: new Date().toISOString(),
      };

      axiosSecure.post("/parcels", parcelData).then((res) => {
        console.log(res.data);
        if (res.data.insertedId) {
          // Here i could redirect to a payment page or trigger a payment modal
          Swal.fire({
            icon: "success",
            title: "Booking Successful!",
            // text: `Tracking ID: ${parcelData.trackingId}`,
            confirmButtonColor: "#16a34a",
          });
        }
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to save parcel", "error");
    }
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
    const weightLimit = 3;

    let base = 0;
    let extra = 0;
    let outside = 0;
    let extraKg = 0;

    if (isDocument) {
      base = isSameDistrict ? 60 : 80;
    } else {
      base = isSameDistrict ? 110 : 150;

      if (weight > weightLimit) {
        extraKg = weight - weightLimit;
        extra = extraKg * 40;

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
      extraKg,
    });
  }, [parcelType, parcelWeight, senderDistrict, receiverDistrict]);

  const onSubmit = (parcelData) => {
    if (!cost) return;

    const weight = Number(parcelWeight);
    const isDocument = parcelType === "document";
    const isSameDistrict = senderDistrict === receiverDistrict;
    const weightLimit = 3;

    Swal.fire({
      showConfirmButton: false,
      width: 520,
      background: "#ffffff",
      html: `
    <div style="font-family: 'Inter', sans-serif; text-align:left; padding:5px;">

      <!-- Icon -->
      <div style="text-align:center; margin-bottom:15px;">
        <div style="
          width:70px;
          height:70px;
          border-radius:50%;
          border:3px solid #0ea5a4;
          display:flex;
          align-items:center;
          justify-content:center;
          margin:auto;
          font-size:32px;
          color:#0ea5a4;">
          i
        </div>
      </div>

      <!-- Title -->
      <h2 style="text-align:center; font-size:22px; font-weight:600; margin-bottom:20px;">
        Delivery Cost Breakdown
      </h2>

      <!-- Parcel Info -->
      <div style="line-height:1.8; font-size:15px;">
        <div><strong>Parcel Type:</strong> ${parcelType}</div>
        <div><strong>Weight:</strong> ${weight} kg</div>
        <div><strong>Delivery Zone:</strong> ${
          isSameDistrict ? "Within District" : "Outside District"
        }</div>
      </div>

      <hr style="margin:15px 0;"/>

      <!-- Base -->
      <div style="display:flex; justify-content:space-between;">
        <span><strong>Base Cost:</strong></span>
        <span>৳${cost.base}</span>
      </div>

      ${
        !isDocument && cost.extra > 0
          ? `
          <div style="margin-top:12px;">
            <div style="display:flex; justify-content:space-between;">
              <span><strong>Extra Charges:</strong></span>
              <span>৳${cost.extra + cost.outside}</span>
            </div>

            <div style="margin-top:8px; font-size:13px; color:#555; line-height:1.6;">
              Non-document over ${weightLimit}kg ${
                isSameDistrict
                  ? "within the district."
                  : "outside the district."
              }
              <br/>
              Extra weight = ${weight}kg - ${weightLimit}kg = ${cost.extraKg}kg

              <br/>
              Weight charge: 40 × ${cost.extraKg}kg = ৳${cost.extra}
              ${
                cost.outside > 0
                  ? `<br/>Outside district extra charge = ৳${cost.outside}`
                  : ""
              }
            </div>
          </div>
          `
          : !isDocument
            ? `
          <div style="margin-top:10px; font-size:13px; color:#555;">
            Non-document up to ${weightLimit}kg ${
              isSameDistrict ? "within the district." : "outside the district."
            }
            <br/>
            Base rate applied.
          </div>
          `
            : `
          <div style="margin-top:10px; font-size:13px; color:#555;">
            Document ${
              isSameDistrict ? "within the district." : "outside the district."
            }
            <br/>
            Flat rate applied.
          </div>
          `
      }

      <hr style="margin:15px 0;"/>

      <!-- Total -->
      <div style="
        display:flex;
        justify-content:space-between;
        font-size:18px;
        font-weight:700;
        color:#15803d;">
        <span>Total Cost:</span>
        <span>৳${cost.total}</span>
      </div>

      <!-- Buttons -->
      <div style="display:flex; gap:10px; margin-top:25px;">
        <button id="paymentBtn"
          style="
            flex:1;
            padding:12px;
            background:#15803d;
            color:white;
            border:none;
            border-radius:6px;
            font-weight:600;
            cursor:pointer;">
          💳 Proceed to Payment
        </button>

        <button id="editBtn"
          style="
            flex:1;
            padding:12px;
            background:#e5e7eb;
            color:#111;
            border:none;
            border-radius:6px;
            font-weight:600;
            cursor:pointer;">
          ✏ Continue Editing
        </button>
      </div>

    </div>
    `,
      didOpen: () => {
        document.getElementById("paymentBtn").onclick = () => {
          Swal.close();
          saveParcel(parcelData, cost);
        };

        document.getElementById("editBtn").onclick = () => {
          Swal.close();
        };
      },
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
        {/* {cost !== null && (
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
        )} */}

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
