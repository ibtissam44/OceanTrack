import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, AlertTriangle, Bell, Info, RefreshCw, Search, Tag, Shield, Calendar } from 'lucide-react';

const AlertCard = ({ alert, onDelete }) => {
  const getAlertIcon = () => {
    switch(alert.type) {
      case 'warning': return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'notice': return <Bell className="h-6 w-6 text-yellow-500" />;
      default: return <Info className="h-6 w-6 text-blue-600" />;
    }
  };

  const getStatusColor = () => {
    return alert.status === 'active' 
      ? 'bg-emerald-200 text-emerald-900 border border-emerald-400' 
      : 'bg-gray-200 text-gray-800 border border-gray-400';
  };

  const getCardStyle = () => {
    switch(alert.type) {
      case 'warning': return 'border-l-8 border-red-600 bg-red-50 hover:bg-red-100 transition-colors';
      case 'notice': return 'border-l-8 border-yellow-500 bg-yellow-50 hover:bg-yellow-100 transition-colors';
      default: return 'border-l-8 border-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors';
    }
  };

  return (
    <div className={`rounded-xl shadow-md overflow-hidden ${getCardStyle()}`}>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-white shadow-md">
              {getAlertIcon()}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{alert.title}</h3>
              <p className="text-sm text-gray-700 mt-1 line-clamp-2">{alert.description || 'Aucune description'}</p>
            </div>
          </div>
          <button 
            onClick={() => onDelete(alert.id)} 
            className="text-red-600 hover:text-red-800 p-3 rounded-full hover:bg-red-100 transition-colors"
            aria-label="Supprimer"
          >
            <Trash2 size={20} />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-semibold">
          <span className={`px-4 py-1.5 rounded-full ${getStatusColor()}`}>
            {alert.status === 'active' ? 'Actif' : 'Inactif'}
          </span>
          
          {alert.start_date && alert.end_date && (
            <span className="text-gray-700 flex items-center gap-1 bg-gray-100 px-4 py-1.5 rounded-full border border-gray-300">
              <Calendar size={14} />
              {new Date(alert.start_date).toLocaleDateString()} → {new Date(alert.end_date).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8000/api/alerts');
      setAlerts(response.data.data || []);
    } catch (err) {
      console.error('Error fetching alerts', err);
      setError('Échec du chargement des alertes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
      try {
        await axios.delete(`http://localhost:8000/api/alerts/${id}`);
        setAlerts(alerts.filter(a => a.id !== id));
      } catch (err) {
        console.error('Failed to delete alert', err);
        alert('Échec de la suppression');
      }
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alert.description && alert.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && alert.status === 'active';
    if (filter === 'inactive') return matchesSearch && alert.status !== 'active';
    if (filter === 'warning') return matchesSearch && alert.type === 'warning';
    if (filter === 'notice') return matchesSearch && alert.type === 'notice';
    if (filter === 'info') return matchesSearch && alert.type === 'info';
    
    return matchesSearch;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <Shield className="text-indigo-600" />
              Gestion des Alertes
            </h1>
            
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Rechercher des alertes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400"
              />
              <Search className="absolute left-4 top-3.5 text-gray-400 h-5 w-5 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button 
              onClick={() => setFilter('all')} 
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                filter === 'all' 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <Tag size={16} />
                Toutes
              </span>
            </button>
            
            <button 
              onClick={() => setFilter('active')} 
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                filter === 'active' 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <Shield size={16} />
                Actives
              </span>
            </button>
            
            <button 
              onClick={() => setFilter('warning')} 
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                filter === 'warning' 
                  ? 'bg-red-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-700 hover:bg-red-100 hover:text-red-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <AlertTriangle size={16} />
                Avertissements
              </span>
            </button>
            
            <button 
              onClick={() => setFilter('notice')} 
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                filter === 'notice' 
                  ? 'bg-yellow-500 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-700 hover:bg-yellow-100 hover:text-yellow-600'
              }`}
            >
              <span className="flex items-center gap-2">
                <Bell size={16} />
                Notifications
              </span>
            </button>
            
            <button 
              onClick={() => setFilter('inactive')} 
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                filter === 'inactive' 
                  ? 'bg-gray-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900'
              }`}
            >
              Inactives
            </button>

            <button
              onClick={fetchAlerts}
              title="Rafraîchir"
              className="ml-auto bg-gray-300 hover:bg-gray-400 p-3 rounded-xl transition-colors shadow-md"
            >
              <RefreshCw size={20} />
            </button>
          </div>

          {loading && (
            <div className="text-center py-10 text-gray-600 select-none font-semibold">Chargement des alertes...</div>
          )}

          {error && (
            <div className="text-center py-10 text-red-700 select-none font-semibold">{error}</div>
          )}

          {!loading && !error && filteredAlerts.length === 0 && (
            <div className="text-center py-10 text-gray-500 select-none font-semibold">Aucune alerte trouvée.</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAlerts.map(alert => (
              <AlertCard 
                key={alert.id} 
                alert={alert} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
