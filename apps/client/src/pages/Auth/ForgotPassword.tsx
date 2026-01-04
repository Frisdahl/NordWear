import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Notification from "../../components/Notification";
import { apiClient } from "../../services/api";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    heading: string;
    subtext: string;
  }>({
    show: false,
    type: "success",
    heading: "",
    subtext: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ ...notification, show: false });

    try {
        // Assuming endpoint exists or mocking it for now as per "we need a new page" request
        // If backend endpoint is needed, I would create it. 
        // For now, I will try to call it, if it fails with 404 I will still show success to avoid enumeration if that's the desired security model, 
        // OR if the user wants strict error handling.
        // User said: "if succeed or fail we should see the toast message we have"
        
        await apiClient.post("/auth/forgot-password", { email });
        
        setNotification({
            show: true,
            type: "success",
            heading: "Email sendt",
            subtext: "Hvis en konto findes med denne email, modtager du instruktioner om nulstilling.",
        });
    } catch (err: any) {
        console.error("Forgot password error:", err);
        
        let subtext = "Kunne ikke sende email. Prøv venligst igen senere.";
        if (err.response && err.response.status === 404) {
            subtext = "Ingen konto fundet med denne email.";
        }

        setNotification({
            show: true,
            type: "error",
            heading: "Fejl",
            subtext: subtext,
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F0F0] relative px-4">
      <Notification
        show={notification.show}
        type={notification.type}
        heading={notification.heading}
        subtext={notification.subtext}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      
      <button
        onClick={() => navigate("/login")}
        className="absolute top-4 left-4 md:top-8 md:left-8 p-2 text-gray-600 hover:text-black transition-colors"
      >
        <ArrowLeftIcon className="h-6 w-6" />
      </button>
      
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#1c1c1c] font-['EB_Garamond']">
            NORDWEAR
          </h1>
          <h2 className="text-lg font-medium text-gray-700 mt-4">Nulstil adgangskode</h2>
          <p className="text-sm text-gray-500 mt-2">
            Indtast din email adresse, så sender vi dig et link til at nulstille din adgangskode.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="din@email.dk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1c1c1c] text-white py-2 px-4 rounded-md text-lg font-medium hover:bg-[#282828] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c1c1c] disabled:opacity-50"
          >
            {loading ? "Sender..." : "Send email"}
          </button>
          
          <div className="mt-4 text-center">
              <Link to="/login" className="text-sm text-gray-600 hover:text-black hover:underline">
                  Tilbage til log ind
              </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
