$(document).ready(async function() {

    const params = window.location.pathname;
    const pathParts = params.split('/');
    const orderID = pathParts[pathParts.length - 1];

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

    const putHideOnElement = (element) => {
        element.removeClass('nohide').addClass('hide');
    }

    const removeHideOnElement = (element) => {
        element.removeClass('hide').addClass('nohide');
    }

    const appendDishesLi = (dish) => {
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
                    dishes: order.dishes
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

                dishesproductsList.append(`<li><span>${name}</span><span>${dishes.count}</span></li>`);
            });

            orderPrice.html(`מחיר הזמנה: ${order.totalprice - 15}₪`);
            totalPrice.html(`מחיר כללי: ${order.totalprice}₪`);
        });

        dishesList.append(newElement);
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
                    dishes: order.dishes
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

                mealsproductsList.append(`<li><span>${name}</span><span>${meals.count}</span></li>`);
            });

            orderPrice.html(`מחיר הזמנה: ${order.totalprice - 15}₪`);
            totalPrice.html(`מחיר כללי: ${order.totalprice}₪`);
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
            <a class="nameOfCategory" id="${category._id}" data-category-id="${category._id}" data-category-categorytype="${category.categorytype}" href="/orders/${orderID}#${category.name}">${category.name}</a>
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
                    appendDishesLi(dish);
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

    $.ajax({
        url:"/api/meal",
        method: "GET",
        dataType: "json",
        contentType: 'application/json',
        data: {
            categoryId: "64d0f4bcfdf8c926feae7c11"
        },
        success: (data) => {
            renderMeals(data);
        },
        error: (error) => {
            console.log(error);
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
        })
        dishesproductsList.append(`<li><span>${name}</span><span>${dishes.count}</span></li>`);
    });

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
        mealsproductsList.append(`<li><span>${name}</span><span>${meals.count}</span></li>`);
    });

    orderPrice.html(`מחיר הזמנה: ${order.totalprice - 15}₪`);
    totalPrice.html(`מחיר כללי: ${order.totalprice}₪`);

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
});