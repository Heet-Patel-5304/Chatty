import { create } from "zustand"; // Zustand for state management
import { axiosInstance } from './../lib/axios'; // Axios instance for API calls
import toast from "react-hot-toast"; // For displaying toast notifications
import { io } from "socket.io-client"; 

// Base URL for the API
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/"; 

export const useAuthStore = create((set, get) => ({

    // Stores the authenticated user data
    authUser: null, 
    // Tracks whether the signup process is ongoing
    isSigningUp: false, 
    // Tracks whether the login process is ongoing
    isLoggingIn: false, 
    // Tracks whether the profile update process is ongoing
    isUpdatingProfile: false, 
    // Tracks whether the authentication check is in progress
    isCheckingAuth: true, 
    // List of online users
    onlineUsers: [], 
    socket: null, // Stores the socket connection instance

    // Function to check authentication status
    checkAuth: async () => {
        try {
            // API call to check auth status
            const res = await axiosInstance.get("/auth/check"); 
            // Store the authenticated user in the state
            set({ authUser: res.data }); 
            // If authenticated, connect socket
            get().connectSocket(); 
        } catch (error) {
            set({ authUser: null }); // Reset authUser if error occurs
            console.log("Error in checkAuth useAuthStore!! : ", error);
        } finally {
            set({ isCheckingAuth: false }); // Mark the auth check as completed
        }
    },

    // Function to handle user signup
    signup: async (data) => {
        set({ isSigningUp: true }); // Indicate that signup is in progress
        try {
            // API call to signup
            const res = await axiosInstance.post("/auth/signup", data); 
            // Store authenticated user in the state
            set({ authUser: res.data }); 
            // Show success message
            toast.success("Account created successfully"); 
            get().connectSocket(); // Connect socket after signup
        } catch (error) {
            toast.error("Error in SignUp useAuthStore:", error); 
        } finally {
            set({ isSigningUp: false }); // Mark the signup process as completed
        }
    },

    // Function to handle user login
    login: async (data) => {
        set({ isLoggingIn: true }); // Indicate that login is in progress
        try {
            // API call to login
            const res = await axiosInstance.post("/auth/login", data); 
            // Store authenticated user in the state
            set({ authUser: res.data }); 
            // Show success message
            toast.success("Logged in successfully"); 
            get().connectSocket(); // Connect socket after login
        } catch (error) {
            toast.error(error.response.data.message); 
        } finally {
            set({ isLoggingIn: false }); // Mark the login process as completed
        }
    },

    // Function to handle user logout
    logout: async () => {
        try {
            // API call to logout
            await axiosInstance.post("/auth/logout"); 
            // Reset authUser after logout
            set({ authUser: null }); 
            // Show success message
            toast.success("Logged Out Successfully"); 
            get().disconnectSocket(); // Disconnect socket after logout
        } catch (error) {
            toast.error(error.response ? error.response.data.message : "Error in LogOut useAuthStore");
        }
    },

    // Function to update user profile
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true }); // Indicate that profile update is in progress
        try {
            // API call to update profile
            const res = axiosInstance.put("/auth/profile-update", data); 
            // Store updated user data in the state
            set({ authUser: res.data }); 
            toast.success("Profile Updated Successfully!"); // Show success message
        } catch (error) {
            console.log("Error in updateProfile!", error);
            toast.error(error.response ? error.response.data.message : "Error in updateProfile useAuthStore!"); 
        } finally {
            // Mark the profile update process as completed
            set({ isUpdatingProfile: false }); 
        }
    },

    // Function to establish socket connection
    connectSocket: () => {
        // Get the authenticated user data
        const { authUser } = get(); 

        // Don't connect if no user or socket is already connected
        if (!authUser || get().socket?.connected) {
            return; 
        }

        // Pass the userId as a query parameter to the socket
        const socket = io(baseURL, {
            query: {
                userId: authUser._id, 
            },
        });

        socket.connect(); // Establish the socket connection
        set({ socket: socket }); // Store the socket instance in the state

        // Listen for online users' updates from the socket server
        socket.on("getOnlineUsers", (userIds) => {
            // Update the list of online users
            set({ onlineUsers: userIds }); 
        });
    },

    // Function to disconnect the socket
    disconnectSocket: () => {
        if (get().socket?.connected) {
            // Disconnect the socket if it's connected
            get().socket.disconnect(); 
        }
    },

}));
