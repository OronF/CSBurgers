$(document).ready(async function() {
    const cookieValue = document.cookie;
    const decodedValue = decodeURIComponent(cookieValue);

    const errors = $('.errors');
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

        const formatOrderDate = (originalDate) => {
            const date = new Date(originalDate);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            
            return `${year}-${month}-${day}`;
        };

        

        newElement.find('.orderInfoButton').on('click', async function() {
            const btn = $(this);
            const id = btn.attr('data-order-id');
            const icon = $(`#iconToClick-${id}`);
            const li = $(`#${id}`);

            const appendOrdersDataLi = async (data) => {
                const formattedDate = formatOrderDate(data.orderDate);
            
                const newElement = $(`<div class="order-data-section" id="order-data-${id}">
                    <div class="order-data">
                        <div class="data">שם הלקוח: ${userData.fname} ${userData.lname}</div>
                        <div class="data">תאריך: ${formattedDate}</div>
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

    const deleteBtn = $('.delete-btn');

    deleteBtn.on('click', function() {
        $.ajax({
            url: `/api/user/${extractedContent}`,
            method: "DELETE",
            success: function() {
                window.location.href = "/logout";
            },
            error: function(error) {
                console.error(error);
            }
        });
    });

    const updatebtn = $('.update-btn');

    updatebtn.on('click', async function() {
        if ($(`#update-icon`).hasClass('bi bi-pencil-fill')) {
            $(`#update-icon`).removeClass('bi bi-pencil-fill').addClass('bi bi-check-lg').html("לשמירה");

            $(`#fname`).remove();
            $(`#lname`).remove();
            $(`#phoneNumber`).remove();

            $(`.info`).append(`<div class="inputs row">
            <span class="details">שם פרטי</span>
                <input value="${userData.fname}" class=" edit" id="fname-${extractedContent}">
                <span class="details">שם משפחה</span>
                <input value="${userData.lname}" class=" edit" id="lname-${extractedContent}">
                <span class="details">מספר טלפון</span>
                <input value="${userData.phoneNumber}" class="edit" onkeydown="phoneNumberFormatter()" id="phoneNumber-${extractedContent}">
            </div>`);  
        } else {
            const fname = $(`#fname-${extractedContent}`).val();
            const lname = $(`#lname-${extractedContent}`).val();
            const phoneNumber = $(`#phoneNumber-${extractedContent}`).val();

            if(fname && lname && phoneNumber) {

                if (fname.length > 12) {
                    errors.html('שם פרטי ארוך מידי');
                    errors.show();
                    return;
                } else {
                    for (let i = 0; i< fname.length; i++) {
                        const charCode = fname.charCodeAt(i);
        
                        if (charCode < 1488 || charCode > 1514) { 
                            errors.html('שם פרטי מכיל תווים לא בעברית');
                            errors.show();
                            return;
                        }
                    }
                }

                if (lname.length > 12) {
                    errors.html('שם משפחה ארוך מידי');
                    errors.show();
                    return;
                } else {
                    for (let i = 0; i< lname.length; i++) {
                        const charCode = lname.charCodeAt(i);
        
                        if (charCode < 1488 || charCode > 1514) { 
                            errors.html('שם משפחה מכיל תווים לא באנגלית');
                            errors.show();
                            return;
                        }
                    }
                }

                if (phoneNumber.length !== 14) {
                    errors.html('אורך לא חוקי של מספר');
                    errors.show();
                    return;
                } else {
                    for (let i = 0; i< phoneNumber.length; i++) {
                        if (phoneNumber[i] < '0' && phoneNumber[i] > '9' && phoneNumber[i] != " " && phoneNumber[i] != "-" && phoneNumber[i] != "(" && phoneNumber[i] != ")") { 
                            errors.html('הזנת מספר לא חוקי');
                            errors.show();
                            return;
                        }
                    }

                    let flag = 1;

                    await $.ajax({
                        url: "/api/user",
                        method: "GET",
                        success: function(data)
                        {
                            data.forEach(user => {
                                if (user._id != extractedContent) {
                                    if(user.phoneNumber === phoneNumber) {
                                        errors.show();
                                        errors.html("מספר טלפון זה כבר בשימוש במשתמש אחר");
                                        flag = 2;
                                    }
                                }
                            });
                        },
                        error: function(error) {
                            console.error("Error finding data",error);
                        }
                    });

                    if (flag === 2) {
                        flag = 1;
                        return;
                    }
                }

                await $.ajax({
                    url:`/api/user/${extractedContent}`,
                    method: "PUT",
                    dataType: "json",
                    contentType: 'application/json',
                    data: JSON.stringify({
                        fname: fname,
                        lname: lname,
                        orders: userData.orders,
                        phoneNumber: phoneNumber,
                        password: userData.password,
                        is_Manager: userData.is_Manager
                    }),
                    success: function(data) {
                        errors.hide();
                        console.log("Data saved successfully:", data);
                        userData = data;
                    },
                    error: function(error) {
                        console.error("Error saving data:", error);
                    }
                });
    
                $(`.inputs`).remove();
    
                $(`.info`).append(`
                    <p class="SomeInfo" id = "fname">שם פרטי: ${fname}</p>
                    <p class="SomeInfo" id = "lname">שם משפחה: ${lname}</p>
                    <p class="SomeInfo" id = "phoneNumber">מספר טלפון: ${phoneNumber}</p>
                `);
    
                $(`#update-icon`).removeClass('bi bi-check-lg').addClass('bi bi-pencil-fill');
            } else {
                errors.show();
                errors.html('לא הזנת את כל הפרטים');
            }
        }
    
    });

    const framework = $('#framework');

    framework.append(`<option disabled selected class="text-blue-600/100">שם הסניף</option>`);

    let index = 1;

    const createSelection = (branch) => {
        framework.append(`<option value="${index}" data-branch-id="${branch._id}">${branch.name}</option>`);
        index++;
    }

    const render = (data) => {
        data.forEach(branch => {
            createSelection(branch);
        });
    }

    $.ajax({
        url: "/api/branch",
        method: "GET",
        success: (data) => {
            render(data);
        },
        error: (error) => {
            console.log(error);
        }   
    });

    const numOfProduct = $('#numOfProduct');
    const priceSelect = $('#priceSelect');

    let numOfProductVal;
    let priceSelectVal;
    let frameworkVal;

    numOfProduct.on('change', function() {
        numOfProductVal = numOfProduct.find(':selected').val();
        filterOrdersOfUser();
    });

    priceSelect.on('change', function() {
        priceSelectVal = priceSelect.find(':selected').val();
        filterOrdersOfUser();
    });

    framework.on('change', function() {
        frameworkVal = framework.find(':selected').attr('data-branch-id');
        filterOrdersOfUser();
    });

    function filterOrdersOfUser () {
        if (numOfProductVal || priceSelectVal || frameworkVal) {
            $.ajax({
                url: "/api/order",
                method: "GET",
                dataType: "json",
                contentType: 'application/json',
                data: {
                    numOfProducts: numOfProductVal,
                    price: priceSelectVal,
                    branch: frameworkVal,
                    userID: extractedContent
                },
                success: function (data) {
                    ordersList.empty();
    
                    data.forEach(order => {
                        appendOrderLi(order);
                    });
                },
                error: function (error) {
                    console.error(error);
                }
            });
        }
    }
    
});