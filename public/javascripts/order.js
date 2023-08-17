$(document).ready(async function() {

    const dishesList = $('.dishes-list');
    const mealsList = $('.meals-list');
    const categories = $('.categories');

    const dishesSection = $('#dishesSection');
    const mealsSection = $('#mealsSection');

    const productsList = $('.products-list');

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
            if (productsList.length > 0) {
                productsList.empty();
            }

            const btn = $(this);
            const id = btn.attr('data-dish-id');

            let Dish;

            await $.ajax({
                url:`api/dish/${id}`,
                method: "GET",
                success: (data) => {
                    Dish = data;
                },
                error: (error) => {
                    console.log(error);
                }
            });

            let order;

            await $.ajax({
                url:`api/order/64d2a8c12fd6b3552f5dfcbd`,
                method: "GET",
                success: (data) => {
                    order = data;
                },
                error: (error) => {
                    console.log(error);
                }
            });

            order.dishes.push(Dish._id);

            await $.ajax({
                url: `api/order/64d2a8c12fd6b3552f5dfcbd`,
                method: 'PUT',
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify({
                    orderNumber: order.orderNumber,
                    orderDate: order.orderDate,
                    location: order.location,
                    totalprice: order.totalprice,
                    meals: order.meals,
                    dishes: order.dishes
                }),
                success: function(data) {
                    console.log("Data saved successfully:", data);
                    newOrder = data;
                },
                error: function(error) {
                    console.error("Error saving data:", error);
                }
            });

            let name;

            await $.ajax({
                url:`api/order/64d2a8c12fd6b3552f5dfcbd`,
                method: "GET",
                dataType: "json",
                contentType: 'application/json',
                data: {
                    group: true
                },
                success: function(data) {
                    data.forEach(async (dishes) => {
                        

                        await $.ajax({
                            url: `api/dish/${dishes._id}`,
                            method: 'GET',
                            success: (dataDish) => {
                                name = dataDish.name;
                            },
                            error: (error) => {
                                console.log(error);
                            }
                        });

                        productsList.append(`<li><span>${name}</span><span>${dishes.count}</span></li>`);
                    })
                },
                error: function(error) {
                    console.error("Error saving data:", error);
                }
            });

        
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
            if (productsList.length > 0) {
                productsList.empty();
            }

            const btn = $(this);
            const id = btn.attr('data-meal-id');

            let Meal;

            await $.ajax({
                url:`api/meal/${id}`,
                method: "GET",
                success: (data) => {
                    Meal = data;
                },
                error: (error) => {
                    console.log(error);
                }
            });

            let order;

            await $.ajax({
                url:`api/order/64d2a8c12fd6b3552f5dfcbd`,
                method: "GET",
                success: (data) => {
                    order = data;
                },
                error: (error) => {
                    console.log(error);
                }
            });

            order.meals.push(Meal._id);

            await $.ajax({
                url: `api/order/64d2a8c12fd6b3552f5dfcbd`,
                method: 'PUT',
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify({
                    orderNumber: order.orderNumber,
                    orderDate: order.orderDate,
                    location: order.location,
                    totalprice: order.totalprice,
                    meals: order.meals,
                    dishes: order.dishes
                }),
                success: function(data) {
                    console.log("Data saved successfully:", data);
                    newOrder = data;
                },
                error: function(error) {
                    console.error("Error saving data:", error);
                }
            });

            let name;

            await $.ajax({
                url:`api/order/64d2a8c12fd6b3552f5dfcbd`,
                method: "GET",
                dataType: "json",
                contentType: 'application/json',
                data: {
                    group: true,
                    meals: true
                },
                success: function(data) {
                    data.forEach(async (meals) => {
                        

                        await $.ajax({
                            url: `api/meal/${meals._id}`,
                            method: 'GET',
                            success: (dataMeal) => {
                                name = dataMeal.name;
                            },
                            error: (error) => {
                                console.log(error);
                            }
                        });

                        productsList.append(`<li><span>${name}</span><span>${meals.count}</span></li>`);
                    })
                },
                error: function(error) {
                    console.error("Error saving data:", error);
                }
            });

        
        });
        mealsList.append(newElement);
    }

    /*const renderDishes = (data) => {
        data.forEach(dish => {
            appendDishesLi(dish);
        });
    }*/

    const renderMeals = (data) => {
        data.forEach(dish => {
            appendMealsLi(dish);
        });
    }

    const appendCategoryLi = (category) => {
        const newElement = $(`<li id="${category._id}" class="li-category" type="button">
            <a class="nameOfCategory" id="${category._id}" data-category-id="${category._id}" data-category-categorytype="${category.categorytype}" href="/order#${category.name}">${category.name}</a>
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

    /*$.ajax({
        url:"/api/dish",
        method: "GET",
        success: (data) => {
            renderDishes(data);
        },
        error: (error) => {
            console.log(error);
        }
    });*/

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
});