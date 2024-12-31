const MessageSkeleton = () => {
  // Create an array of 6 items for skeleton messages
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Loop through the skeletonMessages array to create skeleton loaders for messages */}
      {skeletonMessages.map((_, idx) => (
        <div key={idx} className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}>
          {/* Skeleton avatar for the message */}
          <div className="chat-image avatar">
            <div className="size-10 rounded-full">
              {/* Skeleton for avatar */}
              <div className="skeleton w-full h-full rounded-full" />
            </div>
          </div>

          {/* Skeleton for the message header (e.g., username) */}
          <div className="chat-header mb-1">
            <div className="skeleton h-4 w-16" />
          </div>

          {/* Skeleton for the message bubble */}
          <div className="chat-bubble bg-transparent p-0">
            <div className="skeleton h-16 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;