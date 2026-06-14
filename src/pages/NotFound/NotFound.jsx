import { Link } from "react-router";
import { FaHome } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="text-center max-w-md">
        {/* Animated 404 */}
        <h1 className="text-[120px] font-black leading-none text-black/10 select-none">
          404
        </h1>

        {/* Icon */}
        <div className="flex justify-center -mt-6 mb-4 text-5xl">🔍</div>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>

        {/* Message */}
        <p className="text-gray-500 mb-6">
          The page you are looking for does not exist or has been moved. Please
          check the URL or go back to the homepage.
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

export default NotFound;
