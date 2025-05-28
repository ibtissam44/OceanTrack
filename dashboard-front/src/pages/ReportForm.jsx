import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const API_URL = "http://localhost:8000/api/reports";

// Création d'icônes personnalisées pour différents types de rapports
const reportIcons = {
  "Danger": new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  "Pollution": new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  "Bateau inconnu": new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  "Animal marin dangereux": new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
};

const defaultIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ReportForm = () => {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    latitude: null,
    longitude: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setIsLoading(false);
      },
      (err) => {
        setError("Impossible de récupérer votre position");
        setIsLoading(false);
        // Valeurs par défaut pour le Maroc si l'obtention de la position échoue
        setFormData((prev) => ({
          ...prev,
          latitude: 33.5731,
          longitude: -7.5898,
        }));
      }
    );
  }, []);

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        setFormData((prev) => ({
          ...prev,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        }));
      },
    });
    return null;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.type || !formData.description || !formData.latitude) {
      setError("Veuillez compléter tous les champs requis");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: formData.type,
          description: formData.description,
          latitude: formData.latitude,
          longitude: formData.longitude,
        }),
      });

      if (!response.ok) {
        throw new Error("Échec de l'envoi du rapport");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/rapportstatic");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getReportIcon = (type) => {
    const icons = {
      "Danger": "⚠️",
      "Pollution": "🛢️",
      "Bateau inconnu": "⛵",
      "Animal marin dangereux": "🦈"
    };
    return icons[type] || "📌";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Système de signalement des incidents côtiers
          </h1>
          <p className="text-gray-600 mt-2 md:mt-3 text-sm md:text-base">
            Aidez-nous à maintenir la sécurité de nos côtes en signalant tout incident ou danger
          </p>
        </div>

        {/* Message de succès */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-fade-in">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-green-500">✓</span>
              <span className="text-green-700 font-medium">Le rapport a été envoyé avec succès, redirection en cours...</span>
            </div>
          </div>
        )}

        {/* Affichage des erreurs */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-red-500">✕</span>
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Contenu principal - Disposition côte à côte */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Section Carte - Côté gauche */}
          <div className="lg:w-1/2 bg-white rounded-2xl shadow-xl border border-blue-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              <h2 className="text-lg font-semibold text-center flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Sélectionnez l'emplacement du rapport sur la carte
              </h2>
            </div>

            <div className="h-80 md:h-[500px] relative">
              {isLoading && !formData.latitude && (
                <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
                  <div className="text-blue-600 flex flex-col items-center space-y-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
                    <span className="font-medium">Détermination de votre position actuelle...</span>
                  </div>
                </div>
              )}

              <MapContainer
                center={[formData.latitude || 33.5731, formData.longitude || -7.5898]}
                zoom={formData.latitude ? 13 : 6}
                className="h-full z-0"
                scrollWheelZoom={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution=''
                />
                <LocationPicker />
                {formData.latitude && formData.longitude && (
                  <Marker
                    position={[formData.latitude, formData.longitude]}
                    icon={formData.type ? reportIcons[formData.type] || defaultIcon : defaultIcon}
                  />
                )}
              </MapContainer>
            </div>

            <div className="p-4 bg-gray-50 border-t flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-2 mb-2 md:mb-0">
                {formData.latitude && formData.longitude ? (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-sm text-gray-600">Position déterminée</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                    <span className="text-sm text-gray-600">Détermination de la position</span>
                  </>
                )}
              </div>

              {formData.latitude && formData.longitude && (
                <div className="flex items-center space-x-4">
                  <div className="font-mono text-xs md:text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    <span className="font-semibold">Lat:</span> {formData.latitude.toFixed(4)}
                  </div>
                  <div className="font-mono text-xs md:text-sm text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">
                    <span className="font-semibold">Long:</span> {formData.longitude.toFixed(4)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section Formulaire - Côté droit */}
          <div className="lg:w-1/2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-blue-200 p-6 h-full transition-all duration-300 hover:shadow-2xl">
              <div className="space-y-6">
                {/* Sélection du type de rapport */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    <span className="text-blue-600 font-semibold">*</span> Type de rapport
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Danger", "Pollution", "Bateau inconnu", "Animal marin dangereux"].map((type) => (
                      <div key={type} className="col-span-1">
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, type})}
                          className="w-full focus:outline-none"
                        >
                          <div className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            formData.type === type
                              ? "border-blue-500 bg-blue-50 shadow-md"
                              : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                          }`}>
                            <span className="font-medium text-gray-800">{type}</span>
                            <span className="text-xl">{getReportIcon(type)}</span>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Champ de description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    <span className="text-blue-600 font-semibold">*</span> Description du rapport
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={8}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                    placeholder="Veuillez fournir une description détaillée de l'incident ou du danger que vous souhaitez signaler..."
                  ></textarea>
                  <p className="mt-1 text-xs text-gray-500 text-left">Veuillez fournir autant de détails que possible</p>
                </div>

                {/* Bouton de soumission */}
                <button
                  type="submit"
                  disabled={isLoading || !formData.type || !formData.description || !formData.latitude}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center ${
                    isLoading || !formData.type || !formData.description || !formData.latitude
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-1'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                      </svg>
                      Envoyer le rapport
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Note de pied de page */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Tous les rapports sont traités de manière strictement confidentielle et seront répondus dans les plus brefs délais</p>
          <p className="mt-1">© 2023 Ministère de l'Environnement et du Développement Durable</p>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;
