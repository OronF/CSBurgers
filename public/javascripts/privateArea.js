$(document).ready(async function() {
    const cookieValue = document.cookie;
    const decodedValue = decodeURIComponent(cookieValue);

    const matches = decodedValue.match(/"([^"]+)"/);
    const extractedContent = matches ? matches[1] : null;

    let userData;
    let orders = [];
    const fnameTxt = $('#fname');
    const lnameTxt = $('#lname');
    const PhoneNumberTxt = $('#phoneNumber');

    const ordersList =  $('.ordersList');
    const ordersBtn = $('.orders');
    const ordersData = $('#ordersData');

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
    lnameTxt.html(`שם משפחה: ${userData.lname}`);
    PhoneNumberTxt.html(`מספר טלפון: ${userData.phoneNumber}`);

    



    















            const appendUsersOrdersLi = (data) => { 
                const newElement = $(`<div class="user-data-section" id="user-data-${id}">
                    <div class="user-data">
                        <div class="data">שם פרטי: ${data.fname}</div>
                        <div class="data">שם משפחה: ${data.lname}</div>
                        <div class="data">טלפון: ${data.phoneNumber} </div>
                        <div class="data-orders">
                            הזמנות: 
                            <ul class="data-orders-list"></ul>
                        </div>
                        
                    </div>
                </div>`);

                const userOrdersList = newElement.find('.data-orders-list');

                const appendsOrderssLi = async (id) => {
                    let order;
    
                    await $.ajax({
                        url: `/api/order/${id}`,
                        method: "GET"
                    }).done(function(data) {
                        order = data;
                    });
    
                    const newElement = $(`<li id="${order._id}">
                        <div class="order-Section"> 
    
                            <span type="button" class="orderInfoButton" data-order-id="${order._id}">
                                <i class="bi bi-chevron-down arrow" id="iconToClick-${order._id}"></i>
                            </span>

                            <span class="numberOfOrder">${order.orderNumber}</span>

                        </div>
                    </li>`);
    
                    userOrdersList.append(newElement);
                }

                data.orders.forEach(order_id => {
                    appendsOrderssLi(order_id);
                });

                li.append(newElement);
            }

            if(icon.hasClass('bi bi-chevron-down')) {
                await $.ajax({
                    url: `/api/user/${id}`,
                    method: "GET"
                }).done(function(data) {
                    appendUsersOrdersLi(data);
                    icon.removeClass("bi bi-chevron-down").addClass("bi bi-chevron-up");
                });
            }
            else {
                $(`#user-data-${id}`).remove();
                icon.removeClass("bi bi-chevron-up").addClass("bi bi-chevron-down");
            }
        });

        usersList.append(newElement);
});