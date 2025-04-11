import './index.css';
import Authpage from './Components/Authpage.jsx';
import Mainpage from './Components/Mainpage.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx'; // 👈 import
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Authpage />} />
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <Mainpage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default Main;
