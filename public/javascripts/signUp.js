function checkIfPhoneNumberIsValid(inp)
{
    for(let i = 0; i<inp.length; i++)
    {
        if(isNaN(inp[i]))
        return false;
    }

    if(inp[0] !== 0 || inp[1] !== 3 || inp[1] !==5)
        return false;
    
    return true;
}

function checkIfEmpty(inp, generalError)
{
    if(inp === "")
    {
        generalError.html("שדה ריק אינו חוקי");
        return true;
    }
    return false;
}

$(document).ready(function() {

    const approve = $('#approveBtn');

    approve.on('click', function() {
        const fnameTxt = $('#fname');
        const lnameTxt = $('#lname');
        const phoneNumberTxt = $('#phone-number');
        const passwordTxt = $('#passowrdInput');
        const passwordApproveTxt = $('#confirmPassowrdInput');

        const fnameError = $('#fnameError');
        const lnameError = $('#lnameError');
        const passwordError = $('#passwordError');
        const approvePasswordError = $('#approvePasswordError');
        const phoneNumberError = $('#phoneNumberError');
        const generalError = $('.generalError');

        const fnameVal = fnameTxt.val();
        const lnameVal = lnameTxt.val();
        const phoneNumberVal = phoneNumberTxt.val();
        const passwordVal = passwordTxt.val();
        const passwordApproveVal = passwordApproveTxt.val();

        checkIfEmpty(fnameVal, generalError);
        checkIfEmpty(lnameVal, generalError);
        checkIfEmpty(passwordVal, generalError);
        checkIfEmpty(passwordApproveVal, generalError);


            if (fnameVal.length > 10) {
                fnameError.html( "הזנת שם פרטי ארוך מדי");
                
            } 
            
            if (lnameVal.length > 10){
                lnameError.html("הזנת שם משפחה ארוך מדי");
            } 
            
            if (false === checkIfPhoneNumberIsValid(phoneNumberVal)){
                phoneNumberError.html("הזנת מספר טלפון לא חוקי");
            }
                


            $.ajax({
                url:"/api/user",
                method: "POST",
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify({
                    fname: fnameVal,
                    lname: lnameVal,
                    orders: [],
                    phoneNumber: phoneNumberVal,
                    password: passwordVal,
                    approvePassword: passwordApproveVal,
                    is_Manager: false
                }),
                success: function(response) {
                    console.log("Data saved successfully:", response);
                },
                error: function(error) {
                    console.error("Error saving data:", error);
                }
            });
        
        // if (fnameVal.length < 2) {
        //     return;
        // }

        // if (lnameVal.length < 2) {
        //     return;
        // } 
    
        // if (phoneNumberVal.length != 13 && phoneNumberVal.length != 14) {
        //     return;
        // }

        // if (passwordVal.length < 8)
        // {
        //     return;
        // }

        // if (passwordApproveVal !== passwordVal) {
        //     return;
        // }

        
        
    });
});

/************************************** phone number formator **************************************/
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