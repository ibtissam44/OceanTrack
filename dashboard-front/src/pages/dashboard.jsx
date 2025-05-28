import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import L from "leaflet";


import {
  ShieldCheck,
  ShieldX,
  Bell,
  Compass,
  BarChart3,
  Anchor,
  CloudSun,
  ShieldAlert
} from "lucide-react";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

export default function Dashboard() {
  const [stats, setStats] = useState({
    allowedZones: 0,
    forbiddenZones: 0,
    activeAlerts: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [weatherDescription, setWeatherDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartRes, weatherRes, zonesRes] = await Promise.all([
          axios.get("http://localhost:8000/api/dashboard-stats"),
          axios.get("http://localhost:8000/api/chart-data"),
          axios.get("http://localhost:8000/api/weather-summary"),
          axios.get("http://localhost:8000/api/zones")
        ]);

        setStats(statsRes.data);
        setChartData(chartRes.data);
        setWeatherDescription(weatherRes.data.summary);
        setZones(zonesRes.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-1/4 mb-4" />
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Allowed Zones Card */}
      <Card className="border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-medium text-gray-600">Zones Autorisées</h2>
              </div>
              <p className="text-3xl font-bold text-emerald-600">{stats.allowedZones}</p>
              <p className="text-sm text-emerald-500 mt-1">Zones de pêche sûres</p>
            </div>
            <div className="bg-emerald-100/50 p-3 rounded-lg">
              <Compass className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forbidden Zones Card */}
      <Card className="border border-rose-100 bg-gradient-to-br from-rose-50 to-white hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldX className="w-5 h-5 text-rose-600" />
                <h2 className="text-lg font-medium text-gray-600">Zones Interdites</h2>
              </div>
              <p className="text-3xl font-bold text-rose-600">{stats.forbiddenZones}</p>
              <p className="text-sm text-rose-500 mt-1">Pêche non autorisée</p>
            </div>
            <div className="bg-rose-100/50 p-3 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-rose-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts Card */}
      <Card className="border border-amber-100 bg-gradient-to-br from-amber-50 to-white hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-medium text-gray-600">Alertes Actives</h2>
              </div>
              <p className="text-3xl font-bold text-amber-600">{stats.activeAlerts}</p>
              <p className="text-sm text-amber-500 mt-1">Nécessitent une attention</p>
            </div>
            <div className="bg-amber-100/50 p-3 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marine Map Section */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <Card className="shadow-sm border border-gray-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Anchor className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-xl font-semibold text-gray-800">État de la Mer</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96 rounded-lg overflow-hidden border border-gray-200 shadow-inner">
              <MapContainer
                center={[35.6895, -0.9]}
                zoom={6}
                className="h-full w-full"
                scrollWheelZoom={false}
                whenCreated={mapInstance => { mapRef.current = mapInstance; }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {zones.map((zone, index) => (
                  <Marker
                    key={index}
                    position={[zone.latitude, zone.longitude]}
                    icon={zone.type === 'allowed' ? undefined : redIcon}
                  >
                    <Popup>
                      <div>
                        <h3 className="font-medium">{zone.name}</h3>
                        <p>Type: {zone.type === 'allowed' ? 'Autorisée' : 'Interdite'}</p>
                        <p>Danger: {zone.danger}</p>
                        <p>Durée: {zone.duration}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            {weatherDescription && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <CloudSun className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-blue-700">Rapport Météorologique:</h3>
                </div>
                <p className="text-gray-700">{weatherDescription}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <Card className="shadow-sm border border-gray-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-xl font-semibold text-gray-800">Évolution des Activités</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}