import { create } from "zustand"; // Zustand for state management
import toast from "react-hot-toast"; // For displaying toast notifications
import { axiosInstance } from "../lib/axios"; // Axios instance for API calls
import { useAuthStore } from "./useAuthStore"; // Importing auth store for socket access

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response ? error.response.data.message : "Error in getUsers useChatStore!");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response ? error.response.data.message : "Error in getMessages useChatStore!");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;

      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  // <-- Added this function to update a user in the store
  updateUserInStore: (updatedUser) => {
    set(state => {
      const updatedUsers = state.users.map(user =>
        user._id === updatedUser._id ? updatedUser : user
      );

      const updatedSelectedUser =
        state.selectedUser && state.selectedUser._id === updatedUser._id
          ? updatedUser
          : state.selectedUser;

      return {
        users: updatedUsers,
        selectedUser: updatedSelectedUser,
      };
    });
  },
}));
