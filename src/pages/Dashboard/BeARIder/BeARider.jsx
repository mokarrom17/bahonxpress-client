import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useLoaderData } from "react-router";
import agent from "../../../assets/agent-pending.png";

const BeARider = () => {
  const warehouseData = useLoaderData(); // districts + regions
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, watch, reset } = useForm();

  // Extract unique regions
  const uniqueRegions = [...new Set(warehouseData.map((item) => item.region))];

  // Watch region selection
  const selectedRegion = watch("region");

  // Filter districts based on selected region
  const filteredDistricts = warehouseData
    .filter((item) => item.region === selectedRegion)
    .map((d) => d.district);

  // Submit Rider Application
  const onSubmit = async (data) => {
    const riderData = {
      ...data,
      userName: user.displayName,
      userEmail: user.email,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    console.log("📨 Rider application submitted:", riderData);
    try {
      const res = await axiosSecure.post("/riders", riderData);
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted!",
          text: "Your rider application is under review.",
        });
        reset(); // Reset form fields after successful submission
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Please try again.",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-2">Be a Rider</h1>

      <p className="text-gray-600 max-w-2xl mb-8">
        Join BahonXpress as a delivery rider and start earning with flexibility
        & reliability.
      </p>

      <div className="border-t mb-8"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ===== LEFT: FORM ===== */}
        <div>
          <h2 className="text-2xl font-semibold mb-5">
            Tell us about yourself
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Your Name</label>
                <input
                  type="text"
                  value={user.displayName}
                  readOnly
                  className="input input-bordered w-full bg-gray-100"
                />
              </div>

              <div>
                <label>Your Age</label>
                <input
                  {...register("age")}
                  type="number"
                  placeholder="Your age"
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Your Email</label>
                <input
                  type="text"
                  value={user.email}
                  readOnly
                  className="input input-bordered w-full bg-gray-100"
                />
              </div>

              <div>
                <label>Your Region</label>
                <select
                  {...register("region")}
                  className="select select-bordered w-full"
                >
                  <option value="">Select your region</option>
                  {uniqueRegions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>District</label>
                <select
                  {...register("district")}
                  className="select select-bordered w-full"
                >
                  <option value="">Select district</option>
                  {filteredDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Phone</label>
                <input
                  {...register("phone")}
                  type="text"
                  placeholder="Phone number"
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>NID Number</label>
                <input
                  {...register("nid")}
                  type="text"
                  placeholder="NID number"
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label>Bike Brand Name</label>
                <input
                  {...register("bikeBrand")}
                  type="text"
                  placeholder="Honda / Yamaha / TVS"
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            {/* Row 5 */}
            <div>
              <label>Bike Registration Number</label>
              <input
                {...register("bikeReg")}
                type="text"
                placeholder="DM-XX-12345"
                className="input input-bordered w-full"
              />
            </div>

            {/* Submit */}
            <button className="btn bg-lime-500 hover:bg-lime-600 text-white w-full">
              Submit Application
            </button>
          </form>
        </div>

        {/* ===== RIGHT: IMAGE ===== */}
        <div className="flex justify-center">
          <img src={agent} alt="rider" className="w-80 lg:w-96" />
        </div>
      </div>
    </div>
  );
};

export default BeARider;
