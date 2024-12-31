import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  // Destructuring selectedUser from the useChatStore
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      {/* Container for the content, adds padding and centers the content */}
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          {/* Flex container for the sidebar and chat content */}
          <div className="flex h-full rounded-lg overflow-hidden">
            {/* Sidebar component */}
            <Sidebar />

            {/* Conditionally render NoChatSelected or ChatContainer based on selectedUser */}
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
