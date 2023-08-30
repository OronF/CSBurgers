$(document).ready(function() {

    let users = [];
    let orders = [];

    const usersList =  $('.usersList');
    const ordersList =  $('.ordersList');
    const usersBtn = $('.users');
    const ordersBtn = $('.orders');

    const usersData = $('#usersData');
    const ordersData = $('#ordersData');

    const appendUserLi = (user) => {
        const newElement = $(`<li id="${user._id}">
        <div class="user-Section"> 
    
            <span type="button" class="userInfoButton" data-user-id="${user._id}">
                <i class="bi bi-chevron-down arrow" id="iconToClick-${user._id}"></i>
            </span>

            <span class="nameOfUser">${user.fname} ${user.lname}</span>

        </div>
        </li>`);

        newElement.find('.userInfoButton').on('click', async function() {
            const btn = $(this);
            const id = btn.attr('data-user-id');
            const icon = $(`#iconToClick-${id}`);
            const li = $(`#${id}`);

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

                let Order;

                data.orders.forEach(async (order_id) => {
                    await $.ajax({
                        url: `/api/order/${order_id}`,
                        method: "GET",
                        success: function(data) {
                            Order = data;
                        },
                        error: function(error) {
                            console.error(error);
                        }
                    });

                    appendOrderLi(Order, userOrdersList);
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
    }

    const renderUsers = (data) => {
        data.forEach(user => {
            appendUserLi(user);
            users.push({
                id: user._id,
                name: `${user.fname} ${user.lname}`,
                element: $(`#${user._id}`) // Assuming this is the ID of the user's list item
            });
        });
    };

    const appendOrderLi = (order, list) => {
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
                let user;

                await $.ajax({
                    url:`/api/user/${data.customerId}`,
                    method: "GET",
                    success: (data) => {
                        user = data;
                    },
                    error: (error) => {
                        console.log(error);
                    }
                });

                const newElement = $(`<div class="order-data-section" id="order-data-${id}">
                    <div class="order-data">
                        <div class="data">שם הלקוח: ${user.fname} ${user.lname}</div>
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

        list.append(newElement);

        orders.push({
            id: order._id,
            name: `${order.orderNumber}`,
            element: newElement
        });
    }

    const renderOrders = (data) => {
        data.forEach(order => {
            appendOrderLi(order, ordersList);
        });
    };

    $.ajax({
        url:"/api/user",
        method: "GET",
        success: (data) => {
            renderUsers(data);
        },
        error: (error) => {
            console.log(error);
        }
    });

    $.ajax({
        url:"/api/order",
        method: "GET",
        dataType: "json",
        contentType: 'application/json',
        data: {
            closed: true
        },
        success: (data) => {
            renderOrders(data);
        },
        error: (error) => {
            console.log(error);
        }
    });

    usersBtn.on('click', function() {
        if (usersData.hasClass('hide')) {
            usersData.removeClass('hide').addClass('nohide');
            ordersData.removeClass('nohide').addClass('hide');
        }
    });

    ordersBtn.on('click', function() {
        if (ordersData.hasClass('hide')) {
            ordersData.removeClass('hide').addClass('nohide');
            usersData.removeClass('nohide').addClass('hide');
        }
    });

    const searchUser = $('#searchUser');
    const searchOrder = $('#searchOrder');

    searchUser.on('input', function() {
        const value = searchUser.val().toLowerCase();

        users.forEach(user => {
            const isVisible = user.name.toLowerCase().includes(value);
            user.element.toggleClass("hide", !isVisible);
        });
    });

    searchOrder.on('input', function() {
        const value = searchOrder.val().toLowerCase();

        orders.forEach(order => {
            const isVisible = order.name.toLowerCase().includes(value);
            order.element.toggleClass("hide", !isVisible);
        });
    });

});