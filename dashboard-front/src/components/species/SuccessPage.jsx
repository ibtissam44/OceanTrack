import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Database,
  CheckCircle,
  AlertOctagon,
  Award,
  Clock,
  Layers,
  TrendingUp,
  Activity,
  Waves
} from "lucide-react";

// Définition des couleurs pour les cartes statistiques
const COLORS = ["#3B82F6", "#10B981", "#EF4444", "#F59E0B", "#8B5CF6", "#06B6D4"];

// Mappage des icônes pour chaque type de carte
const iconMap = {
  total: <Database size={28} className="text-blue-600" />,
  available: <CheckCircle size={28} className="text-green-600" />,
  fishing_banned: <AlertOctagon size={28} className="text-red-600" />,
  rare: <Award size={28} className="text-amber-500" />,
  in_biological_rest: <Clock size={28} className="text-purple-600" />,
  totalQuantity: <Layers size={28} className="text-cyan-600" />,
};

export default function SpeciesDashboard() {
  const [data, setData] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);


  useEffect(() => {
    axios
      .get("http://localhost:8000/api/species/statistics")
      .then((res) => {
        const fixedData = {
          ...res.data,
          quantityByType: res.data.quantityByType.map((item) => ({
            ...item,
            quantity: Number(item.quantity),
          })),
          totalQuantity: Number(res.data.totalQuantity),
        };
        setData(fixedData);
      })
      .catch((e) => console.error(e));
  }, []);

  // Affichage du chargement
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex justify-center items-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
            <Waves className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-800 animate-pulse">Chargement en cours...</p>
            <p className="text-gray-600">Préparation des données des espèces marines</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-100 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 p-8 space-y-12 font-sans max-w-7xl mx-auto">
        {/* En-tête amélioré */}
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full shadow-lg">
              <Activity className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
            d'analyse des espèces marines
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Plateforme complète pour surveiller et analyser la biodiversité marine et gérer les ressources halieutiques
          </p>
        </div>

        {/* Cartes statistiques améliorées */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { key: "total", label: "Total des espèces", color: COLORS[0] },
            { key: "available", label: "Disponible à la pêche", color: COLORS[1] },
            { key: "fishing_banned", label: "Pêche interdite", color: COLORS[2] },
            { key: "rare", label: "Espèces rares", color: COLORS[3] },
            { key: "in_biological_rest", label: "En repos biologique", color: COLORS[4] },
            { key: "totalQuantity", label: "Quantité totale", color: COLORS[5] },
          ].map(({ key, label, color }, idx) => (
            <StatCard
              key={key}
              title={label}
              value={data[key]}
              color={color}
              icon={iconMap[key]}
              isHovered={hoveredCard === key}
              onHover={() => setHoveredCard(key)}
              onLeave={() => setHoveredCard(null)}
              index={idx}
            />
          ))}
        </div>

        {/* Section graphique améliorée */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-wide">
                  Répartition de la quantité par type
                </h2>
                <p className="text-gray-600 mt-1">Analyse détaillée de la répartition des espèces marines</p>
              </div>
            </div>
            <div style={{ height: 450 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.quantityByType}
                  margin={{ top: 30, right: 30, left: 20, bottom: 60 }}
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.7} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#374151", fontWeight: "600", fontSize: 12 }}
                    axisLine={{ stroke: "#D1D5DB", strokeWidth: 1 }}
                    tickLine={false}
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    tick={{ fill: "#374151", fontWeight: "600", fontSize: 12 }}
                    axisLine={{ stroke: "#D1D5DB", strokeWidth: 1 }}
                    tickLine={false}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #E5E7EB",
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                      backdropFilter: "blur(10px)",
                    }}
                    formatter={(value) => [`${value.toLocaleString()}`, "Quantité"]}
                    labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                  />
                  <Legend
                    wrapperStyle={{ fontWeight: "600", fontSize: 14, color: "#374151", paddingTop: "20px" }}
                  />
                  <Bar
                    dataKey="quantity"
                    fill="url(#barGradient)"
                    radius={[8, 8, 0, 0]}
                    barSize={32}
                    cursor="pointer"
                    animationDuration={1200}
                    animationBegin={0}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Tableau des espèces récentes amélioré */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl">
                  <Layers className="text-green-600" size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 tracking-wide">Espèces récemment ajoutées</h2>
                  <p className="text-gray-600 mt-1">Dernières mises à jour dans la base de données</p>
                </div>
              </div>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {data.recentSpecies.length} nouvelles espèces
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="p-6 font-bold text-gray-800 text-lg border-b border-gray-200">Nom</th>
                      <th className="p-6 font-bold text-gray-800 text-lg border-b border-gray-200">Quantité</th>
                      <th className="p-6 font-bold text-gray-800 text-lg border-b border-gray-200">Statut</th>
                      <th className="p-6 font-bold text-gray-800 text-lg border-b border-gray-200">Date d'ajout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentSpecies.map((species, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 group border-b border-gray-100 last:border-b-0"
                      >
                        <td className="p-6 font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                          {species.name}
                        </td>
                        <td className="p-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800">
                            {species.quantity.toLocaleString()}
                          </span>
                        </td>
                        <td className="p-6">
                          <StatusBadge status={species.status} />
                        </td>
                        <td className="p-6 text-gray-600 font-mono text-sm">
                          {new Date(species.created_at).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Composant pour les cartes statistiques
function StatCard({ title, value, color, icon, isHovered, onHover, onLeave, index }) {
  return (
    <div
      className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 flex items-center space-x-5 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 transform ${
        isHovered ? 'scale-105 shadow-2xl' : ''
      }`}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.8s ease-out forwards'
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      dir="ltr"
    >
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"
           style={{ background: `linear-gradient(135deg, ${color}40, ${color}20)` }}></div>

      <div
        className={`relative z-10 p-4 rounded-xl flex justify-center items-center transition-all duration-300 group-hover:scale-110 ${
          isHovered ? 'scale-110' : ''
        }`}
        style={{
          backgroundColor: `${color}15`,
          boxShadow: isHovered ? `0 8px 25px ${color}30` : 'none'
        }}
      >
        {icon}
      </div>
      <div className="relative z-10 flex flex-col items-start space-y-1">
        <h3 className="text-sm font-semibold text-gray-600 group-hover:text-gray-800 transition-colors">
          {title}
        </h3>
        <p className="text-3xl font-extrabold text-gray-900 tracking-tight group-hover:text-gray-800 transition-colors">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>

      <div className="absolute top-2 right-2 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
           style={{ backgroundColor: color }}></div>
    </div>
  );
}

// Composant pour les badges de statut
function StatusBadge({ status }) {
  const statusConfig = {
    available: {
      bg: "bg-gradient-to-r from-green-100 to-green-200",
      text: "text-green-800",
      label: "Disponible à la pêche",
      icon: <CheckCircle size={14} />
    },
    fishing_banned: {
      bg: "bg-gradient-to-r from-red-100 to-red-200",
      text: "text-red-800",
      label: "Pêche interdite",
      icon: <AlertOctagon size={14} />
    },
    rare: {
      bg: "bg-gradient-to-r from-amber-100 to-amber-200",
      text: "text-amber-800",
      label: "Rare",
      icon: <Award size={14} />
    },
    in_biological_rest: {
      bg: "bg-gradient-to-r from-purple-100 to-purple-200",
      text: "text-purple-800",
      label: "Repos biologique",
      icon: <Clock size={14} />
    }
  };

  const config = statusConfig[status] || statusConfig.available;

  return (
    <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 hover:shadow-md ${config.bg} ${config.text}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}

// Ajout des styles d'animation fadeInUp
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
