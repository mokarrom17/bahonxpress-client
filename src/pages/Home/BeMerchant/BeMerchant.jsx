import React from "react";
import merchant from "../../../assets/location-merchant.png";

const BeMerchant = () => {
  return (
    <div>
      <div className="hero bg-[#03373D] rounded-4xl text-white p-20">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img src={merchant} className="max-w-sm rounded-lg shadow-2xl" />
          <div>
            <h1 className="text-4xl font-bold">
              Merchant and Customer Satisfaction is Our First Priority
            </h1>
            <p className="py-6">
              We offer the lowest delivery charge with the highest value along
              with 100% safety of your product. Pathao courier delivers your
              parcels in every corner of Bangladesh right on time.
            </p>
            <div className="lg:flex gap-4 ">
              <button className="btn font-bold btn-primary rounded-full bg-[#CAEB66] text-black">
                Become a Merchant
              </button>
              <button className="btn font-bold rounded-full btn-outline text-[#CAEB66] hover:bg-[#CAEB66] hover:text-black">
                Earn with ZapShift Courier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeMerchant;
