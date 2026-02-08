import { useState } from "react";
import { signUp } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/ui/AuthLayout";


export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
const [success, setSuccess] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("already registered")) {
      setError("Este correo ya está registrado");
    } else {
      setError(error.message);
    }
    return;
  }

  setSuccess("Registro exitoso. Revisa tu correo para verificar tu cuenta.");
};


  return (
    <AuthLayout title="Register">
        {error && (
  <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
    {error}
  </div>
)}

{success && (
  <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">
    {success}
  </div>
)}

      <form onSubmit={handleSubmit} className="space-y-6">

        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />

        <button className="btn-primary w-full">
          Register
        </button>

        <p className="text-center text-sm">
          Already have account?{" "}
          <Link className="text-indigo-200 hover:text-white" to="/">
            Login
          </Link>
        </p>

      </form>
    </AuthLayout>
  );
}
