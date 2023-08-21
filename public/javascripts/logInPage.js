$(document).ready(function() {

    const phoneNumber = $('#phone-number');
    const ErrorPhoneNumber = $('#ErrorPhoneNumber');
    const Password = $('#password');
    const ErrorPassword = $('#ErrorPassword');

    $('.submit-btn').on('click', function() {
        const btn = $(this);

        const phoneNumberVal = phoneNumber.val();

        const PasswordVal = Password.val();

        if(phoneNumberVal && PasswordVal) {
            $.ajax({
                url: `/api/users/`,
                method: "GET",
                success: function(data) {
                    data.forEach(user => {
                        if(user.phoneNumberVal() === phoneNumberVal()){
                            if(user.PasswordVal() === PasswordVal()){
                                
                            }
                            else{
                                ErrorPassword.html("הסיסמה חרא");
                            }
                        }
                        else{
                            ErrorPhoneNumber.html("אתה חרא אתה לא קיים במערכת, תיצור משתמש חדש ");
                        }
                            
                    });
                },
            })
        }
    })

});
