$(document).ready(function() {

    const framework = $('#framework');

    framework.append(`<option value = "0" disabled selected class="text-blue-600/100">שם הסניף</option>`);

    let index = 1;

    const createSelection = (branch) => {
        framework.append(`<option value="${index}" data-manager-id="${branch.manager}">${branch.name}</option>`);
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

    const approveBtn = $('#approve-btn');

    window.addEventListener("keyup", e => {
        e.preventDefault();
        if (e.key === "Enter") {
            approveBtn.click();
        }
    });

    approveBtn.on('click', async function() {
    
    });
});

/***** phone number formator *****/
const phoneNumberField = document.getElementById("phone-number");


phoneNumberField.addEventListener("select", function(event) {
    event.preventDefault(); // Prevent text selection
 });
 

    // Disable arrow keys and text selection
    phoneNumberField.addEventListener('keydown', function(event) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
      }
    });

    phoneNumberField.addEventListener("select", function(event) {
        event.preventDefault(); // Prevent text selection
      });

phoneNumberField.addEventListener("click", function() {
    if (phoneNumberField.value.length === 0) {
        phoneNumberField.value = "05";
    }
});

phoneNumberField.addEventListener("keydown", function(event) {
    if ((event.key === "Backspace" || event.key === "Delete") && phoneNumberField.value.length === 2) {
        event.preventDefault();
    }
});

document.addEventListener("click", function(event) {
    if (event.target !== phoneNumberField && phoneNumberField.value.length === 2) {
        phoneNumberField.value = "";
    }
});


function phoneNumberFormatter()
{
    const phoneNumberField = document.getElementById("phone-number");
    const formattedInputVal = formatPhoneNumber(phoneNumberField.value);
    phoneNumberField.value = formattedInputVal;
    
}
function formatPhoneNumber(value)
{
    if(!value) return value;
    
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    
    if(phoneNumberLength < 4) return phoneNumber;
    if(phoneNumberLength < 7){
        return `(${phoneNumber.slice(0,3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0,3)}) ${phoneNumber.slice(
        3,
        6,
        )}-${phoneNumber.slice(6,9)
        }`;
}