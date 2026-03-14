import { Link } from "react-router";
import { FaHome, FaLock } from "react-icons/fa";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-4 text-error text-6xl">
          <FaLock />
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-error mb-2">403</h1>

        <h2 className="text-2xl font-semibold mb-3">Access Forbidden</h2>

        {/* Message */}
        <p className="text-gray-500 mb-6">
          You do not have permission to access this page. Please contact the
          administrator if you believe this is a mistake.
        </p>

        {/* Button */}
        <Link to="/">
          <button className="btn btn-primary text-black flex items-center gap-2 mx-auto">
            <FaHome />
            Go Back Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
