import { useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { Users } from 'lucide-react';

const Sidebar = () => {
    // Destructuring necessary values from the chat store
    const { users, getUsers, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
    // Destructuring online users from the auth store
    const { onlineUsers } = useAuthStore();
    // State for toggling the "Show online only" filter
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    // Fetch users when the component mounts or the getUsers function changes
    useEffect(() => {
        getUsers();
    }, [getUsers]);

    // Show loading skeleton while users are being fetched
    if (isUsersLoading) {
        return <SidebarSkeleton />;
    }

    // Filter users based on the "Show online only" toggle
    const filteredUsers = showOnlineOnly
        ? users.filter((user) => onlineUsers.includes(user._id)) // Show only online users
        : users;

    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            {/* Sidebar Header */}
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <span className="font-medium hidden lg:block">Contacts</span>
                </div>
                
                {/* Online filter toggle */}
                <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                        {/* Checkbox to toggle online-only filter */}
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)} // Toggle state
                            className="checkbox checkbox-sm"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">
                        ({onlineUsers.length - 1 > 0 ? onlineUsers.length - 1 : 0} online)
                    </span>
                </div>
            </div>

            {/* User List */}
            <div className="overflow-y-auto w-full py-3">
                {/* Map through the filtered users and render their details */}
                {filteredUsers.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => setSelectedUser(user)} // Set selected user on click
                        className={`w-full p-3 flex items-center gap-3
                            hover:bg-base-300 transition-colors
                            ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                        `}
                    >
                        {/* User Profile Picture with online indicator */}
                        <div className="relative mx-auto lg:mx-0">
                            <img
                                src={user.profilePic || "/avatar.png"} // Fallback avatar if profilePic is not available
                                alt={user.name}
                                className="size-12 object-cover rounded-full"
                            />
                            {/* Display online status indicator */}
                            {onlineUsers.includes(user._id) && (
                                <span
                                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                                    rounded-full ring-2 ring-zinc-900"
                                />
                            )}
                        </div>

                        {/* User info (visible only on larger screens) */}
                        <div className="hidden lg:block text-left min-w-0">
                            <div className="font-medium truncate">{user.fullName}</div>
                            <div className="text-sm text-zinc-400">
                                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                ))}

                {/* Display message if no users are found after filtering */}
                {filteredUsers.length === 0 && (
                    <div className="text-center text-zinc-500 py-4">No online users</div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
