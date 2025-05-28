import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './components/common/ThemeContext';

import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import ResetPassword from './pages/resetpassword';
import Dashboard from './pages/dashboard';
import DashboardLayout from './components/layout/DashboardLayout';
import Profile from './pages/profile';
import AddSpecie from './components/species/addS';
import SuccessPage from './components/species/SuccessPage'
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/404';
import AlertsPage from './pages/AlertsPage';
import WeatherPage from './pages/WeatherPage';
import MapPage from './pages/MapPage';
import ReportForm from './pages/ReportForm';
import Rapportstatic from './pages/Rapportstatic'
import Zones from './pages/Zones';
import './index.css';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RedirectHome />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute layout={DashboardLayout} element={<Dashboard />} />
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute layout={DashboardLayout} element={<Profile />} />
            }
          />

          <Route
  path="/zones"
  element={
    <PrivateRoute layout={DashboardLayout} element={<Zones />} />
  }
/> 
          <Route
            path="/species"
            element={
              <PrivateRoute layout={DashboardLayout} element={<AddSpecie />} />
            }
          />
          


                    <Route
            path="/success-page"
            element={
              <PrivateRoute layout={DashboardLayout} element={<SuccessPage />} />
            }
          />


          <Route
  path="/alerts"
  element={
    <PrivateRoute layout={DashboardLayout} element={<AlertsPage />} />
  }
/>  



<Route
  path="/weather"
  element={
    <PrivateRoute layout={DashboardLayout} element={<WeatherPage />} />
  }
/> 



<Route
  path="/map"
  element={
    <PrivateRoute layout={DashboardLayout} element={<MapPage />} />
  }
/> 


<Route
  path="/reports"
  element={
    <PrivateRoute layout={DashboardLayout} element={<ReportForm />} />   
  }
/> 


<Route
  path="/rapportstatic"
  element={
    <PrivateRoute layout={DashboardLayout} element={<Rapportstatic />} />
  }
/> 


          {/* Not Found Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

const RedirectHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return null;
};

export default App;
