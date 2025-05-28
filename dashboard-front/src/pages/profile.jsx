import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserAlt, FaEdit, FaKey, FaSpinner } from 'react-icons/fa';
import { fetchUserData } from '../api/auth';
import EditInfoModal from '../components/profile/EditInfoModal';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const navigate = useNavigate();

  const loadUserData = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const data = await fetchUserData(token);
      setUserData(data);
      setLoading(false);
    } catch (error) {
      navigate('/login');
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-500">
        <FaSpinner className="text-sky-400 animate-spin text-4xl mb-4" />
        <p>Chargement des informations...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-sky-100 to-sky-200 min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-sky-400 to-cyan-400 text-white py-8 px-6 text-center">
          <h1 className="text-3xl font-bold">Bienvenue, {userData?.name || 'Utilisateur'}</h1>
          <p className="text-sm mt-2 opacity-90">{userData?.email}</p>
        </div>

        {/* Content Section */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Picture and Info */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg mb-6">
              <FaUserAlt className="text-5xl text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{userData.name}</h2>
            <p className="text-gray-600">{userData.email}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-4 justify-center">
            <button
              onClick={() => setEditModalOpen(true)}
              className="flex items-center justify-center w-full bg-sky-400 text-white py-3 px-4 rounded-lg hover:bg-sky-500 transition duration-200 shadow-md hover:shadow-lg"
            >
              <FaEdit className="mr-2" />
              Modifier les informations
            </button>
            <button
              onClick={() => setPasswordModalOpen(true)}
              className="flex items-center justify-center w-full bg-red-400 text-white py-3 px-4 rounded-lg hover:bg-red-500 transition duration-200 shadow-md hover:shadow-lg"
            >
              <FaKey className="mr-2" />
              Changer le mot de passe
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isEditModalOpen && (
        <EditInfoModal
          userData={userData}
          onClose={() => setEditModalOpen(false)}
          onSave={async (updatedData) => {
            setUserData(updatedData);
            await loadUserData();
            setEditModalOpen(false);
          }}
        />
      )}
      {isPasswordModalOpen && (
        <ChangePasswordModal onClose={() => setPasswordModalOpen(false)} />
      )}
    </div>
  );
};

export default Profile;
