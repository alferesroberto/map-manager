import { useEffect, useState } from "react";
import MapView from "../components/map/MapView";
import { signOut } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function MapPage() {
  const [position, setPosition] = useState([13.6929, -89.2182]); // El Salvador default
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([
          pos.coords.latitude,
          pos.coords.longitude
        ]);
      }
    );
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      
   

      <MapView
        position={position}
        onMove={setPosition}
      />

      <div className="mt-4 bg-white p-4 rounded-xl shadow">
        <p><strong>Latitude:</strong> {position[0]}</p>
        <p><strong>Longitude:</strong> {position[1]}</p>
      </div>

    </div>
  );
}
