$(document).ready(async function() {
    const cookieValue = document.cookie;
    const decodedValue = decodeURIComponent(cookieValue);

    const matches = decodedValue.match(/"([^"]+)"/);
    const extractedContent = matches ? matches[1] : null;

    let userData;
    const fnameTxt = $('#fname');

    await $.ajax({
        url: `/api/user/${extractedContent}`,
        method: "GET",
        success: function(data) {
            userData = data;
        },
        error: function(error) {
            console.log(error);
        }
    });

    fnameTxt.html(`שם פרטי: ${userData.fname}`);
});