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

// Include Socket.IO library
src="https://cdn.socket.io/socket.io-3.1.1.min.js"

//client side code

  // Connect to the server
  const socket = io.connect('http://localhost:2000');

  // Send a message to a specific branch
  function sendMessage() {
    const firstName = document.getElementById('fname').value;
    const lastName = document.getElementById('lname').value;
    const phoneNumber = document.getElementById('phone-number').value;
    const branch = document.getElementById('branch').value;
    const message = document.getElementById('message').value;

    const fullMessage = `Name: ${firstName} ${lastName}\nPhone: ${phoneNumber}\nMessage: ${message}`;
    console.log(fullMessage);
    
    socket.emit('message', { branch, message: fullMessage });
  }