require("dotenv").config(); // Load .env variables
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow frontend connections
app.use(express.json()); // Ensure JSON body parsing

const authRoutes = require("./routes/auth"); // ✅ ADD THIS
app.use("/api/auth", authRoutes); //

// Import and use payment routes
const paymentRoutes = require("./routes/payment");
app.use("/api/payment", paymentRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // React Frontend URL
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("callUser", ({ userToCall, signalData, from }) => {
        io.to(userToCall).emit("callIncoming", { from, signal: signalData });
    });

    socket.on("answerCall", ({ signal, to }) => {
        io.to(to).emit("callAccepted", signal);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    });
});

server.listen(process.env.PORT || 5000, () => 
    console.log(`Server running on port ${process.env.PORT || 5000}`)
);
