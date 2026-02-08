import { useState } from "react";
import { signIn } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/ui/AuthLayout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await signIn(email, password);
    if (error) alert(error.message);
    else navigate("/map");
  };

  return (
            
    <AuthLayout title="Login">


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
          Login
        </button>

        <p className="text-center text-sm">
          No account?{" "}
          <Link className="text-indigo-200 hover:text-white" to="/register">
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
