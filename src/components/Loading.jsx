import { FaTruckMoving } from "react-icons/fa";

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100">
      {/* Truck Icon */}
      <div className="relative flex items-center justify-center">
        <FaTruckMoving className="text-primary text-5xl animate-bounce" />

        {/* Road line animation */}
        <div className="absolute -bottom-3 w-24 h-[2px] bg-primary overflow-hidden">
          <div className="w-1/2 h-full bg-white animate-[move_1s_linear_infinite]" />
        </div>
      </div>

      {/* Text */}
      <p className="mt-6 text-lg font-semibold text-base-content">
        Delivering your data...
      </p>

      {/* Subtext */}
      <p className="text-sm text-gray-500 mt-1">
        Please wait while we load your parcels
      </p>

      {/* Custom animation */}
      <style>
        {`
          @keyframes move {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}
      </style>
    </div>
  );
};

export default Loading;
