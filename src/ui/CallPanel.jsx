import React, { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function CallPanel() {
  useEffect(() => {
    socket.on("incoming-call", (data) => {
      alert(`Incoming call from ${data.from}`);
    });

    return () => {
      socket.off("incoming-call");
    };
  }, []);

  const callAdmin = () => {
    socket.emit("call-user", { to: "admin-id" });
  };

  return (
    <div>
      <button onClick={callAdmin}>Call Admin</button>
    </div>
  );
}