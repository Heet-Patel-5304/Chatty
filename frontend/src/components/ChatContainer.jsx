import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  // Extracting necessary properties and functions from the chat store
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  // Extracting the authenticated user data from the auth store
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null); // Reference to scroll to the latest message

  // Effect to fetch messages when a user is selected and to subscribe to message updates
  useEffect(() => {
    getMessages(selectedUser._id); // Fetch initial messages for the selected user
    subscribeToMessages(); // Subscribe to new incoming messages

    return () => unsubscribeFromMessages(); // Unsubscribe when the component unmounts
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Effect to automatically scroll to the latest message when messages change
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to the latest message
    }
  }, [messages]);

  // If messages are loading, show the skeleton loading screen
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton /> {/* Display the skeleton for message loading */}
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Display messages */}
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef} // Reference for auto-scrolling
          >
            {/* Chat message avatar */}
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            {/* Message timestamp */}
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)} {/* Format and display message time */}
              </time>
            </div>

            {/* Message content */}
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2" // Display image if present
                />
              )}
              {message.text && <p>{message.text}</p>} {/* Display text if present */}
            </div>
          </div>
        ))}
      </div>

      {/* Input for sending new messages */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;