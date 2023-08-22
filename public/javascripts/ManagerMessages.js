//Client Side Code (Branch Manager's Side):

// Include Socket.IO library
src="https://cdn.socket.io/socket.io-3.1.1.min.js"

  // Connect to the server
  const socket = io.connect('http://localhost:3000');

  // Listen for incoming messages
  socket.on('message', (message) => {
    // Handle the incoming message (display, notify, etc.)
    // For example, you can append it to a chat window.
  });
 