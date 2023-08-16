$(document).ready(function() {

    const approve = $('#approveBtn');

    approve.on('click', function() {
        const fnameTxt = $('#form3Example1n');
        const lnameTxt = $('#form3Example1m');
        const phoneNumberTxt = $('#phone-number');
        const passwordTxt = $('#form3Example4cg');
        const passwordApproveTxt = $('#form3Example4cdg');

        const fnameVal = fnameTxt.val();
        const lnameVal = lnameTxt.val();
        const phoneNumberVal = phoneNumberTxt.val();
        const passwordVal = passwordTxt.val();
        const passwordApproveVal = passwordApproveTxt.val();

        if (fnameVal.length <= 12) {
            for (let i = 0; i< fnameVal; i++) {
                if (fnameVal[i] > 'z' || fnameVal[i] < 'A') {
                    return;
                }
            }
        } else {
            return;
        }

        if (lnameVal.length <= 12) {
            for (let i = 0; i< lnameVal; i++) {
                if (lnameVal[i] > 'z' || lnameVal[i] < 'A') {
                    return;
                }
            }
        } else {
            return;
        }

        if (phoneNumberVal.length != 13 && phoneNumberVal.length != 14) {
            return;
        }

        if (passwordVal.length > 8) {
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
            return;
        }

        if (passwordApproveVal !== passwordVal) {
            return;
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
                is_Manager: false
            }),
            success: function(response) {
                console.log("Data saved successfully:", response);
            },
            error: function(error) {
                console.error("Error saving data:", error);
            }
        });
    });
});