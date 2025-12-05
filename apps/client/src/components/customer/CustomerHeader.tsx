import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, MagnifyingGlassIcon, ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'Deals', path: '/deals' },
  { name: 'Sneakers', path: '/sneakers' },
  { name: 'Shirts', path: '/shirts' },
  { name: 'Om os', path: '/about' },
  { name: 'Size guide', path: '/size-guide' },
];

const CustomerHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Prevent scrolling when the mobile menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Handle scroll effect
    const handleScroll = () => {
      // The scroll threshold should be minimal, like 1, to trigger the effect immediately
      setIsScrolled(window.scrollY > 1);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // By default, header is solid. On medium screens and up, it's transparent unless scrolled.
  const headerClasses = `transition-colors duration-300 bg-[#F1F0EE] shadow-md border-b border-gray-200 ${
    !isScrolled && 'md:bg-transparent md:shadow-none md:border-b-0'
  }`;

  return (
    <>
      {/* This is the main fixed container for both banner and header */}
      <div className="fixed top-0 left-0 right-0 z-30 text-[#1c1c1c]">
        {/* Top Banner */}
        <div className="bg-[#630D0D] text-[#F5F5F5] text-center py-2 text-sm">
          Faste lave priser. Begrænset lager. Forlænget retur.
        </div>

        {/* Main Header */}
        <header className={headerClasses}>
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            {/* Desktop Menu & Burger Icon */}
            <div className="flex items-center space-x-8">
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(true)}>
                  <Bars3Icon className="h-6 w-6" />
                </button>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                {menuItems.slice(0, 3).map((item) => (
                  <Link key={item.name} to={item.path} className="hover:underline">
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Logo */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link to="/" className="text-2xl font-bold tracking-wider">
                NORDWEAR
              </Link>
            </div>

            {/* Right Icons & Desktop Menu */}
            <div className="flex items-center space-x-8">
              <div className="hidden md:flex items-center space-x-8">
                 {menuItems.slice(3).map((item) => (
                  <Link key={item.name} to={item.path} className="hover:underline">
                    {item.name}
                  </Link>
                ))}
                 <Link to="/login" className="hover:underline">Log på</Link>
              </div>
               <div className="flex items-center space-x-4">
                  <button className="p-2">
                      <MagnifyingGlassIcon className="h-6 w-6" />
                  </button>
                  <Link to="/cart" className="p-2">
                      <ShoppingCartIcon className="h-6 w-6" />
                  </Link>
               </div>
            </div>
          </nav>
        </header>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-25 transition-opacity duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Mobile Menu Panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white text-black shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button onClick={() => setIsMenuOpen(false)}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col space-y-4">
            {[...menuItems, { name: 'Log på', path: '/login' }].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-lg hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default CustomerHeader;
