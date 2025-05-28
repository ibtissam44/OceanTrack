import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  GridView as DashboardIcon,
  AccountCircle as ProfileIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  TravelExplore as ZonesIcon,
  NotificationsNone as AlertsIcon,
  Science as SpeciesIcon,
  CloudOutlined as WeatherIcon,
  MapOutlined as MapIcon,
  BarChart as ReportsIcon,
  PeopleOutline as UsersIcon,
  Explore as ExploreIcon
} from '@mui/icons-material';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    setActiveItem(path);
  }, [location]);

  const [activeItem, setActiveItem] = useState('dashboard');

  const handleItemClick = (item) => {
    setActiveItem(item);
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleLogoutClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
    setShowConfirmation(false);
  };

  const handleCancelLogout = () => {
    setShowConfirmation(false);
  };

  const menuItems = [
    { path: "/dashboard", icon: <DashboardIcon className="text-lg" />, label: "Tableau de bord", name: "dashboard" },
    { path: "/profile", icon: <ProfileIcon className="text-lg" />, label: "Profil", name: "profile" },
    { path: "/zones", icon: <ZonesIcon className="text-lg" />, label: "Zones", name: "zones" },
    { path: "/species", icon: <SpeciesIcon className="text-lg" />, label: "Espèces", name: "species" },
    { path: "/alerts", icon: <AlertsIcon className="text-lg" />, label: "Alertes", name: "alerts" },
    { path: "/weather", icon: <WeatherIcon className="text-lg" />, label: "Météo", name: "weather" },
    { path: "/map", icon: <MapIcon className="text-lg" />, label: "Carte", name: "map" },
    { path: "/reports", icon: <ReportsIcon className="text-lg" />, label: "Rapports", name: "reports" },
    
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <button
        className="fixed top-4 left-4 bg-sky-500 text-white p-2 rounded-md z-30 md:hidden shadow-lg hover:bg-sky-600 transition-colors"
        onClick={toggleSidebar}
      >
        <MenuIcon className="text-lg" />
      </button>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <LogoutIcon className="text-red-500 text-2xl" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Confirmer la déconnexion</h3>
            <p className="text-gray-600 text-center mb-6">Êtes-vous sûr de vouloir vous déconnecter de votre compte?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCancelLogout}
                className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-5 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium shadow-red-200 shadow-md hover:shadow-lg"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`fixed md:relative z-20 h-full ${collapsed ? 'w-16' : 'w-64'} bg-gradient-to-b from-sky-600 to-sky-700 text-white transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shadow-xl flex flex-col`}>

        <div className="flex items-center justify-between p-4 border-b border-sky-500">
          {!collapsed && (
            <div className="flex items-center">
              <ExploreIcon className="text-2xl text-white mr-2" />
              <h1 className="text-xl font-bold text-white">OceanTrack</h1>
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className={`p-2 rounded-full hover:bg-sky-500 transition-colors duration-200 ${collapsed ? 'mx-auto' : ''}`}
            aria-label={collapsed ? "Agrandir le menu" : "Réduire le menu"}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
        </div>

        <div className="py-4 flex-1 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center py-3 px-3 rounded-lg transition-all duration-200 group
                    ${activeItem === item.name
                      ? 'bg-white/20 text-white'
                      : 'hover:bg-white/10'}`}
                  onClick={() => handleItemClick(item.name)}
                  title={collapsed ? item.label : ""}
                >
                  <div className={`
                    ${collapsed ? 'mx-auto' : 'mr-3'}
                    flex items-center justify-center w-8 h-8 rounded-lg transition-colors
                    ${activeItem === item.name
                      ? 'bg-white text-sky-600'
                      : 'bg-sky-500/30 text-white group-hover:bg-white/10'}
                  `}>
                    {item.icon}
                  </div>
                  {!collapsed && (
                    <span className="text-sm font-medium transition-all duration-200">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={`p-4 border-t border-sky-500 ${collapsed ? 'text-center' : ''}`}>
          <button
            className={`flex items-center ${collapsed ? 'justify-center w-full' : ''} py-2 px-3 rounded-lg hover:bg-red-500/10 transition-colors duration-200 group`}
            title={collapsed ? "Se déconnecter" : ""}
            onClick={handleLogoutClick}
          >
            <div className={`
              ${collapsed ? 'mx-auto' : 'mr-3'}
              flex items-center justify-center w-8 h-8 rounded-lg transition-colors
              bg-red-500/10 text-red-400 group-hover:bg-red-500/20
            `}>
              <LogoutIcon className="text-lg" />
            </div>
            {!collapsed && (
              <span className="text-sm font-medium text-red-400 group-hover:text-red-300">
                Se déconnecter
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;