import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const [isVerified, setIsVerified] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) return setIsVerified(false);

      try {
        const res = await fetch('http://localhost:5000/verify-token', {
          method: 'GET',
          headers: {
            Authorization: token
          }
        });
        const data = await res.json();
        setIsVerified(data.success);
      } catch (err) {
        console.error(err);
        setIsVerified(false);
      }
    };

    verifyToken();
  }, []);

  if (isVerified === null) return <div>Loading...</div>;

  return isVerified ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
