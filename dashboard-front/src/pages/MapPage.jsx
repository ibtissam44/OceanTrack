import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const createCustomIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const allowedIcon = createCustomIcon('green');    // Zones où la pêche est autorisée
const forbiddenIcon = createCustomIcon('red');    // Zones interdites
const userIcon = createCustomIcon('blue');       // Position de l'utilisateur
const defaultIcon = createCustomIcon('gold');     // Position par défaut
const fishAvailableIcon = createCustomIcon('gold'); // Zones avec des poissons

function FlyToLocation({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 10, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

export default function FishingZonesMap() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userPosition, setUserPosition] = useState(null);
  const [nearestZone, setNearestZone] = useState(null);
  const [defaultPosition] = useState([34.0, -6.8]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/zones");
        if (!response.ok) throw new Error("La réponse du réseau n'était pas correcte");
        const data = await response.json();
        setZones(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const position = [pos.coords.latitude, pos.coords.longitude];
        setUserPosition(position);
      },
      (err) => {
        console.error(err);
        setError("Impossible de récupérer votre position");
      }
    );
  }, []);

  useEffect(() => {
    if (!userPosition || zones.length === 0) return;

    const getDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLng = (lng2 - lng1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    let closest = null;
    let minDist = Infinity;

    zones.forEach((zone) => {
      const lat = parseFloat(zone.latitude);
      const lng = parseFloat(zone.longitude);
      if (isNaN(lat) || isNaN(lng)) return;
      const dist = getDistance(userPosition[0], userPosition[1], lat, lng);
      if (dist < minDist) {
        minDist = dist;
        closest = zone;
      }
    });

    setNearestZone(closest);
  }, [userPosition, zones]);

  if (loading) return <div>Chargement en cours...</div>;
  if (error) return <div>Une erreur est survenue : {error}</div>;

  const searchedZone = zones.find((z) =>
    z.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mapCenter = searchedZone
    ? [parseFloat(searchedZone.latitude), parseFloat(searchedZone.longitude)]
    : userPosition || defaultPosition;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
        <input
          type="text"
          placeholder="Rechercher une zone de pêche..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ flex: 1 }}>
        <MapContainer center={mapCenter} zoom={10} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {searchedZone && (
            <FlyToLocation
              position={[
                parseFloat(searchedZone.latitude),
                parseFloat(searchedZone.longitude),
              ]}
            />
          )}

          {userPosition && (
            <Marker position={userPosition} icon={userIcon}>
              <Popup>Votre position actuelle</Popup>
            </Marker>
          )}

          {!userPosition && (
            <Marker position={defaultPosition} icon={defaultIcon}>
              <Popup>Position par défaut</Popup>
            </Marker>
          )}

          {zones.map((zone) => {
            const lat = parseFloat(zone.latitude);
            const lng = parseFloat(zone.longitude);
            if (isNaN(lat) || isNaN(lng)) return null;

            const isAllowed = zone.status === "allowed";
            const hasFish = zone.species.length > 0;

            
            let icon;
            if (!isAllowed) {
              icon = forbiddenIcon; 
            } else if (hasFish) {
              icon = fishAvailableIcon;
            } else {
              icon = allowedIcon; 
            }

            return (
              <Marker key={zone.id} position={[lat, lng]} icon={icon}>
                <Popup>
                  <div>
                    <h3>{zone.name}</h3>
                    <p>État : {isAllowed ? "Pêche autorisée" : "Pêche interdite"}</p>
                    {zone.reason && <p>Raison : {zone.reason}</p>}
                    {hasFish && (
                      <div>
                        <p>Poissons disponibles :</p>
                        <ul>
                          {zone.species.map((specie) => (
                            <li key={specie.id}>
                              {specie.local_name} ({specie.scientific_name}) - Quantité : {specie.pivot.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {userPosition && nearestZone && (
            <Polyline
              positions={[
                userPosition,
                [
                  parseFloat(nearestZone.latitude),
                  parseFloat(nearestZone.longitude),
                ],
              ]}
              pathOptions={{ color: '#1890ff', dashArray: '5,10', weight: 3 }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
