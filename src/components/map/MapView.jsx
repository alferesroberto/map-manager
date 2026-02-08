import { MapContainer, TileLayer, Marker, Tooltip, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import logo from "../../assets/logo.png";
import L from "leaflet";


export default function MapView() {
  const [markerPosition, setMarkerPosition] = useState([13.6929, -89.2182]);
const [title, setTitle] = useState("");
const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const [position, setPosition] = useState([13.6929, -89.2182]);
const [markers, setMarkers] = useState([]);
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
 useEffect(() => {
  const loadMarkers = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("markers")
      .select("id, latitude, longitude")
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
    } else {
      setMarkers(data);
    }
  };

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

  setShowPopup(false);
  setTitle("");
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
      <div className="space-y-2">
        <p className="text-sm">
          Lat: {markerPosition[0].toFixed(5)} <br />
          Lng: {markerPosition[1].toFixed(5)}
        </p>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título"
          className="border px-2 py-1 w-full rounded"
        />

        <button
          onClick={saveMarker}
          className="w-full bg-blue-600 text-white py-1 rounded"
        >
          Guardar ubicación
        </button>
      </div>
    </Popup>
  )}
</Marker>


          {markers.map((m) => (
            <Marker
                key={m.id}
                position={[m.latitude, m.longitude]}
                draggable
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
