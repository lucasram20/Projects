"use client";

import { useState } from "react";

export default function DashboardPage() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [streamingResponse, setStreamingResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChatHistory([...chatHistory, message]);
    setMessage("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let tempResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setChatHistory((prev) => [...prev, tempResponse]);
          setStreamingResponse("");
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        tempResponse += chunk;
        setStreamingResponse(tempResponse);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {chatHistory.map((msg, i) => (
          <div key={i} className="p-2">
            {msg}
          </div>
        ))}
        {streamingResponse && <div className="p-2">{streamingResponse}</div>}
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Type your message..."
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}