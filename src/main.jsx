import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import { router } from "./router/router.jsx";

import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles

AOS.init();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="font-urbanist max-w-7xl mx-auto bg-base-200 px-12">
      <RouterProvider router={router} />,
    </div>
  </StrictMode>,
);
