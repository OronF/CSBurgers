$(document).ready(function() {

    const btnSubmit = $('.submit-btn');

    btnSubmit.on('click', function() {
        const fnameTxt = $('#fname');
        const passwordTxt = $('#form3Example4cg');
        const Error = $('#error');
        
        const fnameVal = fnameTxt.val();
        const passwordVal = passwordTxt.val();

        if (!fnameVal && !passwordVal) {
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
                    password: passwordVal
                },
                success: function(response) {
                    if (!Error.hasClass('hide')) {
                        Error.addClass('hide');
                    }
                    console.log("Data saved successfully:", response);
                    window.location.href = '/';
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