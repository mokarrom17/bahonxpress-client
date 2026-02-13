import { useState, useMemo, useRef, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";

const DistrictSearch = ({ districts, onSelectDistrict }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);

  const filteredDistricts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return districts.filter((item) =>
      item.district.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, districts]);

  // 🔹 Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔥 Handle Search Button Click
  const handleSearch = () => {
    console.log("Filtered:", filteredDistricts);
    if (filteredDistricts.length > 0) {
      onSelectDistrict(filteredDistricts[0]); // প্রথম match select করবে
      setSearchTerm(filteredDistricts[0].district);
      setShowDropdown(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* 🔍 Search Input + Button */}
      <div className="flex items-center bg-gray-100 rounded-full overflow-hidden shadow-sm">
        <div className="flex items-center px-6 py-3 w-full">
          <IoSearchOutline className="text-gray-500 text-xl mr-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search district..."
            className="bg-transparent outline-none w-full text-gray-700"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-[#CAEB66] -ml-10 px-8 py-3 rounded-full font-semibold hover:bg-lime-500 transition"
        >
          {" "}
          Search{" "}
        </button>
      </div>

      {/* 🔽 Dropdown */}
      {showDropdown && filteredDistricts.length > 0 && (
        <div className="absolute w-full bg-white shadow-lg rounded-xl mt-2 max-h-60 overflow-y-auto z-50">
          {filteredDistricts.map((item) => (
            <div
              key={item.district}
              onClick={() => {
                onSelectDistrict(item);
                setSearchTerm(item.district);
                setShowDropdown(false);
              }}
              className="px-5 py-3 hover:bg-[#CAEB66] cursor-pointer transition"
            >
              {item.district}
            </div>
          ))}
        </div>
      )}

      {showDropdown && searchTerm && filteredDistricts.length === 0 && (
        <div className="absolute w-full bg-white shadow-lg rounded-xl mt-2 px-5 py-3 text-red-500">
          No district found
        </div>
      )}
    </div>
  );
};

export default DistrictSearch;
