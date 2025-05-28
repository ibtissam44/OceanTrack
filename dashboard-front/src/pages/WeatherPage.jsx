import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  WiDaySunny, WiStrongWind, WiRain, WiDayCloudy,
  WiDirectionUp, WiCloudy, WiDaySunnyOvercast
} from 'react-icons/wi';
import {
  MdLocationOn, MdWarning, MdRefresh, MdInfo
} from 'react-icons/md';
import { FaWater, FaWind, FaShip, FaCompass } from 'react-icons/fa';
import { BsThermometer, BsDroplet, BsClock } from 'react-icons/bs';
import { motion } from 'framer-motion';

// Création d'icônes personnalisées pour les cartes
const createCustomIcon = (danger) => {
  return new L.Icon({
    iconUrl: danger ?
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png' :
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
  });
};

const MarineWeatherReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeReport, setActiveReport] = useState(null);
  const [mapCenter, setMapCenter] = useState([24.7136, 46.6753]); // Centre de la carte par défaut (Riyad)

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/marine-weather-reports')
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors de la récupération des données');
        return res.json();
      })
      .then((data) => {
        const reportsData = Array.isArray(data) ? data : [data];
        setReports(reportsData);
        if (reportsData.length > 0) {
          setActiveReport(reportsData[0]);
          // Mise à jour du centre de la carte pour le premier emplacement
          if (reportsData[0].latitude && reportsData[0].longitude) {
            setMapCenter([parseFloat(reportsData[0].latitude), parseFloat(reportsData[0].longitude)]);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const getWeatherIcon = (condition) => {
    if (!condition) return <WiDayCloudy className="text-gray-400 text-3xl" />;
    const cond = condition.toLowerCase();
    if (cond.includes('ensoleillé')) return <WiDaySunny className="text-yellow-500 text-3xl" />;
    if (cond.includes('pluie')) return <WiRain className="text-blue-500 text-3xl" />;
    if (cond.includes('vent') || cond.includes('orage')) return <WiStrongWind className="text-gray-500 text-3xl" />;
    if (cond.includes('nuageux')) return <WiCloudy className="text-gray-400 text-3xl" />;
    return <WiDaySunnyOvercast className="text-gray-300 text-3xl" />;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mb-8"
      >
        <FaShip className="text-6xl text-blue-500" />
      </motion.div>
      <motion.h2 className="text-2xl font-bold text-gray-800 mb-2">
        Chargement des données météo marines
      </motion.h2>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="bg-red-100 p-6 rounded-full mb-6">
        <MdWarning className="text-5xl text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Une erreur est survenue</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">{error}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={fetchWeatherData}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center shadow-md"
      >
        <MdRefresh className="ml-2" />
        Réessayer
      </motion.button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 sm:p-6">
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="bg-blue-500 p-3 rounded-xl shadow-lg mr-4"
            >
              <FaShip className="text-3xl text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Carte météo marine</h1>
              <p className="text-blue-500 font-medium">Suivez les conditions météo marines sur la carte</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Carte réelle */}
          <div className="h-96 w-full relative">
            <MapContainer
              center={mapCenter}
              zoom={8}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {reports.map((report) => (
                report.latitude && report.longitude && (
                  <Marker
                    key={report.id}
                    position={[parseFloat(report.latitude), parseFloat(report.longitude)]}
                    icon={createCustomIcon(report.wave_danger?.toLowerCase().includes('élevé'))}
                    eventHandlers={{
                      click: () => setActiveReport(report),
                    }}
                  >
                    <Popup>
                      <div className="font-bold">{report.region}</div>
                      <div className="text-sm">{report.condition}</div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          </div>

          {/* Informations sur la région sélectionnée */}
          {activeReport && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white border-t border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <MdLocationOn className="ml-2 text-blue-500" />
                    {activeReport.region || "Région non spécifiée"}
                  </h2>
                  <div className="flex items-center mt-2 text-gray-500">
                    <BsClock className="ml-2" />
                    <span>Dernière mise à jour: {new Date(activeReport.date).toLocaleTimeString('fr-FR')}</span>
                  </div>
                </div>
                {getWeatherIcon(activeReport.condition)}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <div className="text-blue-500 text-2xl mb-2">
                    <BsThermometer />
                  </div>
                  <div className="text-gray-500 text-sm">Température</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {activeReport.temperature || '--'}°C
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <div className="text-blue-500 text-2xl mb-2">
                    <FaWind />
                  </div>
                  <div className="text-gray-500 text-sm">Vitesse du vent</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {activeReport.wind_speed || '--'} km/h
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <div className="text-blue-500 text-2xl mb-2">
                    <FaWater />
                  </div>
                  <div className="text-gray-500 text-sm">Hauteur des vagues</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {activeReport.wave_height || '--'} m
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <div className="text-blue-500 text-2xl mb-2">
                    <BsDroplet />
                  </div>
                  <div className="text-gray-500 text-sm">Précipitations</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {activeReport.rain_probability || '0'}%
                  </div>
                </div>
              </div>

              {activeReport.wave_danger && (
                <div className={`mt-6 p-4 rounded-lg flex items-center justify-between ${
                  activeReport.wave_danger.toLowerCase().includes('élevé') ?
                    'bg-red-100 text-red-800 border-l-4 border-red-500' :
                    'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
                }`}>
                  <div className="flex items-center">
                    <MdWarning className="ml-2 text-xl" />
                    <span className="font-medium">Avertissement vagues:</span>
                  </div>
                  <span className="font-bold">{activeReport.wave_danger}</span>
                </div>
              )}

              {activeReport.latitude && activeReport.longitude && (
                <div className="mt-4 text-sm text-gray-500">
                  <span>Coordonnées: </span>
                  <span className="font-mono">{parseFloat(activeReport.latitude).toFixed(4)}, </span>
                  <span className="font-mono">{parseFloat(activeReport.longitude).toFixed(4)}</span>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>

      <footer className="max-w-6xl mx-auto mt-8 text-center text-gray-500 text-sm">
        <p>Faites glisser la carte pour changer de lieu | Cliquez sur les marqueurs pour plus de détails</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchWeatherData}
          className="mt-4 inline-flex items-center px-4 py-2 bg-white border border-blue-500 text-blue-500 rounded-lg shadow-sm"
        >
          <MdRefresh className="ml-2" />
          Mettre à jour les données
        </motion.button>
      </footer>
    </div>
  );
};

export default MarineWeatherReports;
