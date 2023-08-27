function checkIfEmpty(inp, Error)
{
    if(inp === "")
    {
        Error.html("שדה ריק אינו חוקי");
        return true;
    }
}
$(document).ready(function() {

    const approve = $('#approveBtn');

    approve.on('click', async function() {
        const fnameTxt = $('#fname');
        const lnameTxt = $('#lname');
        const passwordTxt = $('#password');
        const passwordApproveTxt = $('#passwordApprov');

        const fnameVal = fnameTxt.val();
        const lnameVal = lnameTxt.val();
        const passwordVal = passwordTxt.val();
        const passwordApproveVal = passwordApproveTxt.val();

        const fnameError = $('#fnameError');
        const lnameError = $('#lnameError');
        const passwordError = $('#passwordError');
        const approvePasswordError = $('#approvePasswordError');
        checkIfEmpty(fnameVal, fnameError);
        checkIfEmpty(lnameVal, lnameError);
        checkIfEmpty(passwordVal, passwordError);
        checkIfEmpty(passwordApproveVal, approvePasswordError);


        var user;

        await $.ajax({
            url:"/api/user",
            method: "GET",
            dataType: "json",
            contentType: 'application/json',
            data: {
                fname: fnameVal,
                lname: lnameVal,
                phoneNumber: 1 // for now no phoneNumber
            },
            success: function(data) {
                user = data;
            },
            error: function(error) {
                console.error("Error saving data:", error);
            }
        });

        if (!user) {

            return;
        }
        if (passwordApproveVal !== passwordVal) {
            approvePasswordError.html("סיסמאות לא שוות")
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
        
        //if (!checkIfPhoneNumberIsValid(phoneNumberVal)){
        //    phoneNumberError.html("הזנת מספר טלפון לא חוקי");
        //    flagChangePassword = 0;
        //}


        if(passwordApproveVal !== passwordVal){
            approvePasswordError.html("שדה אישור הסיסמה אינו זהה לסיסמה")
            passwordError.html("שדה אישור הסיסמה אינו זהה לסיסמה")
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
                url:`/api/user/${user[0]._id}`,
                method: "PUT",
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify({
                    fname: user[0].fname,
                    lname: user[0].lname,
                    orders: user[0].orders,
                    phoneNumber: user[0].phoneNumber,
                    password: passwordVal,
                    is_Manager: user[0].is_Manager
                }),
                success: function(response) {
                    console.log("Data saved successfully:", response);
                },
                error: function(error) {
                    console.error("Error saving data:", error);
                }
            });
        }
    });
});