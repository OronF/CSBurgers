$(document).ready(function() {

    const deleteOrderFromUser = async (user) => {
        if(user.currentOrder) {
            let currentOrder;
            await $.ajax({
                url: `/api/order/${user.currentOrder}`,
                method: "GET",
                success: function(data) {
                    currentOrder = data;
                }, 
                error: function(error) {
                    window.location.href = '/';
                }
            });
            
            if (!currentOrder.closed) {
                await $.ajax({
                    url: `/api/order/${user.currentOrder}`,
                    method: "DELETE",
                    success: function(data) {
                        console.log("deleted data", data);
                    }, 
                    error: function(error) {
                        console.error(error);
                    }
                });
            }
        }
    }

    const btnSubmit = $('.submit-btn');

    window.addEventListener("keyup", e => {
        e.preventDefault();
        if (e.key === "Enter") {
            btnSubmit.click();
        }
    });

    btnSubmit.on('click', function() {
        const fnameTxt = $('#fname');
        const phoneNumberTxt = $('#phone-number')
        const passwordTxt = $('#form3Example4cg');
        const Error = $('#error');
        
        const fnameVal = fnameTxt.val();
        const phoneNumberVal = phoneNumberTxt.val();
        const passwordVal = passwordTxt.val();

        if (!fnameVal || !passwordVal || !phoneNumberVal) {
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
                    phoneNumber: phoneNumberVal,
                    password: passwordVal
                },
                success: async function(response) {
                    if (!Error.hasClass('hide')) {
                        Error.addClass('hide');
                    }
                    console.log("Data saved successfully:", response);
                    await deleteOrderFromUser(response);
                    window.location.href = '/';
                },
                error: function(error) {
                    console.error("Error saving data:", error);
                    Error.html('יש לך טעות באחד מפרטיך אנא תקן כדי להתחבר');
                    if (Error.hasClass('hide')) {
                        Error.removeClass('hide');
                    }
                }
            });
        }
    });
});