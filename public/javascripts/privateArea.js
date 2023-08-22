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

    const ordersList =  $('.order-list');

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

    const appendOrderLi = (order) => {
        const newElement = $(`<li id="${order._id}">
        <div class="order-Section"> 

            <span type="button" class="orderInfoButton" data-order-id="${order._id}">
                <i class="bi bi-chevron-down arrow" id="iconToClick-${order._id}"></i>
            </span>

            <span class="numberOfOrder">מספר הזמנה: ${order.orderNumber}</span>

        </div>
        </li>`);

        newElement.find('.orderInfoButton').on('click', async function() {
            const btn = $(this);
            const id = btn.attr('data-order-id');
            const icon = $(`#iconToClick-${id}`);
            const li = $(`#${id}`);

            const appendOrdersDataLi = async (data) => { 
                const newElement = $(`<div class="order-data-section" id="order-data-${id}">
                    <div class="order-data">
                        <div class="data">שם הלקוח: ${userData.fname} ${userData.lname}</div>
                        <div class="data">תאריך: ${data.orderDate}</div>
                        <div class="data">כתובת: ${data.location}</div>
                        <div class="data">מחיר: ${data.totalprice}</div>
                        <div class="data-orders-dishes">
                            פרטים: 
                            <ul class="data-orders-dishes-list"></ul>
                        </div>
                    </div>
                </div>`);

                const dataordersdisheslist = newElement.find('.data-orders-dishes-list');

                let Meals;

                await $.ajax({
                    url: `/api/order/${data._id}`,
                    method: "GET",
                    dataType: "json",
                    contentType: 'application/json',
                    data: { 
                        group :true,
                        meals: true 
                    },
                    success: function(data) {
                        Meals = data;
                    },
                    error: function(error) {
                        console.error(error);
                    }
                });
                    
                Meals.forEach(async (meal) => {
                    await $.ajax({
                        url: `/api/meal/${meal._id}`,
                        method: "GET",
                        success: function(Mealdata) {
                            dataordersdisheslist.append(`<li>${Mealdata.name} ${meal.count}</li>`);
                        },
                        error: function(error) {
                            console.error(error);
                        }
                    });
                });

                let Dishes;

                await $.ajax({
                    url: `/api/order/${data._id}`,
                    method: "GET",
                    dataType: "json",
                    contentType: 'application/json',
                    data: { 
                        group :true,
                    },
                    success: function(data) {
                        Dishes = data;
                    },
                    error: function(error) {
                        console.error(error);
                    }
                });
                    
                Dishes.forEach(async (dish) => {
                    await $.ajax({
                        url: `/api/dish/${dish._id}`,
                        method: "GET",
                        success: function(Dishdata) {
                            dataordersdisheslist.append(`<li>${Dishdata.name} ${dish.count}</li>`);
                        },
                        error: function(error) {
                            console.error(error);
                        }
                    });
                });

                li.append(newElement);
            }

            if(icon.hasClass('bi bi-chevron-down')) {
                await $.ajax({
                    url: `/api/order/${id}`,
                    method: "GET"
                }).done(function(data) {
                    appendOrdersDataLi(data);
                    icon.removeClass("bi bi-chevron-down").addClass("bi bi-chevron-up");
                });
            }
            else {
                $(`#order-data-${id}`).remove();
                icon.removeClass("bi bi-chevron-up").addClass("bi bi-chevron-down");
            }
        });

        ordersList.append(newElement);

        orders.push({
            id: order._id,
            name: `${order.orderNumber}`,
            element: newElement
        });
    }

    let orderData;

    userData.orders.forEach( async (order) => {
        await $.ajax({
            url: `/api/order/${order}`,
            method: "GET",
            success: function(data) {
                orderData = data;
            },
            error: function(error) {
                console.error(error);
            }
        });

        appendOrderLi(orderData);
    });

    const searchOrder = $('#searchOrder');

    searchOrder.on('input', function() {
        const value = searchOrder.val().toLowerCase();

        orders.forEach(order => {
            const isVisible = order.name.toLowerCase().includes(value);
            order.element.toggleClass("hide", !isVisible);
        });
    });
});