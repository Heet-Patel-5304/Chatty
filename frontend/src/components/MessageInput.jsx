import { useRef, useState } from "react"; 
import { useChatStore } from "../store/useChatStore"; 
import { Image, Send, X } from "lucide-react"; // Importing icons from lucide-react
import toast from "react-hot-toast"; // Importing toast notifications

const MessageInput = () => {
  // State hooks for managing text input and image preview
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  
  // Reference for the file input element
  const fileInputRef = useRef(null);

  // Extracting sendMessage function from the chat store
  const { sendMessage } = useChatStore();

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    // Check if the selected file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file"); // Show error if not an image
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // Set the image preview
    };
    reader.readAsDataURL(file); // Convert file to a data URL for preview
  };

  // Remove the selected image preview
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Clear the file input
  };

  // Handle the sending of a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // Don't send an empty message or without an image
    if (!text.trim() && !imagePreview) return;

    try {
      // Send the message via the sendMessage function
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear the form after sending the message
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error); // Log any errors
    }
  };

  return (
    <div className="p-4 w-full">
      {/* Display image preview if an image is selected */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview} // Display the selected image
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage} // Remove the image on click
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" /> {/* Icon for removing the image */}
            </button>
          </div>
        </div>
      )}

      {/* Form for sending a message */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          {/* Text input for message */}
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)} // Update text state
          />
          
          {/* Hidden file input for selecting an image */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange} // Handle image file change
          />

          {/* Button to trigger file input (only visible on small screens and when no image is selected) */}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
            ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()} // Trigger file input click
          >
            <Image size={20} /> {/* Image icon for selecting image */}
          </button>
        </div>
        
        {/* Send button to submit the message */}
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview} // Disable button if no text or image
        >
          <Send size={22} /> {/* Send icon */}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
