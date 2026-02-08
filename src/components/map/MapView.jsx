import { MapContainer, TileLayer, Marker, Tooltip, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import logo from "../../assets/logo.png";
import L from "leaflet";


export default function MapView() {
const defaultIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

  const [markerPosition, setMarkerPosition] = useState([13.6929, -89.2182]);
const [title, setTitle] = useState("");
const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const [position, setPosition] = useState([13.6929, -89.2182]);
const [markers, setMarkers] = useState([]);
const [message, setMessage] = useState("");

const editableIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/blue.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

const normalIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});


  // Cargar marcador
 async function loadMarkers() {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("markers")
    .select("id, latitude, longitude, title")
    .eq("user_id", user.id);

  if (error) console.error(error);
  else setMarkers(data);
}
useEffect(() => {
  loadMarkers();
}, []);



const getCurrentUser = async () => {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
};
async function saveMarker() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  await supabase.from("markers").upsert({
    user_id: userData.user.id,
    latitude: markerPosition[0],
    longitude: markerPosition[1],
    title
  });

  setMessage("Ubicación guardada ✔");

  loadMarkers(); // vuelve a cargar puntos

  setTimeout(() => {
    setMessage("");
  }, 2000);
}


  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="h-screen w-full overflow-hidden relative">

      {/* Header */}
      <header className="
        absolute top-0 left-0 right-0 z-[2000]
        flex justify-between items-center
        px-6 py-4
        bg-white/90 backdrop-blur-md
        shadow
      ">
        <div className="flex items-center gap-2">
            <img src={logo} className="w-8" />
            <h1 className="font-bold text-lg">Map Manager</h1>
         </div>


        <button
          onClick={handleLogout}
          className="
            px-4 py-2 rounded-lg text-sm font-medium
            text-white
            bg-gradient-to-r from-indigo-500 to-purple-500
            hover:from-indigo-600 hover:to-purple-600
            transition
          "
        >
          Logout
        </button>
      </header>

      {/* Map */}
      <div className="pt-20 h-full">

        <MapContainer
          center={position}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
<Marker
  position={markerPosition}
  draggable
  icon={editableIcon}
  eventHandlers={{
    dragend: (e) => {
      const { lat, lng } = e.target.getLatLng();
      setMarkerPosition([lat, lng]);
      setShowPopup(true);
    }
  }}
>
  {showPopup && (
    <Popup>
  <div className="w-56 space-y-3">
    <div className="text-xs text-gray-600">
      <p>Lat: {markerPosition[0].toFixed(5)}</p>
      <p>Lng: {markerPosition[1].toFixed(5)}</p>
    </div>

    <input
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Título del punto"
      className="
        w-full px-3 py-2 rounded-lg
        border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-blue-500
      "
    />

    <button
      onClick={saveMarker}
      className="
        w-full py-2 rounded-lg
        bg-blue-600 text-white
        hover:bg-blue-700 transition
        font-medium
      "
    >
      Guardar ubicación
    </button>

    {message && (
      <p className="text-green-600 text-sm text-center">
        {message}
      </p>
    )}
  </div>
</Popup>
  )}
</Marker>


          {markers.map((m) => (
            <Marker
                key={m.id}
                position={[m.latitude, m.longitude]}
                draggable
                 icon={defaultIcon}
                eventHandlers={{
                dragend: async (e) => {
                    const user = await getCurrentUser();
                    if (!user) return;

                    const { lat, lng } = e.target.getLatLng();

                    await supabase
                    .from("markers")
                    .update({
                        latitude: lat,
                        longitude: lng
                    })
                    .eq("id", m.id);
                }
                }}
            />
            ))}


        </MapContainer>

      </div>

    </div>
  );
}
