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

        const btnGuest = $('.btn-guest');
        btnGuest.remove();

        const Guestdiv = $('#Guestdiv');

        const appendLogOutBtn = function() {
            const newElement = $(`
                <button class="btn-logout" ><a class="btn-css" href="/logout">התנתקות</a></button>
            `);

            Guestdiv.append(newElement);
        }

        appendLogOutBtn();

        if (cookieName === 'admin') {
            const cartAndUser = $('.cartAndUser');


            const appendManagerPages = function() {
                const newElement = $(`<div class="managerPages">
                    <a class="graphs" href="/manager/graphs">
                        <i class="bi bi-graph-up-arrow"></i>
                    </a>

                    <a class="ordersAndUsers" href="/manager/cartForManager">הזמנות ומשתמשים</a>
                </div>
                `);

                cartAndUser.append(newElement);
            }

            appendManagerPages();
        }
    }

});