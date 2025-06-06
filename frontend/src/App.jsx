import { Button, Container, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { io } from "socket.io-client";

const App = () => {

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null); // 💡 Use ref to keep socket instance persistent

  useEffect(() => {
    socketRef.current = io("http://localhost:3000", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      setSocketId(socketRef.current.id);
      console.log("Connected to server", socketRef.current.id);
    });

    socketRef.current.on("receive-message", (data) => {
      console.log("Received message:", data);
      setMessages((messages) => [...messages, data]);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socketRef.current.disconnect(); // Cleanup
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      socketRef.current.emit("message", {message, room});
      setMessage('');
      setRoom('');
    }
  };

  return (
    <Container>
      <Typography variant="h4">Welcome to Socket.io</Typography>
      <Typography variant="h6">Id: {socketId}</Typography><br />
      <form onSubmit={handleSubmit}>
        <TextField label="message" variant="outlined" id="message" onChange={(e) => setMessage(e.target.value)} /><br /><br/>
        <TextField label="room" variant="outlined" id="room" onChange={(e) => setRoom(e.target.value)} /><br />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: "10px", marginLeft: "10px" }}>Send</Button>
      </form>
      <Stack>
        {
          messages.map((message, index) => (
            <Typography key={index}>{message}</Typography>
          ))
        }
      </Stack>
    </Container>
  )
}

export default App