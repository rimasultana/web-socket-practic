import React, { useEffect, useState } from "react";

const Chat = () => {
  const [socket, setSocket] = useState(null); // 🔹 WebSocket কানেকশন রাখার জন্য
  const [messages, setMessages] = useState([]); // 🔹 সব মেসেজ রাখবে
  const [input, setInput] = useState(""); // 🔹 ইনপুট ফিল্ডের ভ্যালু রাখবে

  useEffect(() => {
    // 🔹 সার্ভারের সাথে কানেকশন করলাম
    const ws = new WebSocket("ws://localhost:5000");
    setSocket(ws);

    // 🔹 সার্ভার থেকে মেসেজ আসলে সেট করি
    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    // 🔹 ক্লিনআপ (কম্পোনেন্ট আনমাউন্ট হলে কানেকশন বন্ধ হবে)
    return () => ws.close();
  }, []);

  // 🔹 মেসেজ সেন্ড করার ফাংশন
  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(input); // মেসেজ সার্ভারে পাঠাই
      setInput(""); // ইনপুট খালি করি
    } else {
      console.log("Socket is not open");
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-4">💬 WebSocket Chat</h2>

      {/* 🔹 মেসেজ দেখানোর জায়গা */}
      <div className="w-96 h-64 border rounded-lg p-2 overflow-y-auto bg-gray-50 mb-3">
        {messages.map((msg, i) => (
          <p key={i} className="text-sm text-gray-800">
            {msg}
          </p>
        ))}
      </div>

      {/* 🔹 ইনপুট ফিল্ড + সেন্ড বাটন */}
      <div className="flex w-96">
        <input
          className="flex-1 border rounded-l-lg px-2 py-1"
          placeholder="Type message..."
          value={input}
          onChange={(e) => setInput(e.target.value)} // ইনপুট আপডেট করে
        />
        <button
          onClick={sendMessage} // বাটনে ক্লিক করলে মেসেজ পাঠায়
          className="bg-blue-500 text-white px-4 rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
