import React from 'react';
import { Link } from 'react-router-dom';

const CustomerOrders: React.FC = () => {
  return (
    <div className="container mx-auto px-6">
      <h1 className="text-2xl font-bold mb-8">Ordrer</h1>
      <div className="bg-white p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Ingen ordrer endnu</h2>
        <p>Gå til buttikken for at afgive en ordre.</p>
        <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">Gå til butikken</Link>
      </div>
    </div>
  );
};

export default CustomerOrders;