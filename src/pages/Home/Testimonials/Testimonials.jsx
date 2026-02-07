import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import image from "../../../assets/customer-top.png";
import reviewQuote from "../../../assets/reviewQuote.png";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetch("/testimonial.json")
      .then((res) => res.json())
      .then((data) => setTestimonials(data));
  }, []);

  return (
    <div className="mt-12">
      <div className="space-y-3 max-w-2xl mx-auto text-center">
        <img className="mx-auto" src={image} alt="" />
        <h2 className="text-4xl font-extrabold">
          What our customers are saying
        </h2>
        <p className="text-[#606060] text-md">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>
      </div>

      <div className="relative w-full pt-8 pb-24 sm:pb-32 lg:pb-40">
        {/* === Navigation + Pagination Wrapper === */}
        <div className="absolute left-1/2 bottom-10 -translate-x-1/2 z-20 flex items-center gap-5">
          {/* Prev */}
          <button className="swiper-prev p-3 bg-white hover:bg-[#CFEA74] border rounded-full shadow">
            <FaArrowLeft className="text-gray-600" />
          </button>

          {/* Pagination Dots */}
          <div className="swiper-pagination !static flex gap-2"></div>

          {/* Next */}
          <button className="swiper-next p-3 bg-white hover:bg-[#CFEA74] border rounded-full shadow">
            <FaArrowRight className="text-black" />
          </button>
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={3}
          centeredSlides={true} // <-- FIXED: ensures all cards same size
          spaceBetween={30}
          loop={true}
          pagination={{ el: ".swiper-pagination", clickable: true }}
          navigation={{
            prevEl: ".swiper-prev",
            nextEl: ".swiper-next",
          }}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="testimonial-card bg-white p-8 rounded-2xl transition-all duration-300 shadow-md">
                <div className="flex justify-start mb-4">
                  <img
                    src={reviewQuote}
                    alt=""
                    className="w-10 h-10 opacity-80"
                  />
                </div>
                <p className="text-[#4A4A4A] text-left leading-relaxed mt-2 line-clamp-3">
                  {testimonial.quote}
                </p>

                <hr
                  className="my-6 border-0 border-t-2 border-dashed"
                  style={{ borderColor: "#9CC5C0" }}
                />

                <div className="flex items-center gap-4">
                  <img
                    className="w-14 h-14 rounded-full"
                    src={testimonial.avatar}
                    alt=""
                  />
                  <div className="leading-tight">
                    <h3 className="font-bold text-lg text-[#03373D] ">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-[#606060]">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Pagination styling */}
        <style>{`
         /* Default style for all slides except active */
          .swiper-slide .testimonial-card {
            filter: blur(2px);
            opacity: 0.4;
            transform: scale(0.9);
            transition: all 0.4s ease;
          }

          /* Active center slide */
          .swiper-slide-active .testimonial-card {
            filter: blur(0);
            opacity: 1;
            transform: scale(1);
          }

          /* Swiper transition smooth */
          .swiper-slide {
            transition: transform 0.4s ease, opacity 0.4s ease;
          }
          .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
            background-color: #BFDCC5;
            opacity: 0.5;
          }
          .swiper-pagination-bullet-active {
            background-color: #CFEA74 !important;
            opacity: 1 !important;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Testimonials;
