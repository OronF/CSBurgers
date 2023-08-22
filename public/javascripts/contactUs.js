$(document).ready(function() {

    const framework = $('#framework');

    framework.append(`<option disabled selected class="text-blue-600/100">שם הסניף</option>`);

    let index = 1;

    const createSelection = (branch) => {
        framework.append(`<option value="${index}" data-manager-id="${branch._id}">${branch.name}</option>`);
        index++;
    }

    const render = (data) => {
        data.forEach(branch => {
            createSelection(branch);
        });
    }

    $.ajax({
        url:"/api/branch",
        method: "GET",
        success: (data) => {
            render(data);
        },
        error: (error) => {
            console.log(error);
        }
    });
});


const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Handle incoming socket connections
io.on('connection', (socket) => {
  // When a client sends a message
  socket.on('message', (data) => {
    // Emit the message to the selected branch manager
    io.to(data.branch).emit('message', data.message);
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});