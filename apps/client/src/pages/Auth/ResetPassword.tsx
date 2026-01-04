import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Notification from "../../components/Notification";
import { apiClient } from "../../services/api";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    heading: string;
    subtext: string;
  }>({ show: false, type: "success", heading: "", subtext: "" });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification({ ...notification, show: false });

    if (password !== confirmPassword) {
      setNotification({
        show: true,
        type: "error",
        heading: "Fejl",
        subtext: "Adgangskoderne er ikke ens.",
      });
      return;
    }

    if (password.length < 8) {
      setNotification({
        show: true,
        type: "error",
        heading: "Fejl",
        subtext: "Adgangskoden skal være på mindst 8 tegn.",
      });
      return;
    }

    setLoading(true);

    try {
      await apiClient.post("/auth/reset-password", { token, password });
      
      setNotification({
        show: true,
        type: "success",
        heading: "Adgangskode ændret",
        subtext: "Din adgangskode er nu blevet nulstillet. Du kan nu logge ind.",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Reset password error:", err);
      setNotification({
        show: true,
        type: "error",
        heading: "Fejl",
        subtext: err.response?.data?.message || "Kunne ikke nulstille adgangskode. Linket kan være udløbet.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F0F0]">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Ugyldigt link</h2>
          <p className="text-gray-600 mb-6">Der mangler et token i linket. Prøv venligst at anmode om en ny nulstilling.</p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="bg-[#1c1c1c] text-white py-2 px-4 rounded-md hover:bg-[#282828]"
          >
            Gå til glemt adgangskode
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F0F0] relative px-4">
      <Notification
        show={notification.show}
        type={notification.type}
        heading={notification.heading}
        subtext={notification.subtext}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#1c1c1c] font-['EB_Garamond']">
            NORDWEAR
          </h1>
          <h2 className="text-lg font-medium text-gray-700 mt-4">Ny adgangskode</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ny adgangskode
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bekræft ny adgangskode
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1c1c1c] text-white py-2 px-4 rounded-md text-lg font-medium hover:bg-[#282828] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c1c1c] disabled:opacity-50"
          >
            {loading ? "Gemmer..." : "Gem ny adgangskode"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
