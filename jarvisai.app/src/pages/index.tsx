import React, { useState } from "react";

export default function Page() {
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");

  const askJarvis = async (text: string) => {
    try {
      const res = await fetch("/api/ask-jarvis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResponse(data.reply);
    } catch (error) {
      console.error("Error communicating with backend:", error);
    }
  };

  const handleListeningEnd = (text: string) => {
    setTranscript(text);
    askJarvis(text);
  };

  const startListening = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      handleListeningEnd(text);
    };
    recognition.start();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">JARVIS AI</h1>
      <button
        onClick={startListening}
        className="bg-blue-500 px-4 py-2 rounded"
      >
        Start Listening
      </button>
      {transcript && <p className="mt-4">{transcript}</p>}
      {response && <p className="mt-4 text-green-400">{response}</p>}
    </div>
  );
}
