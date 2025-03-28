module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("⚡ New user connected for video call:", socket.id);

        // When a user initiates a video call
        socket.on("callUser", ({ userToCall, signalData, from, name }) => {
            io.to(userToCall).emit("callIncoming", { signal: signalData, from, name });
        });

        // When a user answers a call
        socket.on("answerCall", (data) => {
            io.to(data.to).emit("callAccepted", data.signal);
        });

        socket.on("disconnect", () => {
            console.log("❌ User disconnected from video call:", socket.id);
        });
    });
};
