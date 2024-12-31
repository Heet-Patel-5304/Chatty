import { create } from "zustand"; // Zustand for state management
import toast from "react-hot-toast"; // For displaying toast notifications
import { axiosInstance } from "../lib/axios"; // Axios instance for API calls
import { useAuthStore } from "./useAuthStore"; // Importing auth store for socket access

export const useChatStore = create((set, get) => ({
  // Array to store the messages
  messages: [], 
  // Array to store the users
  users: [], 
  // Currently selected user for chatting
  selectedUser: null, 
  // Boolean to track loading state of users
  isUsersLoading: false, 
  // Boolean to track loading state of messages
  isMessagesLoading: false, 

  // Function to fetch users
  getUsers: async () => {
    // Set loading state to true
    set({ isUsersLoading: true }); 
    try {
      // API call to get users
      const res = await axiosInstance.get("/messages/users"); 
      // Store the fetched users in state
      set({ users: res.data }); 
    } 
    catch (error) {
      toast.error(error.response ? error.response.data.message : "Error in getUsers useChatStore!"); 
    } 
    finally {
      // Mark the users loading state as false
      set({ isUsersLoading: false }); 
    }
  },

  // Function to fetch messages of the selected user
  getMessages: async (userId) => {
    // Set messages loading state to true
    set({ isMessagesLoading: true }); 
    try {
      // API call to get messages for a specific user
      const res = await axiosInstance.get(`/messages/${userId}`); 
      // Store fetched messages in state
      set({ messages: res.data }); 
    } 
    catch (error) {
      toast.error(error.response ? error.response.data.message : "Error in getMessages useChatStore!"); 
    } 
    finally {
      // Mark messages loading state as false
      set({ isMessagesLoading: false }); 
    }
  },

  // Function to send a message to the selected user
  sendMessage: async (messageData) => {
    // Get current selected user and messages
    const { selectedUser, messages } = get(); 
    try {
      // API call to send message
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData); 
      // Add the new message to the state
      set({ messages: [...messages, res.data] }); 
    } 
    catch (error) {
      toast.error(error.response.data.message); 
    }
  },

  // Function to subscribe to incoming messages from the server
  subscribeToMessages: () => {
    // Get the selected user for chat
    const { selectedUser } = get(); 
    // If no user selected, exit early
    if (!selectedUser) return; 

    // Get the socket instance from auth store
    const socket = useAuthStore.getState().socket; 

    // Listen for new messages from the server
    socket.on("newMessage", (newMessage) => {
      
      // Check if the incoming message is from the selected user
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      
      // Only update the state if the message is from the selected user
      if (!isMessageSentFromSelectedUser) {
        return; 
      }

      // Add the new message to the state
      set({
        messages: [...get().messages, newMessage], 
      });
    });
  },

  // Function to unsubscribe from incoming messages
  unsubscribeFromMessages: () => {
    // Get the socket instance from auth store
    const socket = useAuthStore.getState().socket; 
    socket.off("newMessage"); // Remove the event listener for new messages
  },

  // Function to set the currently selected user for chat
  setSelectedUser: (selectedUser) => set({ selectedUser }), // Set the selected user in the state
}));
