import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";
import { login as loginApi } from "../../services/api";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailError(null);
    setPasswordError(null);

    try {
      const response = await loginApi(email, password);
      // Assuming response contains user object { id, email, role, name }
      login(response.user);

      if (response.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      console.error("Login error:", err);

      if (err.response && err.response.data) {
        const { code, message } = err.response.data;

        if (code === "USER_NOT_FOUND") {
          setEmailError("E-mail eksisterer ikke");
        } else if (code === "INVALID_PASSWORD") {
          setPasswordError("Forkert adgangskode");
        } else {
          setError(message || "Login mislykkedes. Tjek dine loginoplysninger.");
        }
      } else {
        setError("Der skete en fejl. Prøv igen senere.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F0F0] relative px-4">
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 md:top-8 md:left-8 p-2 text-gray-600 hover:text-black transition-colors"
      >
        <ArrowLeftIcon className="h-6 w-6" />
      </button>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          {/* Company Logo */}
          <h1 className="text-3xl font-bold text-[#1c1c1c] font-['EB_Garamond']">
            NORDWEAR
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                emailError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="din@email.dk"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null);
              }}
              required
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Adgangskode
            </label>
            <input
              type="password"
              id="password"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                passwordError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="********"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(null);
              }}
              required
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
            <div className="flex justify-between mt-2">
              <Link to="/forgot-password" className="text-sm text-black hover:opacity-75">
                Glemt adgangskode?
              </Link>
              <Link
                to="/create-user"
                className="text-sm text-black hover:opacity-75"
              >
                Opret bruger
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1c1c1c] text-white py-2 px-4 rounded-md text-lg font-medium hover:bg-[#282828] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c1c1c]"
          >
            Fortsæt
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
