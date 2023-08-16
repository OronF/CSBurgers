$(document).ready(function() {

    const btnSubmit = $('.submit-btn');

    btnSubmit.on('click', function() {
        const fnameTxt = $('#fnameTxt');
        const lnameTxt = $('#lnameTxt');
        const passwordTxt = $('#passwordTxt');
        const Error = $('#error');
        
        const fnameVal = fnameTxt.val();
        const lnameVal = lnameTxt.val();
        const passwordVal = passwordTxt.val();

        if (!fnameVal && !lnameVal && !passwordVal) {
            Error.html('לא הזנת את כל כל הנתונים');
            if (Error.hasClass('hide')) {
                Error.removeClass('hide');
            }
        } else {
            $.ajax({
                url:"/api/user",
                method: "GET",
                dataType: "json",
                contentType: 'application/json',
                data: {
                    fname: fnameVal,
                    lname: lnameVal,
                    password: passwordVal
                },
                success: function(response) {
                    if (!Error.hasClass('hide')) {
                        Error.addClass('hide');
                    }
                    console.log("Data saved successfully:", response);
                },
                error: function(error) {
                    console.error("Error saving data:", error);
                    Error.html('יש לך טעות בשם או בסיסמה אנא תקן כדי להתחבר');
                    if (Error.hasClass('hide')) {
                        Error.removeClass('hide');
                    }
                }
            });
        }
    });
});