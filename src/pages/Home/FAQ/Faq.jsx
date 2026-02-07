import React, { useState } from "react";
import { faqData } from "../../../Data/faqData";
import { FaChevronDown, FaArrowRight, FaArrowUp } from "react-icons/fa";

const Faq = () => {
  const [open, setOpen] = useState(1);
  const [showAll, setShowAll] = useState(false);

  const visibleFaqs = showAll ? faqData : faqData.slice(0, 5);

  const toggleFaq = (id) => {
    setOpen(open === id ? null : id);
  };

  return (
    <div className=" py-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-[#03373D]">
          Frequently Asked Question (FAQ)
        </h1>
        <p className="text-[#606060] mt-3 text-lg">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>
      </div>
      <div>
        {visibleFaqs.map((faq) => (
          <div
            key={faq.id}
            className={`p-6 rounded-xl border transition-all cursor-pointer ${
              open === faq.id
                ? "border-[#0FA3A9] bg-[#E7F8F8]"
                : "border-gray-200 bg-white"
            }`}
            onClick={() => toggleFaq(faq.id)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg text-[#03373D]">
                {faq.question}
              </h3>
              {/* Arrow icon */}
              <FaChevronDown
                className={`transition-transform duration-300 ${
                  open === faq.id ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
            {/* FAQ Answer */}
            {open === faq.id && (
              <p className="mt-3 text-[#606060] leading-relaxed">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-10">
        {!showAll ? (
          /* Show More Button */
          <button
            onClick={() => setShowAll(true)}
            className="flex items-center gap-3 bg-[#CFEA74] text-black font-bold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            See More FAQ’s
            <span className="bg-black text-white p-2 rounded-full">
              <FaArrowRight />
            </span>
          </button>
        ) : (
          /* Show Less Button */
          <button
            onClick={() => {
              setShowAll(false);
              setOpen(1); // reset open item back to first FAQ
            }}
            className="flex items-center gap-3 bg-[#CFEA74] text-black font-bold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            Show Less FAQ’s
            <span className="bg-black text-white p-2 rounded-full">
              <FaArrowUp />
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Faq;
