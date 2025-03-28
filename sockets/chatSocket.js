module.exports = (io) => {
  io.use(require('../middlewares/socketAuth')); // JWT validation
  
  io.on('connection', (socket) => {
    console.log(`User ${socket.user.id} connected`);

    // Join room for private messaging
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
    });

    // Handle new messages
    socket.on('sendMessage', async (data) => {
      try {
        const message = new Message({
          sender: socket.user.id,
          receiver: data.receiverId,
          content: data.text
        });
        await message.save();
        
        io.to(data.roomId).emit('newMessage', message);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.user.id} disconnected`);
    });
  });
};