import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { Dashboard } from './pages/dashboard/Dashboard';
import { NotFound } from './pages/NotFound404';
import { ForgotPassword } from './pages/ForgotPassword';
import { VerifyOTP } from './pages/VerifyOTP';
import PropertiesMap from './pages/properties/PropertiesMap';
import PropertiesDetail from './pages/properties/PropertiesDetail';


interface PrivateRouteProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}


// Protected Route wrapper
const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route path="/verify-otp" element={<VerifyOTP />} />


        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/plot-map"
          element={
            <PrivateRoute>
              <PropertiesMap />
            </PrivateRoute>
          }
        />

        <Route
          path="/plot-detail/:id?"
          element={
            <PrivateRoute>
              <PropertiesDetail />
            </PrivateRoute>
          }
        />







        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </Router>
  );
}

export default App;