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
        });

        const user = $('.user');
        user.html(`שלום, ${userName}`);

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
            const cartAndUser = $('.btns-aside');


            const appendManagerPages = function() {
                const newElement = $(`<div class="managerPages row">

                <div class="graphs">
                
                    <a class="graphs" href="/manager/graphs">
                           גרפים<i class="g-arrow bi-graph-up-arrow"></i>
                    </a>
                </div>
                <span class="underLine">____________________________________________________________________________________________________________________________________________________________________________________</span>

                <div class="ordersAndUserspage">
                    <a class="ordersAndUsers" href="/manager/cartForManager"><i class="users-icon bi-people-fill"></i>משתמשים</a>
                </div>
                <span class="underLine">____________________________________________________________________________________________________________________________________________________________________________________</span>


                <div class="Messages">

                    <a class="Messages" href="/manager/ManagerMessages"><i class="message-icon bi-chat-left-text"></i>הודעות</a>
                    </div>
                    
                </div>
                <span class="underLine">____________________________________________________________________________________________________________________________________________________________________________________</span>


                `);

                cartAndUser.append(newElement);
            }

            appendManagerPages();
        }
    }

});