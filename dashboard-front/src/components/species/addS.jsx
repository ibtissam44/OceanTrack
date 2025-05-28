import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


function LocationPicker({ onSelect, selectedLocation }) {
  const map = useMapEvents({
    click(e) {
      onSelect({ ...e.latlng, accuracy: 50 });
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    if (selectedLocation && selectedLocation.accuracy) {
      const circle = L.circle([selectedLocation.lat, selectedLocation.lng], {
        radius: selectedLocation.accuracy,
        color: 'blue',
        fillColor: '#3388ff',
        fillOpacity: 0.2
      }).addTo(map);

      return () => { map.removeLayer(circle); };
    }
  }, [selectedLocation, map]);

  return selectedLocation ? (
    <Marker position={selectedLocation}>
      <Popup>
        Emplacement sélectionné <br />
        Précision: {selectedLocation.accuracy.toFixed(0)} mètres
      </Popup>
    </Marker>
  ) : null;
}

export default function AddSpeciesForm() {
    const navigate = useNavigate(); 
  const today = new Date().toISOString().split('T')[0];
  const oneMonthLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    scientific_name: '',
    local_name: '',
    status: 'available',
    biological_rest_start: today,
    biological_rest_end: oneMonthLater,
    notes: '',
    quantity: 0,
    found_location: '',
    image: null,
  });
  
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [locationPermission, setLocationPermission] = useState('prompt');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' })
        .then(permissionStatus => {
          setLocationPermission(permissionStatus.state);
          permissionStatus.onchange = () => {
            setLocationPermission(permissionStatus.state);
          };
        });
    }
  }, []);


  const handleGetMyLocation = () => {
    if (locationPermission === 'denied') {
      alert('Permission de localisation refusée. Activez-la dans les paramètres du navigateur.');
      return;
    }

    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };

          setLocation(loc);
          setFormData(prev => ({
            ...prev,
            found_location: `Automatique: ${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)} (Précision: ${loc.accuracy.toFixed(0)}m)`
          }));
          setLoadingLocation(false);
        },
        (error) => {
          setLoadingLocation(false);
          alert(`Erreur de géolocalisation: ${error.message}`);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert('Géolocalisation non supportée par ce navigateur');
      setLoadingLocation(false);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
   
    if (name === 'biological_rest_start' && formData.biological_rest_end < value) {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        biological_rest_end: value 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      setFormData(prev => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    if (new Date(formData.biological_rest_end) < new Date(formData.biological_rest_start)) {
      setError("La date de fin du repos biologique doit être postérieure ou égale à la date de début");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const formDataToSend = new FormData();
    formDataToSend.append('scientific_name', formData.scientific_name);
    formDataToSend.append('local_name', formData.local_name);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('biological_rest_start', formData.biological_rest_start);
    formDataToSend.append('biological_rest_end', formData.biological_rest_end);
    formDataToSend.append('notes', formData.notes);
    formDataToSend.append('quantity', formData.quantity);
    formDataToSend.append('found_location', formData.found_location);
    
    if (location) {
      formDataToSend.append('latitude', location.lat);
      formDataToSend.append('longitude', location.lng);
      formDataToSend.append('accuracy', location.accuracy);
    }
    
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      await axios.post('http://localhost:8000/api/species', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      });
       navigate('/success-page')

 
      setFormData({
        scientific_name: '',
        local_name: '',
        status: 'available',
        biological_rest_start: today,
        biological_rest_end: oneMonthLater,
        notes: '',
        quantity: 0,
        found_location: '',
        image: null,
      });
      setLocation(null);
      setPreviewImage(null);
      setSuccessMessage('L\'espèce a été enregistrée avec succès !');
    } catch (error) {
      console.error('Erreur:', error.response?.data || error.message);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
        setError(errorMessages);
      } else {
        setError(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center border-b pb-4">
        Ajout d'une nouvelle espèce de poisson
      </h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nom scientifique <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="scientific_name"
              value={formData.scientific_name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nom local
            </label>
            <input
              type="text"
              name="local_name"
              value={formData.local_name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Statut <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="available">Disponible</option>
              <option value="fishing_banned">Pêche interdite</option>
              <option value="rare">Rare</option>
              <option value="endangered">En danger</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Quantité <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              min="0"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Début du repos biologique <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="biological_rest_start"
              value={formData.biological_rest_start}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              Date de début de la période de protection
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Fin du repos biologique <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="biological_rest_end"
              value={formData.biological_rest_end}
              onChange={handleInputChange}
              min={formData.biological_rest_start}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              Doit être postérieure ou égale à la date de début
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Image du poisson
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex flex-col items-center justify-center px-4 py-6 bg-white text-blue-700 rounded-lg border-2 border-dashed border-blue-300 cursor-pointer hover:bg-blue-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Choisir une image</span>
                <input
                  type="file"
                  name="image"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
              {previewImage && (
                <div className="relative group">
                  <img
                    src={previewImage}
                    alt="Aperçu"
                    className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setFormData(prev => ({ ...prev, image: null }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>


        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Localisation de la découverte
          </h3>

          <div className="flex flex-wrap gap-4 items-center">
            <button
              type="button"
              onClick={handleGetMyLocation}
              disabled={loadingLocation}
              className={`flex items-center px-4 py-2 rounded-lg text-white ${loadingLocation ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {loadingLocation ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Localisation en cours...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Utiliser ma position
                </>
              )}
            </button>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lieu de découverte <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="found_location"
                value={formData.found_location}
                onChange={handleInputChange}
                placeholder="Coordonnées ou description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>


          <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-300">
            <MapContainer 
              center={[14.6937, -17.4441]} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationPicker 
                onSelect={(loc) => {
                  setLocation(loc);
                  setFormData(prev => ({
                    ...prev,
                    found_location: `Sélectionné: ${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)} (Précision: ${loc.accuracy.toFixed(0)}m)`
                  }));
                }} 
                selectedLocation={location}
              />
            </MapContainer>
          </div>
        </div>


        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-lg text-white font-medium ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </>
            ) : 'Enregistrer l\'espèce'}
          </button>
        </div>
      </form>
    </div>
  );
}