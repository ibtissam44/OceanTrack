import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FiAlertTriangle, FiCheckCircle, FiClock, FiFilter, FiMap, FiMapPin, FiSearch } from "react-icons/fi";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Initialisation des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const statusColors = {
  ouvert: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  open: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  fermé: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  closed: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  default: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" }
};

const typeIcons = {
  emergency: <FiAlertTriangle className="text-red-500" />,
  pollution: <FiAlertTriangle className="text-yellow-500" />,
  accident: <FiAlertTriangle className="text-orange-500" />,
  default: <FiMapPin className="text-cyan-600" />
};

const MarineReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [openMapId, setOpenMapId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/reports")
      .then((response) => response.json())
      .then((data) => {
        const reportsData = Array.isArray(data) ? data : data.reports || [];
        setReports(reportsData.map(report => ({
          ...report,
          createdAt: report.createdAt ? new Date(report.createdAt) : new Date()
        })));
      })
      .catch((err) => {
        console.error("Échec du chargement des données", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const toggleMap = (id) => {
    setOpenMapId((prev) => (prev === id ? null : id));
  };

  const filteredReports = reports.filter(report => {
    if (filter !== "all" && report.status?.toLowerCase() !== filter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (report.type?.toLowerCase().includes(query)) ||
        (report.description?.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const getReportTypeIcon = (type) => {
    if (!type) return typeIcons.default;
    const lowerType = type.toLowerCase();
    if (lowerType.includes("emergency")) return typeIcons.emergency;
    if (lowerType.includes("pollution")) return typeIcons.pollution;
    if (lowerType.includes("accident")) return typeIcons.accident;
    return typeIcons.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 text-lg">Chargement des rapports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <header className="bg-gradient-to-r from-cyan-600 to-cyan-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold">Système de rapports maritimes</h1>
          <p className="mt-2 opacity-90">Gestion et suivi des rapports maritimes de manière efficace</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section des filtres */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un rapport..."
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter("all")}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "all"
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FiFilter className="ml-2" />
                Tous les rapports
              </button>
              <button
                onClick={() => setFilter("ouvert")}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "ouvert"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Ouverts
              </button>
              <button
                onClick={() => setFilter("fermé")}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "fermé"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Fermés
              </button>
            </div>
          </div>
        </div>

        {/* Liste des rapports */}
        <div className="space-y-6">
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiSearch className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun rapport trouvé</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchQuery
                  ? "Aucun rapport ne correspond à votre recherche. Essayez de changer les mots-clés."
                  : "Aucun rapport ne correspond au filtre sélectionné."}
              </p>
            </div>
          ) : (
            filteredReports.map((report) => {
              const status = report.status?.toLowerCase();
              const statusStyle = statusColors[status] || statusColors.default;

              return (
                <div
                  key={report.id}
                  className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md ${statusStyle.border}`}
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Icône du rapport */}
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-lg bg-cyan-50 flex items-center justify-center">
                          {getReportTypeIcon(report.type)}
                        </div>
                      </div>

                      {/* Contenu du rapport */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                          <h3 className={`text-xl font-semibold ${statusStyle.text}`}>
                            {report.type || "Type de rapport non spécifié"}
                          </h3>
                          <span className={`capitalize px-3 py-1 rounded-full text-sm font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                            {report.status || "Inconnu"}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{report.description || "Aucune description."}</p>
                        <p className="text-gray-500 text-sm">
                          Rapporté le:{" "}
                          {report.createdAt
                            ? format(new Date(report.createdAt), "d MMMM yyyy, HH:mm", { locale: fr })
                            : "-"}
                        </p>

                        {/* Bouton pour afficher la carte */}
                        {(report.latitude && report.longitude) && (
                          <button
                            onClick={() => toggleMap(report.id)}
                            className="mt-4 inline-flex items-center gap-2 text-cyan-600 hover:underline font-semibold"
                          >
                            <FiMap />
                            {openMapId === report.id ? "Masquer la carte" : "Afficher la carte"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Carte */}
                    {openMapId === report.id && report.latitude && report.longitude && (
                      <div className="mt-6 h-64 rounded-lg overflow-hidden">
                        <MapContainer
                          center={[report.latitude, report.longitude]}
                          zoom={13}
                          scrollWheelZoom={false}
                          style={{ height: "100%", width: "100%" }}
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker position={[report.latitude, report.longitude]}>
                            <Popup>{report.type}</Popup>
                          </Marker>
                        </MapContainer>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default MarineReportsPage;
