function checkIfPhoneNumberIsValid(inp)
{
    for(let i = 0; i<inp.length; i++)
    {
        if(isNaN(inp[i]))
            return false;
    }
    
    return true;
}

function checkIfEmpty(inp, Error)
{
    if(inp === "")
    {
        Error.html("שדה ריק אינו חוקי");
        return;
    }
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

var flagCreatUser = 1;

const approve = $('#approveBtn');

window.addEventListener("keyup", e => {
    e.preventDefault();
    if (e.key === "Enter") {
        approve.click();
    }
  });


$(document).ready(function() {

    const approve = $('#approveBtn');

    approve.on('click', async function() {
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
        const termsCheckBox = $('#form2Example32')
        const termsError = $('#termsError')

        const fnameVal = fnameTxt.val();
        const lnameVal = lnameTxt.val();
        const phoneNumberVal = phoneNumberTxt.val();
        const passwordVal = passwordTxt.val();
        const passwordApproveVal = passwordApproveTxt.val();
        checkIfEmpty(passwordApproveVal, approvePasswordError);

        nameValidation(fnameVal, fnameError);
        nameValidation(lnameVal, lnameError);

        if(!termsCheckBox.prop('checked')){
            termsError.html("חובה להסכים לתנאי השימוש")
            flagCreatUser = 0;
        }

            if (fnameVal.length > 10) {
                fnameError.html( "הזנת שם פרטי ארוך מדי");
                flagCreatUser = 0;
            } 
            
            if (lnameVal.length > 10){
                lnameError.html("הזנת שם משפחה ארוך מדי");
                flagCreatUser = 0;
            } 
            
            if (!checkIfPhoneNumberIsValid(phoneNumberVal)){
                phoneNumberError.html("הזנת מספר טלפון לא חוקי");
                flagCreatUser = 0;
            }


            if(passwordVal.length < 8)
            {
                passwordError.html("על הסיסמה להכיל לפחות 8 תווים");
                flagCreatUser = 0;
            }

            if(passwordApproveVal !== passwordVal){
                approvePasswordError.html("שדה אישור הסיסמה אינו זהה לסיסמה")
                flagCreatUser = 0;
            }

            await $.ajax({
                url: "/api/user",
                method: "GET",
                success: function(data)
                {
                    data.forEach(user => {
                        phoneNumberFormatter();
                        console.log("data found");
                        if(user.phoneNumber === phoneNumberVal){
                            phoneNumberError.html("מספר טלפון זה כבר בשימוש במשתמש אחר");
                            flagCreatUser = 0;
                        }
                    });
                },
                error: function(error) {
                    console.error("Error finding data",error);
                }
            })
            if(flagCreatUser != 0){
                await $.ajax({
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
    
                        // Read the 'signUpCookie' value
                        const phoneNumberCookie = getCookie('signUpCookie');
                        console.log('Phone number from cookie:', phoneNumberCookie);
                        $('#exampleModal').modal('show');
                    },
                    error: function(error) {
                        console.error("Error saving data:", error);
                    }
                });
            }

            
            function getCookie(name) {
                const value = "; " + document.cookie;
                const parts = value.split("; " + name + "=");
                if (parts.length === 2) {
                  return parts.pop().split(";").shift();
                }
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