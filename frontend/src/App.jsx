import { Routes, Route, Navigate } from "react-router-dom"; 
import Navbar from './components/Navbar'; 
import HomePage from './pages/HomePage'; 
import SignUpPage from './pages/SignUpPage'; 
import LoginPage from './pages/LoginPage'; 
import SettingsPage from './pages/SettingsPage'; 
import ProfilePage from './pages/ProfilePage'; 
import { useAuthStore } from "./store/useAuthStore"; 
import { useEffect } from "react"; 
import { Loader } from "lucide-react"; 
import { Toaster } from "react-hot-toast"; 
import { useThemeStore } from "./store/useThemeStore"; 

const App = () => {
  // Destructure necessary states and actions from the stores
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  // Check authentication status when the component mounts
  useEffect(() => {
    checkAuth(); // Calls the checkAuth function to verify if the user is authenticated
  }, [checkAuth]);

  // If authentication is being checked and no user is authenticated, show a loading spinner
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" /> {/* Loading spinner while auth is checked */}
      </div>
    );
  }

  // Log the authUser for debugging purposes
  console.log({ authUser });

  return (
    <div data-theme={theme}> {/* Apply the theme to the root div */}
      <Navbar /> {/* Navbar component */}

      <Routes>

        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default App;
