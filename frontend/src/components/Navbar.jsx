import { Link } from "react-router-dom"; 
import { useAuthStore } from "../store/useAuthStore"; 
import { LogOut, MessageSquare, Settings, User } from "lucide-react"; 

const Navbar = () => {
  // Extracting logout function and authenticated user details from the auth store
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Left side: Logo and App Name */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" /> {/* Icon for chat */}
              </div>
              <h1 className="text-lg font-bold">Chatty</h1> {/* App Name */}
            </Link>
          </div>

          {/* Right side: Navigation links and user options */}
          <div className="flex items-center gap-2">
            {/* Settings link */}
            <Link
              to={"/settings"}
              className={`btn btn-sm gap-2 transition-colors`}>
              <Settings className="w-4 h-4" /> {/* Settings icon */}
              <span className="hidden sm:inline">Settings</span> {/* Settings label */}
            </Link>

            {/* If user is authenticated, show profile and logout options */}
            {authUser && (
              <>
                {/* Profile link */}
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" /> {/* Profile icon */}
                  <span className="hidden sm:inline">Profile</span> {/* Profile label */}
                </Link>

                {/* Logout button */}
                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" /> {/* Logout icon */}
                  <span className="hidden sm:inline">Logout</span> {/* Logout label */}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
