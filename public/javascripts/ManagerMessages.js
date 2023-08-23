//Client Side Code (Branch Manager's Side):

// Include Socket.IO library
src="https://cdn.socket.io/socket.io-3.1.1.min.js"

  // Connect to the server
  const socket = io.connect('http://localhost:2000');

  // Listen for incoming messages
  socket.on('message', (message) => {
    // Create a new message element
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = message;

    // Append the message to the container
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.appendChild(messageElement);
  });