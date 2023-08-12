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

        var user;

        await $.ajax({
            url:"/api/user",
            method: "GET",
            dataType: "json",
            contentType: 'application/json',
            data: {
                fname: fnameVal,
                lname: lnameVal,
                flag: true
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
    });
});