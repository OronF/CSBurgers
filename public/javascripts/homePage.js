$(document).ready(async function() {

    const cookieValue = document.cookie;
    const [cookieName, encodedContent] = cookieValue.split('=');
    const decodedValue = decodeURIComponent(encodedContent);

    const matches = decodedValue.match(/"([^"]+)"/);
    const extractedContent = matches ? matches[1] : null;

    if (extractedContent) {
        let userName;

        await $.ajax({
            url: `/api/user/${extractedContent}`,
            method: "GET",
            success: function(data) {
                userName = data.fname;
            },
            error: function(error) {
                console.error(error);
            }
        })

        const user = $('.user');
        user.html(`שלום: ${userName}`);

        if (cookieName === 'admin') {
            const cartAndUser = $('.cartAndUser');


            const appendManagerPages = function() {
                const newElement = $(`<div class="managerPages">
                    <a class="graphs" href="/manager/graphs">
                        <i class="bi bi-graph-up-arrow"></i>
                    </a>

                    <a class="ordersAndUsers" href="/manager/graphs">הזמנות ומשתמשים</a>
                </div>
                `);

                cartAndUser.append(newElement);
            }

            appendManagerPages();
        }
    }

});