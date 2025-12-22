import { useState, useEffect } from 'react';

const useGoogleMaps = (apiKey: string) => {
  const [google, setGoogle] = useState<any>(null);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      script.onload = () => {
        setGoogle(window.google);
      };
    } else {
      setGoogle(window.google);
    }
  }, [apiKey]);

  return google;
};

export default useGoogleMaps;
