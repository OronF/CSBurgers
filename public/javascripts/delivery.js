$(document).ready(async function() {

    const deleteOrderBtn = $('.deleteLastOrder');
    const returnOrderBtn = $('.recreateLastOrder');

    deleteOrderBtn.hide();
    returnOrderBtn.hide();

    const errors = $('.errors');

    const cookieValue = document.cookie;
    const decodedValue = decodeURIComponent(cookieValue);

    const matches = decodedValue.match(/"([^"]+)"/);
    const extractedContent = matches ? matches[1] : null;

    const framework = $('#framework');
    const branches = $('#branches');

    framework.append(`<option disabled selected class="text-blue-600/100">שם הסניף</option>`);
    branches.append(`<option disabled selected class="text-blue-600/100">שם הסניף</option>`);

    let index = 1;
    let order;
    let user;

    await $.ajax({
        url: `/api/user/${extractedContent}`,
        method: "GET",
        success: function(data) {
            user = data;
        },
        error: function(error) {
            console.error("Error saving data:", error);
        }
    });

    const createSelection = (branch) => {
        framework.append(`<option value="${index}" data-branch-id="${branch._id}">${branch.name}</option>`);
        branches.append(`<option value="${index}" data-branch-id="${branch._id}">${branch.name}</option>`);
        index++;
    }

    const render = (data) => {
        data.forEach(branch => {
            createSelection(branch);
        });
    }

    $('#first-btn').on('click', async function() {
        const city = $('#city').val();
        const street = $('#street').val();
        const houseNum = $('#houseNum').val();
        const framework = $('#framework').find(":selected").attr('data-branch-id');

        if (city && street && houseNum && framework) {
            if (city.length > 14) {
                errors.html('שם העיר ארוך מידי');
                errors.show();
                return;
            } else {
                for (let i = 0; i< city.length; i++) {
                    const charCode = city.charCodeAt(i);
    
                    if ((charCode < 1488 || charCode > 1514) && city[i] !== ' ') { 
                        errors.html('שם העיר מכיל תווים לא בעברית');
                        errors.show();
                        return;
                    }
                }
            }

            if (street.length > 14) {
                errors.html('שם הרחוב ארוך מידי');
                errors.show();
                return;
            } else {
                for (let i = 0; i< street.length; i++) {
                    const charCode = street.charCodeAt(i);
    
                    if ((charCode < 1488 || charCode > 1514) && street[i] !== ' ') { 
                        errors.html('שם הרחוב מכיל תווים לא בעברית');
                        errors.show();
                        return;
                    }
                }
            }

            if (houseNum.length > 3) {
                errors.html('מספר הדירה ארוך מידי');
                errors.show();
                return;
            } else {
                for (let i = 0; i < houseNum.length; i++) {
                    if (houseNum[i] < '0' || houseNum[i] > '9') { 
                        errors.html('מספר הדירה מכיל תווים שהם לא מספרים');
                        errors.show();
                        return;
                    }
                }
            }

            await $.ajax({
                url: "/api/order",
                method: "POST",
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify({
                    orderNumber: Math.floor(Math.random() * 1000000),
                    orderDate: Date.now,
                    location: `${city}, ${street}, ${houseNum}`,
                    totalprice: 15,
                    meals: [],
                    dishes: [],
                    branch: framework,
                    customerId: extractedContent,
                    closed: false
                }),
                success: function(data) {
                    order = data;
                },
                error: function(error) {
                    console.error(error);
                }
            });  
            
            await $.ajax({
                url: `/api/user/${user._id}`,
                method: "PUT",
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify({
                    fname: user.fname,
                    lname: user.lname,
                    orders: user.orders,
                    phoneNumber: user.phoneNumber,
                    password: user.password,
                    is_Manager: user.is_Manager,
                    currentOrder: order._id
                }),
                success: function(data) {
                    errors.hide();
                    window.location.href = `orders/${order._id}`;
                },
                error: function(error) {
                    console.error("Error saving data:", error);
                }
            }); 
        } else {
            errors.show();
            errors.html('לא הזנת את כל הפרטים');
        }
    });

    $('#second-btn').on('click', async function() {
        const branchID = $('#branches').find(":selected").attr('data-branch-id');

        if (branchID) {

            let branch;

            await $.ajax({
                url: `/api/branch/${branchID}`,
                method: "GET",
                success: function(data) {
                    branch = data;
                },
                error: function(error) {
                    console.error(error);
                }
            });

            await $.ajax({
                url: "/api/order",
                method: "POST",
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify({
                    orderNumber: Math.floor(Math.random() * 1000000),
                    orderDate: Date.now,
                    location: `${branch.address}`,
                    totalprice: 5,
                    meals: [],
                    dishes: [],
                    branch: branchID,
                    customerId: extractedContent,
                    closed: false
                }),
                success: function(data) {
                    order = data;
                },
                error: function(error) {
                    console.error(error);
                }
            });  
            
            $.ajax({
                url: `/api/user/${user._id}`,
                method: "PUT",
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify({
                    fname: user.fname,
                    lname: user.lname,
                    orders: user.orders,
                    phoneNumber: user.phoneNumber,
                    password: user.password,
                    is_Manager: user.is_Manager,
                    currentOrder: order._id
                }),
                success: function (data) {
                    window.location.href = `orders/${order._id}`;
                },
                error: function(error) {
                    console.error("Error saving data:", error);
                }
            }); 
        }
    });

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

    if (extractedContent) {
        if (user.currentOrder) {
            await $.ajax({
                url: `/api/order/${user.currentOrder}`,
                method: "GET",
                success: function(data) {
                    order = data;
                },
                error: function(error) {
                    console.error(error);
                }
            });
        
            if (!order.closed) {
                deleteOrderBtn.show();
                returnOrderBtn.show();
    
                returnOrderBtn.on('click', function() {
                    window.location.href = `orders/${user.currentOrder}`;
                });
        
                deleteOrderBtn.on('click', async function() {
                    await $.ajax({
                        url: `/api/order/${user.currentOrder}`,
                        method: "DELETE",
                        success: function(data) {
                            window.location.href = "/";
                        }, 
                        error: function(error) {
                            console.error(error);
                        }
                    });
                });
            }
        }
    }
});