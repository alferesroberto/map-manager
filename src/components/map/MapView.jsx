import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import logo from "../../assets/logo.png";
import L from "leaflet";


export default function MapView() {
  const navigate = useNavigate();

  const [position, setPosition] = useState([13.6929, -89.2182]);
  const [title] = useState("Mi ubicación");
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
  position={position}
  draggable
  icon={editableIcon}
  eventHandlers={{
    dragend: async (e) => {
      const latitude = e.target.getLatLng().lat;
      const longitude = e.target.getLatLng().lng;

      setPosition([latitude, longitude]);

      const user = await getCurrentUser();
      if (!user) return;

      await supabase.from("markers").upsert({
        user_id: user.id,
        title,
        latitude,
        longitude
      });
    }
  }}
>
 <Tooltip direction="top" offset={[0, -20]} opacity={0.9}>
  Arrástrame
</Tooltip>

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
