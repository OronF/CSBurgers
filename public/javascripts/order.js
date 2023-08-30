$(document).ready(async function() {

    const params = window.location.pathname;
    const pathParts = params.split('/');
    const orderID = pathParts[pathParts.length - 1];

    const cookieValue = document.cookie;
    const decodedValue = decodeURIComponent(cookieValue);

    const matches = decodedValue.match(/"([^"]+)"/);
    const extractedContent = matches ? matches[1] : null;


    let order;

    await $.ajax({
        url: `/api/order/${orderID}`,
        method: "GET",
        success: function(data) {
            order = data;
        },
        error: function(error) {
            console.log(error);
        }
    });

    const dishesList = $('.dishes-list');
    const mealsList = $('.meals-list');
    const categories = $('.categories');

    const dishesSection = $('#dishesSection');
    const mealsSection = $('#mealsSection');

    const mealsproductsList = $('.meals-products-list');
    const dishesproductsList = $('.dishes-products-list');

    const orderPrice = $('#order-price');
    const totalPrice = $('#total-price');
    const branch = $('#branch');
    const delivery = $('#delivery');
    const TotalPricePayPage = $('#PriceInPayPage');
    const Confirmationofpurchase = $('#Confirmation-of-purchase');

    const putHideOnElement = (element) => {
        element.removeClass('nohide').addClass('hide');
    }

    const removeHideOnElement = (element) => {
        element.removeClass('hide').addClass('nohide');
    }

    const appendDishesLi = (dish, list) => {
        const newElement = $(`<li id="${dish._id} class="nohide" data-dish-categoryId="${dish.categoryId}">
            <div class="card">
            <div class="row">
            <div class="col-md-4">
                    <img src="${dish.picture}" class="card-img-top" alt="${dish.name}" id="picture">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${dish.name}</h5>
                        <p class="card-text"> ${dish.price}₪</p>
                        <p class="card-info"> ${dish.description}</p>

                    </div>
                </div>
            </div>
            <button type="button" class="order-btn" id="order-btn-${dish._id}" data-dish-id="${dish._id}">הוספה להזמנה</button>

        </div>
    
        </li>`);

        newElement.find(`#order-btn-${dish._id}`).on('click', async function() {
            if (dishesproductsList.length > 0) {
                dishesproductsList.empty();
            }

            const btn = $(this);
            const id = btn.attr('data-dish-id');

            let Dish;

            await $.ajax({
                url: `/api/dish/${id}`,
                method: "GET",
                success: function(data) {
                    Dish = data;
                },
                error: function(error) {
                    console.log(error);
                }
            });

            order.dishes.push(Dish._id);

            await $.ajax({
                url: `/api/order/${orderID}`,
                method: "PUT",
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify({
                    orderNumber: order.orderNumber,
                    orderDate: order.orderDate,
                    location: order.location, 
                    totalprice: order.totalprice + Dish.price,
                    meals: order.meals,
                    dishes: order.dishes,
                    branch: order.branch,
                    closed: false,
                    customerId: order.customerId
                }),
                success: function(data) {
                    order = data;
                },
                error: function(error) {
                    console.error("Error saving data:", error);
                }
            });

            let names;

            await $.ajax({
                url: `/api/order/${orderID}`,
                method: "GET",
                dataType: "json",
                contentType: 'application/json',
                data: {
                    group: true
                },
                success: function(data) {
                   names = data;
                },
                error: function(error) {
                    console.error("Error saving data:", error);
                }
            });

            let name;

            names.forEach(async (dishes) => {
                await $.ajax({
                    url: `/api/dish/${dishes._id}`,
                    method: "GET",
                    success: function(data) {
                        name = data.name;
                    },
                    error: function(error) {
                        console.error(error);
                    }
                });
                
                const newElementDish = $(`<li>
                <span class="dish-name">${name}</span>
                <span class="dish-count">${dishes.count}</span>
                <div class="dishes-btn">
                    <i class="bi bi-plus-circle-fill" id="iconToClick-${dishes._id}"></i>
                    <i class="bi bi-dash-circle-fill" id="iconToRemove-${dishes._id}"></i>
                </div>
                </li>`);

                newElementDish.find(`#iconToClick-${dishes._id}`).on('click', async function() {
                    let Dish;

                    await $.ajax({
                        url: `/api/dish/${dishes._id}`,
                        method: "GET",
                        success: function(data) {
                            Dish = data;
                        },
                        error: function(error) {
                            console.error(error);
                        }
                    });

                    order.dishes.push(Dish._id);

                        await $.ajax({
                            url: `/api/order/${orderID}`,
                            method: "PUT",
                            dataType: "json",
                            contentType: 'application/json',
                            data: JSON.stringify({
                            orderNumber: order.orderNumber,
                            orderDate: order.orderDate,
                            location: order.location, 
                            totalprice: order.totalprice + Dish.price,
                            meals: order.meals,
                            dishes: order.dishes,
                            branch: order.branch,
                            closed: false,
                            customerId: order.customerId
                        }),
                        success: function(data) {
                            order = data;
                            dishesproductsList.empty();
                            refreshDish();
                        },
                        error: function(error) {
                            console.error("Error saving data:", error);
                        }
                    });
                });

                newElementDish.find(`#iconToRemove-${dishes._id}`).on('click', async function() {
                    let Dish;

                    await $.ajax({
                        url: `/api/dish/${dishes._id}`,
                        method: "GET",
                        success: function(data) {
                            Dish = data;
                        },
                        error: function(error) {
                            console.error(error);
                        }
                    });

                    for (let i = 0; i < order.dishes.length; i++) {
                        if(order.dishes[i] === dishes._id) {
                            order.dishes.splice(i, 1);
                            break;
                        }
                    }

                        await $.ajax({
                            url: `/api/order/${orderID}`,
                            method: "PUT",
                            dataType: "json",
                            contentType: 'application/json',
                            data: JSON.stringify({
                            orderNumber: order.orderNumber,
                            orderDate: order.orderDate,
                            location: order.location, 
                            totalprice: order.totalprice - Dish.price,
                            meals: order.meals,
                            dishes: order.dishes,
                            branch: order.branch,
                            closed: false,
                            customerId: order.customerId
                        }),
                        success: function(data) {
                            order = data;
                            dishesproductsList.empty();
                            refreshDish();
                        },
                        error: function(error) {
                            console.error("Error saving data:", error);
                        }
                    });
                });

                dishesproductsList.append(newElementDish);
            });

            orderPrice.html(`מחיר הזמנה: ${order.totalprice - 15}₪`);
            totalPrice.html(`מחיר כללי: ${order.totalprice}₪`);
            TotalPricePayPage.html(`סה"כ לתשלום: ${order.totalprice}₪`);
        });

        list.append(newElement);
    }

    const appendMealsLi = (meal) => {
        const newElement = $(`<li id="${meal._id} class="nohide">

                <div class="card">
            <div class="row">
            
            <div class="col-md-4">
            <img src="${meal.picture}" class="card-img-top" alt="${meal.name}" id="picture">
        </div>
                <div class="col-md-8">
                    <h5 class="card-title title-color">${meal.name}</h5>
                    <p class="card-text"> ${meal.price}₪</p>
                    <p class="card-info"> ${meal.description}</p>

                </div>
            </div>
            <button type="button" class="order-btn" id="order-btn-${meal._id}" data-meal-id="${meal._id}">הוספה להזמנה</button>

        </div>

    
        </li>`);

        newElement.find(`#order-btn-${meal._id}`).on('click', async function() {
            if (mealsproductsList.length > 0) {
                mealsproductsList.empty();
            }

            const btn = $(this);
            const id = btn.attr('data-meal-id');

            let Meal;

            await $.ajax({
                url: `/api/meal/${id}`,
                method: "GET",
                success: function(data) {
                    Meal = data;
                },
                error: function(error) {
                    console.log(error);
                }
            });

            order.meals.push(Meal._id);

            await $.ajax({
                url: `/api/order/${orderID}`,
                method: "PUT",
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify({
                    orderNumber: order.orderNumber,
                    orderDate: order.orderDate,
                    location: order.location, 
                    totalprice: order.totalprice + Meal.price,
                    meals: order.meals,
                    dishes: order.dishes,
                    branch: order.branch,
                    closed: false,
                    customerId: order.customerId
                }),
                success: function(data) {
                    order = data;
                },
                error: function(error) {
                    console.error("Error saving data:", error);
                }
            });

            let names;

            await $.ajax({
                url: `/api/order/${orderID}`,
                method: "GET",
                dataType: "json",
                contentType: 'application/json',
                data: {
                    group: true,
                    meals: true
                },
                success: function(data) {
                   names = data;
                },
                error: function(error) {
                    console.error("Error saving data:", error);
                }
            });

            let name;

            names.forEach(async (meals) => {
                await $.ajax({
                    url: `/api/meal/${meals._id}`,
                    method: "GET",
                    success: function(data) {
                        name = data.name;
                    },
                    error: function(error) {
                        console.error(error);
                    }
                });

                const newElementMeal = $(`<li>
                <span class="meal-name">${name}</span>
                <span class="meal-count">${meals.count}</span>
                <div class="meals-btn">
                    <i class="bi bi-plus-circle-fill" id="iconToClick-${meals._id}"></i>
                    <i class="bi bi-dash-circle-fill" id="iconToRemove-${meals._id}"></i>
                </div>
                </li>`);

                newElementMeal.find(`#iconToClick-${meals._id}`).on('click', async function() {
                    let Meal;

                    await $.ajax({
                        url: `/api/meal/${meals._id}`,
                        method: "GET",
                        success: function(data) {
                            Meal = data;
                        },
                        error: function(error) {
                            console.error(error);
                        }
                    });

                    order.meals.push(Meal._id);

                        await $.ajax({
                            url: `/api/order/${orderID}`,
                            method: "PUT",
                            dataType: "json",
                            contentType: 'application/json',
                            data: JSON.stringify({
                            orderNumber: order.orderNumber,
                            orderDate: order.orderDate,
                            location: order.location, 
                            totalprice: order.totalprice + Meal.price,
                            meals: order.meals,
                            dishes: order.dishes,
                            branch: order.branch,
                            closed: false,
                            customerId: order.customerId
                        }),
                        success: function(data) {
                            order = data;
                            mealsproductsList.empty();
                            refreshMeals();
                        },
                        error: function(error) {
                            console.error("Error saving data:", error);
                        }
                    });
                });

                newElementMeal.find(`#iconToRemove-${meals._id}`).on('click', async function() {
                    let Meal;

                    await $.ajax({
                        url: `/api/meal/${meals._id}`,
                        method: "GET",
                        success: function(data) {
                            Meal = data;
                        },
                        error: function(error) {
                            console.error(error);
                        }
                    });

                    for (let i = 0; i < order.meals.length; i++) {
                        if(order.meals[i] === meals._id) {
                            order.meals.splice(i, 1);
                            break;
                        }
                    }
                        await $.ajax({
                            url: `/api/order/${orderID}`,
                            method: "PUT",
                            dataType: "json",
                            contentType: 'application/json',
                            data: JSON.stringify({
                            orderNumber: order.orderNumber,
                            orderDate: order.orderDate,
                            location: order.location, 
                            totalprice: order.totalprice - Meal.price,
                            meals: order.meals,
                            dishes: order.dishes,
                            branch: order.branch,
                            closed: false,
                            customerId: order.customerId
                        }),
                        success: function(data) {
                            order = data;
                            mealsproductsList.empty();
                            refreshMeals();
                        },
                        error: function(error) {
                            console.error("Error saving data:", error);
                        }
                    });
                });
                
                mealsproductsList.append(newElementMeal);
            });

            orderPrice.html(`מחיר הזמנה: ${order.totalprice - 15}₪`);
            totalPrice.html(`מחיר כללי: ${order.totalprice}₪`);
            TotalPricePayPage.html(`סה"כ לתשלום: ${order.totalprice}₪`);
        });
        mealsList.append(newElement);
    }

    const renderMeals = (data) => {
        data.forEach(dish => {
            appendMealsLi(dish);
        });
    }

    const appendCategoryLi = (category) => {
        

        const newElement = $(`<li id="${category._id}" class="li-category" type="button">
            <a class="nameOfCategory" id="${category._id}" data-category-id="${category._id}" data-category-categorytype="${category.categorytype}" href="${orderID}#${category.name}">${category.name}</a>
        </li>`);

        newElement.find('.nameOfCategory').on('click', async function() {
            const btn = $(this);
            const id = btn.attr('data-category-id');
            const categorytype = btn.attr('data-category-categorytype');

            if (categorytype === "meal") {
                if (mealsSection.hasClass('hide')) {
                    removeHideOnElement(mealsSection);
                    putHideOnElement(dishesSection);
                }

                mealsList.empty();

                let meals;
    
                await $.ajax({
                    url:"/api/meal",
                    method: "GET",
                    dataType: "json",
                    contentType: 'application/json',
                    data: {
                        categoryId: id
                    },
                    success: function(data) {
                        meals = data;
                    },
                    error: function(error) {
                        console.error("Error finding data:", error);
                    }
                });
    
                meals.forEach(meal => {
                    appendMealsLi(meal);
                });
            } else if (categorytype === "dish") {

                if (dishesSection.hasClass('hide')) {
                    removeHideOnElement(dishesSection);
                    putHideOnElement(mealsSection);
                }

                dishesList.empty();

                let dishes;
    
                await $.ajax({
                    url:"/api/dish",
                    method: "GET",
                    dataType: "json",
                    contentType: 'application/json',
                    data: {
                        categoryId: id
                    },
                    success: function(data) {
                        dishes = data;
                    },
                    error: function(error) {
                        console.error("Error finding data:", error);
                    }
                });
    
                dishes.forEach(dish => {
                    appendDishesLi(dish, dishesList);
                });
            }
        });

        categories.append(newElement);
    }

    const renderCategories = (data) => {
        data.forEach(category => {
            appendCategoryLi(category);
        });
    }

    $.ajax({
        url:"/api/category",
        method: "GET",
        success: (data) => {
            renderCategories(data);
        },
        error: (error) => {
            console.log(error);
        }
    });

    await $.ajax({
        url:"/api/meal",
        method: "GET",
        success: (data) => {
            renderMeals(data);
        },
        error: (error) => {
            console.log(error);
        }
    });

    await $.ajax({
        url:"/api/dish",
        method: "GET",
        success: (data) => {
            data.forEach(dish => {
                appendDishesLi(dish, mealsList);
            });
        },
        error: (error) => {
            console.log(error);
        }
    });

    let names;
    let name;
    
    const refreshMeals = async () =>  {
        if (mealsproductsList.length > 0) {
            await $.ajax({
                url: `/api/order/${orderID}`,
                method: "GET",
                dataType: "json",
                contentType: 'application/json',
                data: {
                    group: true,
                    meals: true
                },
                success: function(data) {
                   names = data;
                },
                error: function(error) {
                    console.error("Error saving data:", error);
                }
            });
        
            names.forEach(async (meals) => {
                await $.ajax({
                    url: `/api/meal/${meals._id}`,
                    method: "GET",
                    success: function(data) {
                        name = data.name;
                    },
                    error: function(error) {
                        console.error(error);
                    }
                })
                const newElement = $(`<li>
                <span class="meal-name">${name}</span>
                <span class="meal-count">${meals.count}</span>
                <div class="meals-btn">
                    <i class="bi bi-plus-circle-fill" id="iconToClick-${meals._id}"></i>
                    <i class="bi bi-dash-circle-fill" id="iconToRemove-${meals._id}"></i>
                </div>
                </li>`);
    
                newElement.find(`#iconToClick-${meals._id}`).on('click', async function() {
                    let Meal;

                    await $.ajax({
                        url: `/api/meal/${meals._id}`,
                        method: "GET",
                        success: function(data) {
                            Meal = data;
                        },
                        error: function(error) {
                            console.error(error);
                        }
                    });

                    order.meals.push(Meal._id);

                        await $.ajax({
                            url: `/api/order/${orderID}`,
                            method: "PUT",
                            dataType: "json",
                            contentType: 'application/json',
                            data: JSON.stringify({
                            orderNumber: order.orderNumber,
                            orderDate: order.orderDate,
                            location: order.location, 
                            totalprice: order.totalprice + Meal.price,
                            meals: order.meals,
                            dishes: order.dishes,
                            branch: order.branch,
                            closed: false,
                            customerId: order.customerId
                        }),
                        success: function(data) {
                            order = data;
                            mealsproductsList.empty();
                            refreshMeals();
                        },
                        error: function(error) {
                            console.error("Error saving data:", error);
                        }
                    });
                });

                newElement.find(`#iconToRemove-${meals._id}`).on('click', async function() {
                    console.log(4233);
                    let Meal;

                    await $.ajax({
                        url: `/api/meal/${meals._id}`,
                        method: "GET",
                        success: function(data) {
                            Meal = data;
                        },
                        error: function(error) {
                            console.error(error);
                        }
                    });

                    for (let i = 0; i < order.meals.length; i++) {
                        if(order.meals[i] === meals._id) {
                            order.meals.splice(i, 1);
                            break;
                        }
                    }
                        await $.ajax({
                            url: `/api/order/${orderID}`,
                            method: "PUT",
                            dataType: "json",
                            contentType: 'application/json',
                            data: JSON.stringify({
                            orderNumber: order.orderNumber,
                            orderDate: order.orderDate,
                            location: order.location, 
                            totalprice: order.totalprice - Meal.price,
                            meals: order.meals,
                            dishes: order.dishes,
                            branch: order.branch,
                            closed: false,
                            customerId: order.customerId
                        }),
                        success: function(data) {
                            order = data;
                            mealsproductsList.empty();
                            refreshMeals();
                        },
                        error: function(error) {
                            console.error("Error saving data:", error);
                        }
                    });
                });

                mealsproductsList.append(newElement);
            });
        }
        orderPrice.html(`מחיר הזמנה: ${order.totalprice - 15}₪`);
        totalPrice.html(`מחיר כללי: ${order.totalprice}₪`);
        TotalPricePayPage.html(`סה"כ לתשלום: ${order.totalprice}₪`);
    } 

    refreshMeals();

    const refreshDish = async () =>  {
        if (dishesproductsList.length > 0) {
            await $.ajax({
                url: `/api/order/${orderID}`,
                method: "GET",
                dataType: "json",
                contentType: 'application/json',
                data: {
                    group: true
                },
                success: function(data) {
                   names = data;
                },
                error: function(error) {
                    console.error("Error saving data:", error);
                }
            });
        
            names.forEach(async (dishes) => {
                await $.ajax({
                    url: `/api/dish/${dishes._id}`,
                    method: "GET",
                    success: function(data) {
                        name = data.name;
                    },
                    error: function(error) {
                        console.error(error);
                    }
                });

                const newElement = $(`<li>
                <span class="dish-name">${name}</span>
                <span class="dish-count">${dishes.count}</span>
                <div class="dishes-btn">
                    <i class="bi bi-plus-circle-fill" id="iconToClick-${dishes._id}"></i>
                    <i class="bi bi-dash-circle-fill" id="iconToRemove-${dishes._id}"></i>
                </div>
                </li>`);

                newElement.find(`#iconToClick-${dishes._id}`).on('click', async function() {
                    let Dish;

                    await $.ajax({
                        url: `/api/dish/${dishes._id}`,
                        method: "GET",
                        success: function(data) {
                            Dish = data;
                        },
                        error: function(error) {
                            console.error(error);
                        }
                    });

                    order.dishes.push(Dish._id);

                        await $.ajax({
                            url: `/api/order/${orderID}`,
                            method: "PUT",
                            dataType: "json",
                            contentType: 'application/json',
                            data: JSON.stringify({
                            orderNumber: order.orderNumber,
                            orderDate: order.orderDate,
                            location: order.location, 
                            totalprice: order.totalprice + Dish.price,
                            meals: order.meals,
                            dishes: order.dishes,
                            branch: order.branch,
                            closed: false,
                            customerId: order.customerId
                        }),
                        success: function(data) {
                            order = data;
                            dishesproductsList.empty();
                            refreshDish();
                        },
                        error: function(error) {
                            console.error("Error saving data:", error);
                        }
                    });
                });

                newElement.find(`#iconToRemove-${dishes._id}`).on('click', async function() {
                    let Dish;

                    await $.ajax({
                        url: `/api/dish/${dishes._id}`,
                        method: "GET",
                        success: function(data) {
                            Dish = data;
                        },
                        error: function(error) {
                            console.error(error);
                        }
                    });

                    for (let i = 0; i < order.dishes.length; i++) {
                        if(order.dishes[i] === dishes._id) {
                            order.dishes.splice(i, 1);
                            break;
                        }
                    }
                        await $.ajax({
                            url: `/api/order/${orderID}`,
                            method: "PUT",
                            dataType: "json",
                            contentType: 'application/json',
                            data: JSON.stringify({
                            orderNumber: order.orderNumber,
                            orderDate: order.orderDate,
                            location: order.location, 
                            totalprice: order.totalprice - Dish.price,
                            meals: order.meals,
                            dishes: order.dishes,
                            branch: order.branch,
                            closed: false,
                            customerId: order.customerId
                        }),
                        success: function(data) {
                            order = data;
                            dishesproductsList.empty();
                            refreshDish();
                        },
                        error: function(error) {
                            console.error("Error saving data:", error);
                        }
                    });
                });

                dishesproductsList.append(newElement);
            });
        }
        orderPrice.html(`מחיר הזמנה: ${order.totalprice - 15}₪`);
        totalPrice.html(`מחיר כללי: ${order.totalprice}₪`);
        TotalPricePayPage.html(`סה"כ לתשלום: ${order.totalprice}₪`);
    }

    refreshDish();

    await $.ajax({
        url: `/api/branch/${order.branch}`,
        method: "GET",
        success: function(data) {
            branch.html(`סניף: ${data.name}`);
        },
        error: function(error) {
            console.error(error);
        }
    });

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

    Confirmationofpurchase.on('click', async function() {
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
                        currentOrder: undefined
                    }),
                    success: function(data) {
                        console.log('data is saved', data);
                    },
                    error: function(error) {
                        console.error("Error saving data:", error);
                    }
                });


        await $.ajax({
            url: `/api/order/${orderID}`,
            method: "PUT",
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify({
                orderNumber: order.orderNumber,
                orderDate: order.orderDate,
                location: order.location, 
                totalprice: order.totalprice,
                meals: order.meals,
                dishes: order.dishes,
                branch: order.branch,
                closed: true,
                customerId: order.customerId
            }),
            success: async function(data) {
                order = data;
                console.log('data is saved', data);
                user.orders.push(order._id);

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
                        currentOrder: user.currentOrder
                    }),
                    success: function(data) {
                        console.log('data is saved', data);
                    },
                     error: function(error) {
                        console.error("Error saving data:", error);
                    }
                });
            },
            error: function(error) {
                console.error("Error saving data:", error);
            }
        });
    });
    const errors = $('.errors');

    $('#Confirmation-of-purchase1').on('click', async function() {
        if ($('#creditCardOwnerName').val() && $('#creditCardNumber').val() && $('#creditCardPag').val() && $('#id').val() && $('#creditCardback').val()) {

            if ($('#id').val().length !== 9) {
                errors.html('תעודת זהות לא חוקית');
                errors.show();
                return;
            }

            if ($('#creditCardNumber').val().length !== 16) {
                errors.html('מספר כרטיס לא חוקי');
                errors.show();
                return;
            }

            if ($('#creditCardback').val().length !== 4) {
                errors.html('הזנת כמות לא מתאימה של ספרות');
                errors.show();
                return;
            }

            if ($('#creditCardOwnerName').val().length > 8) {
                errors.html('שם ארוך מידי');
                errors.show();
                return;
            } else {
                for (let i = 0; i< $('#creditCardOwnerName').val().length; i++) {
                    const charCode = $('#creditCardOwnerName').val().charCodeAt(i);
    
                    if (charCode < 1488 || charCode > 1514) { 
                        errors.html('שם מכיל תווים לא בעברית');
                        errors.show();
                        return;
                    }
                }
            }

            await $.ajax({
                url: `/api/order/${orderID}`,
                method: "PUT",
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify({
                    orderNumber: order.orderNumber,
                    orderDate: order.orderDate,
                    location: order.location, 
                    totalprice: order.totalprice,
                    meals: order.meals,
                    dishes: order.dishes,
                    branch: order.branch,
                    closed: true,
                    customerId: order.customerId
                }),
                success: function(data) {
                    order = data;
                    console.log('data is saved', data);
                },
                error: function(error) {
                    console.error("Error saving data:", error);
                }
            });
    
            user.orders.push(order._id);
    
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
                    currentOrder: user.currentOrder
                }),
                success: function(data) {
                    console.log('data is saved', data);
                    errors.hide();
                    $('#FinishPayModal').modal('show');
                },
                error: function(error) {
                    console.error("Error saving data:", error);
                }
            });
        } else {
            errors.html('לא הזנת את כל הפרטים');
            errors.show();
        }
    });

    $('#FinishPayModal').on('hide.bs.modal', function() {
        window.location.href = "/";
    });
    
    delivery.html(`משלוח ל: ${order.location}`);
});