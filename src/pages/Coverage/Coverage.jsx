import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { districts } from "../../Data/warehouse.js";
import { useEffect, useMemo, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import DistrictSearch from "./DistrictSearch.jsx";

// Leaflet icon fix
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Coverage = () => {
  const bangladeshPosition = [23.685, 90.3563];
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const mapRef = useRef(null);

  // 🚀 Fly to selected district
  useEffect(() => {
    if (
      selectedDistrict &&
      mapRef.current &&
      selectedDistrict.latitude &&
      selectedDistrict.longitude
    ) {
      mapRef.current.flyTo(
        [selectedDistrict.latitude, selectedDistrict.longitude],
        10,
        { duration: 1.5 },
      );
    }
  }, [selectedDistrict]);

  // All district markers
  const markers = useMemo(() => {
    return districts
      .filter(
        (item) =>
          typeof item.latitude === "number" &&
          typeof item.longitude === "number",
      )
      .map((item) => (
        <Marker key={item.district} position={[item.latitude, item.longitude]}>
          <Popup>
            <div className="space-y-1">
              <h3 className="font-bold text-lg">{item.district}</h3>
              <p>
                <strong>Region:</strong> {item.region}
              </p>
              <p>
                <strong>City:</strong> {item.city}
              </p>
              <p>
                <strong>Covered Areas:</strong>{" "}
                {Array.isArray(item.covered_area)
                  ? item.covered_area.join(", ")
                  : "No area data"}
              </p>
              <p className="text-green-600 font-semibold">
                Status: {item.status}
              </p>
            </div>
          </Popup>
        </Marker>
      ));
  }, []);

  return (
    <div className="bg-white rounded-2xl max-w-7xl mx-auto px-6 py-16">
      {/* 🔍 Search */}
      <div className="relative max-w-xl mb-10 z-50">
        <DistrictSearch
          districts={districts}
          onSelectDistrict={setSelectedDistrict}
        />
      </div>

      {/* 🗺 Map */}
      <div className="h-125 rounded-2xl overflow-hidden shadow-lg relative z-0">
        <MapContainer
          center={bangladeshPosition}
          zoom={7}
          ref={mapRef}
          className="h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {markers}
        </MapContainer>
      </div>
    </div>
  );
};

export default Coverage;
