import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open chat"
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 h-96 bg-white border rounded-lg shadow-lg p-4 flex flex-col">
      <div className="flex items-center justify-between border-b pb-2 mb-2">
        <p className="font-semibold text-sm">Chat with us</p>
        <button onClick={() => setIsOpen(false)} aria-label="Close chat">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
        Chat coming soon
      </div>
    </div>
  );
}
