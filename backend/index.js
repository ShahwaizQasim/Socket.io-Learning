import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

const server = createServer(app); // Yeh Express app ke liye HTTP server banata hai.
const io = new Server(server, {  // Yeh Socket.io ko HTTP server se connect karta hai.
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.get("/", (req, res) => {
    res.send("Hello World");
});

io.on("connection", (socket) => {
    console.log("User connected");
    console.log("User ID: ", socket.id);
    // socket.emit("welcome", "Welcome to the server");
    // socket.broadcast.emit("welcome", "User joined the chat");

    socket.on("message", ({room, message}) => {
        console.log("Message:", message);
        // io.emit("receive-message", data); // chating
        // socket.broadcast.emit("receive-message", data); // group chat
        io.to(room).emit("receive-message", message); // personal chat
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});


// emit: 
// Maan lo, aap apne dost ko phone par kuch bata rahe ho, toh wo sirf aap ke dost ko hi milega. Aapne emit kiya.

// broadcast: 
// Maan lo, aap ek group mein sabko kuch batane ke liye bol rahe ho, aur aapke dost ko nahi. Aapne broadcast kiya.


// Notify Meeaning:
// Jab hum kehte hain "notify karna", toh iska matlab hai kisi ko kisi cheez ke baare mein inform karna ya alert karna.

