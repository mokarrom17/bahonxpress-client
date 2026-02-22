import React from "react";
import useAuth from "../../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router";

const SocialLogin = ({ type }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  const { signInWithGoogle } = useAuth();
  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then((result) => {
        console.log(result.user);
        navigate(from);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const buttonText =
    type === "register" ? "Register with Google" : "Login with Google";
  return (
    <div className="mt-6 w-full max-w-md">
      <div className="text-center text-gray-400 mb-4">OR</div>

      <button
        onClick={handleGoogleSignIn}
        className="w-full px-4 py-3 border border-gray-300 rounded-md 
                   flex items-center justify-center gap-3 
                   bg-white hover:bg-gray-100 
                   transition-all duration-300"
      >
        <svg
          aria-label="Google logo"
          width="30"
          height="30"
          viewBox="0 0 512 512"
        >
          <g>
            <path fill="#fff" d="m0 0H512V512H0"></path>
            <path
              fill="#34a853"
              d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
            ></path>
            <path
              fill="#4285f4"
              d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
            ></path>
            <path
              fill="#fbbc02"
              d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
            ></path>
            <path
              fill="#ea4335"
              d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
            ></path>
          </g>
        </svg>

        <span className="font-medium text-gray-700">{buttonText}</span>
      </button>
    </div>
  );
};

export default SocialLogin;
