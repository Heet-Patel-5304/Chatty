import { X } from "lucide-react"; // Importing the close icon from lucide-react
import { useAuthStore } from "../store/useAuthStore"; 
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  // Extracting selected user and the function to reset the selected user from the chat store
  const { selectedUser, setSelectedUser } = useChatStore();
  
  // Extracting the list of online users from the auth store
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar: Display the selected user's profile picture */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User info: Display the user's full name and status */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {/* Check if the user is online and display the status accordingly */}
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button: Clicking the button will reset the selected user */}
        <button onClick={() => setSelectedUser(null)}>
          <X /> {/* Close icon */}
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
