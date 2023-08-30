$(document).ready(function() {

    function checkIfPhoneNumberIsValid(inp)
    {
        if (inp.length !== 14) {
            return false;
        } else {
            for (let i = 0; i< inp.length; i++) {
                if (inp[i] < '0' && inp[i] > '9' && inp[i] != " " && inp[i] != "-" && inp[i] != "(" && inp[i] != ")") { 
                    return false;
                }
            }
        }
        
        return true;
    }

    function nameValidation(name, error)
    {
        if(name.length < 2)
        {
            error.html("על השדה להכיל לפחות 2 תווים בעברית");
        }
        
        for (let i = 0; i < name.length; i++) {
            const charCode = name.charCodeAt(i);
            
            // Check if the character is a valid Hebrew letter
            if (charCode < 1488 || charCode > 1514) {
                error.html("על השדה להכיל תווים בעברית בלבד");
                if(name.length<2)
                error.html("על השדה להכיל תווים בעברית בלבד ולפחות 2 תווים")

            }
        }
    }

    function checkIfEmpty(inp, Error)
    {
        if(inp === "")
        {
            Error.html("שדה ריק אינו חוקי");
            return true;
        }
    }

    window.addEventListener("keyup", e => {
        e.preventDefault();
        if (e.key === "Enter") {
            approve.click();
        }
    });

    const approve = $('#approveBtn');

    approve.on('click', async function() {
        const fnameTxt = $('#fname');
        const lnameTxt = $('#lname');
        const passwordTxt = $('#password');
        const passwordApproveTxt = $('#passwordApprov');
        const PhoneNumberTxt = $('#phone-number');

        const fnameVal = fnameTxt.val();
        const lnameVal = lnameTxt.val();
        const passwordVal = passwordTxt.val();
        const passwordApproveVal = passwordApproveTxt.val();
        const PhoneNumberVal = PhoneNumberTxt.val();


        const fnameError = $('#fnameError');
        const lnameError = $('#lnameError');
        const passwordError = $('#passwordError');
        const approvePasswordError = $('#approvePasswordError');
        const phoneNumberError = $('#PhoneNumberError');
        const Error = $('#error');


        checkIfEmpty(fnameVal, fnameError);
        checkIfEmpty(lnameVal, lnameError);
        checkIfEmpty(passwordVal, passwordError);
        checkIfEmpty(passwordApproveVal, approvePasswordError);
        checkIfEmpty(PhoneNumberVal,phoneNumberError);

        nameValidation(fnameVal, fnameError);
        nameValidation(lnameVal, lnameError);

        var flagChangePassword = 1;

        var user;

        await $.ajax({
            url:"/api/user",
            method: "GET",
            dataType: "json",
            contentType: 'application/json',
            data: {
                fname: fnameVal,
                lname: lnameVal,
                phoneNumber: PhoneNumberVal
            },
            success: function(data) {
                user = data;
                console.log(data);
            },
            error: function(error) {
                console.error("Error saving data:", error);
                Error.html('יש לך טעות באחד מפרטיך אנא תקן כדי להתחבר');
                Error.show();
            }
        });

        if (!user) {

            return;
        }
        if (passwordApproveVal !== passwordVal) {
            approvePasswordError.html("שדה אישור הסיסמה אינו זהה לסיסמה")
            flagChangePassword = 0;
        }
        if (fnameVal.length > 10) {
            fnameError.html( "הזנת שם פרטי ארוך מדי");
            flagChangePassword = 0;
        } 
        
        if (lnameVal.length > 10){
            lnameError.html("הזנת שם משפחה ארוך מדי");
            flagChangePassword = 0;
        } 

        if (!checkIfPhoneNumberIsValid(PhoneNumberVal)){
            phoneNumberError.html("הזנת מספר טלפון לא חוקי");
            flagChangePassword = 0;
        }

        if(passwordApproveVal !== passwordVal){
            approvePasswordError.html("שדה אישור הסיסמה אינו זהה לסיסמה")
            passwordError.html("שדה אישור הסיסמה אינו זהה לסיסמה")
            flagChangePassword = 0;
        }

        var letterRegex = /[a-zA-Zא-ת]/;

        if(!letterRegex.test(passwordVal)){
            passwordError.html("הסיסמא חייבת להכיל לפחות תו אחד בעברית או אנגלית")
            flagChangePassword = 0;
        }

        if (passwordVal.length >= 8) {
            let counter = 0;

            for (let i = 0; i < passwordVal.length; i++) {
                if (passwordVal[i] <= 'z' && passwordVal[i] >= 'A') {
                    counter++;
                }
            }

            if (counter === 0) {
                return;
            }
        } else {
            passwordError.html("על הסיסמה להכיל לפחות 8 תווים");
            flagChangePassword = 0;
        }


        if(flagChangePassword != 0){
            $.ajax({
                url:`/api/user/${user._id}`,
                method: "PUT",
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify({
                    fname: user.fname,
                    lname: user.lname,
                    orders: user.orders,
                    phoneNumber: user.phoneNumber,
                    password: passwordVal,
                    is_Manager: user.is_Manager
                }),
                success: function(response) {
                    console.log("Data saved successfully:", response);
                    $('#exampleModal').modal('show');
                },
                error: function(error) {
                    console.error("Error saving data:", error);
                }
            });
        } else {
            flagChangePassword = 1;
        }
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