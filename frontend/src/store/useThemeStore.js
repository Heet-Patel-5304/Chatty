import { create } from "zustand"; // Zustand for state management

export const useThemeStore = create((set) => ({
    // Initialize the theme from localStorage or default to "dark"
    theme: localStorage.getItem("chat-theme") || "dark", 

    // Function to set a new theme
    setTheme: (theme) => {
        // Save the selected theme in localStorage
        localStorage.setItem("chat-theme", theme);
        // Update the theme in the state
        set({ theme });
    }
}));
