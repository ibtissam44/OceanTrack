import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaAnchor, FaFish, FaBan, FaMapMarkerAlt, FaCalendarAlt, FaRulerCombined, FaFilter, FaTimes } from "react-icons/fa";
import axios from "axios";

// Configuration des icônes Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const createCustomIcon = (color = 'blue') => {
  return new L.DivIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
        border: 2px solid white;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM8.5 4.5v.634l.549-.317a.5.5 0 1 1 .5.866L9 6l.549.317a.5.5 0 1 1-.5.866L8.5 6.866V7.5a.5.5 0 0 1-1 0v-.634l-.549.317a.5.5 0 1 1-.5-.866L7 6l-.549-.317a.5.5 0 0 1 .5-.866l.549.317V4.5a.5.5 0 1 1 1 0zM5.5 9h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zm0 2h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1z"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

export default function FishingZonesDashboard() {
  const [zones, setZones] = useState([]);
  const [filteredZones, setFilteredZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeZone, setActiveZone] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/zones");
        setZones(response.data);
        setFilteredZones(response.data);
      } catch (err) {
        setError("فشل في تحميل بيانات المناطق");
        console.error("Error fetching zones:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchZones();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, zones]);

  const applyFilters = () => {
    let result = [...zones];
    
    if (filters.status !== 'all') {
      result = result.filter(zone => zone.status === filters.status);
    }
    
    if (filters.type !== 'all') {
      result = result.filter(zone => zone.type === filters.type);
    }
    
    setFilteredZones(result);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      type: 'all'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-800">جاري تحميل بيانات المناطق...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
          <p className="font-bold">خطأ</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-4 md:p-8">
      <header className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">
          <FaFish className="inline mr-2 text-blue-600" />
          نظام مراقبة مناطق الصيد البحري
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          معلومات محدثة عن مناطق الصيد المسموحة والممنوعة في المياه الإقليمية
        </p>
      </header>

      <div className="mb-8 flex justify-between items-center">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all"
        >
          <FaFilter />
          {showFilters ? 'إخفاء الفلتر' : 'عرض الفلتر'}
        </button>
        
        {showFilters && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label>الحالة:</label>
              <select 
                name="status" 
                value={filters.status}
                onChange={handleFilterChange}
                className="border rounded px-2 py-1"
              >
                <option value="all">الكل</option>
                <option value="allowed">مسموح</option>
                <option value="forbidden">ممنوع</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label>النوع:</label>
              <select 
                name="type" 
                value={filters.type}
                onChange={handleFilterChange}
                className="border rounded px-2 py-1"
              >
                <option value="all">الكل</option>
                <option value="coastal">ساحلي</option>
                <option value="deep">بعيد</option>
              </select>
            </div>
            
            <button 
              onClick={resetFilters}
              className="flex items-center gap-1 text-red-500 hover:text-red-700"
            >
              <FaTimes />
              إعادة تعيين
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredZones.map((zone) => (
          <div 
            key={zone.id}
            className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${activeZone?.id === zone.id ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setActiveZone(zone)}
          >
            {/* Mini Carte intégrée */}
            <div className="h-48 relative">
              <MapContainer 
                center={[parseFloat(zone.latitude), parseFloat(zone.longitude)]} 
                zoom={9} 
                scrollWheelZoom={false}
                dragging={false}
                doubleClickZoom={false}
                touchZoom={false}
                zoomControl={false}
                style={{ height: "100%", width: "100%", borderRadius: "0.5rem 0.5rem 0 0" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker 
                  position={[parseFloat(zone.latitude), parseFloat(zone.longitude)]}
                  icon={zone.status === "allowed" ? 
                    createCustomIcon('#2ecc71') : 
                    createCustomIcon('#e74c3c')}
                >
                  <Popup>{zone.name}</Popup>
                </Marker>
              </MapContainer>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blue-900">{zone.name}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    zone.status === "allowed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {zone.status === "allowed" ? "مسموح" : "ممنوع"}
                </span>
              </div>

              {zone.status === "forbidden" && (
                <div className="bg-red-50 p-3 rounded-lg mb-4 border-l-4 border-red-500">
                  <p className="text-red-700 flex items-start">
                    <FaBan className="mt-1 mr-2 flex-shrink-0 text-red-600" />
                    <span className="font-medium">السبب: {zone.reason}</span>
                  </p>
                </div>
              )}

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-blue-400" />
                    الإحداثيات:
                  </span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {parseFloat(zone.latitude).toFixed(4)}, {parseFloat(zone.longitude).toFixed(4)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center">
                    <FaRulerCombined className="mr-2 text-blue-500" />
                    المساحة:
                  </span>
                  <span className="font-medium">{zone.area} كم²</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 flex items-center">
                    <FaCalendarAlt className="mr-2 text-blue-400" />
                    آخر تحديث:
                  </span>
                  <span className="font-medium">
                    {new Date(zone.updatedAt).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-16 text-center text-gray-500 pb-8">
        <div className="max-w-4xl mx-auto border-t border-gray-200 pt-8">
          <p className="text-sm">© {new Date().getFullYear()} وزارة الفلاحة والصيد البحري - جميع الحقوق محفوظة</p>
          <p className="mt-2 text-sm">
            للاستفسارات: contact@fishing.gov.ma | الهاتف: 0522999999
          </p>
        </div>
      </footer>
    </div>
  );
}