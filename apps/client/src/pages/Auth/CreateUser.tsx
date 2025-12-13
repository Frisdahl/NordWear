import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as registerApi } from '../../services/api';
import Notification from '../../components/Notification';

type NotificationState = {
  message: string;
  type: 'success' | 'error';
} | null;

const CreateUser: React.FC = () => {
  const [navn, setNavn] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState<NotificationState>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    try {
      await registerApi(navn, email, password);
      setNotification({ message: 'Bruger oprettet med succes!', type: 'success' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setNotification({ message: err.response.data.message, type: 'error' });
      } else {
        setNotification({ message: 'Oprettelse af bruger mislykkedes.', type: 'error' });
      }
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F0F0]">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#1c1c1c] font-['EB_Garamond']">NORDWEAR</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="navn" className="block text-sm font-medium text-gray-700 mb-1">
              Navn
            </label>
            <input
              type="text"
              id="navn"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Dit navn"
              value={navn}
              onChange={(e) => setNavn(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Adgangskode
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
             <div className="flex justify-between mt-2">
                <a href="/login" className="text-sm text-black hover:opacity-75">
                    Allerede bruger? Log ind
                </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1c1c1c] text-white py-2 px-4 rounded-md text-lg font-medium hover:bg-[#282828] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c1c1c]"
          >
            Opret bruger
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;

