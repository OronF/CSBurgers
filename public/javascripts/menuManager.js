$(document).ready(async function() {

    const dishesList = $('.dishes-list');
    const mealsList = $('.meals-list');
    const categories = $('.categories');

    const dishesSection = $('#dishesSection');
    const mealsSection = $('#mealsSection');

    const putHideOnElement = (element) => {
        element.removeClass('nohide').addClass('hide');
    }

    const removeHideOnElement = (element) => {
        element.removeClass('hide').addClass('nohide');
    }

    const appendDishesLi = (dish) => {
        const newElement = $(`<li id="${dish._id}" class="nohide" data-dish-categoryId="${dish.categoryId}">
            <div class="card">
            <div class="row">
            <div class="col-md-4">
                    <img src="${dish.picture}" class="card-img-top" alt="${dish.name}" id="picture">
                </div>
                <div class="col-md-8" id="card-${dish._id}">
                    <div class="card-body">
                        <h5 class="card-title" id="title-${dish._id}">${dish.name}</h5>
                        <p class="card-text" id="text-${dish._id}"> ${dish.price}₪</p>
                        <p class="card-info" id="info-${dish._id}"> ${dish.description}</p>

                    </div>
                </div>
            </div>
            <div class="buttons">
                <button class="updateBtn" data-dish-id="${dish._id}"><i id="button-${dish._id}" class="bi bi-pencil-fill"></i></button>
                <button class="deleteBtn" data-dish-id="${dish._id}"><i class="bi bi-x-lg"></i></button>
            </div>
            <a href="#" type="button" class="order-btn">הוספה להזמנה</a>

        </div>
        </li>`);

        newElement.find('.deleteBtn').on('click', function() {
            const btn = $(this);
            const id = btn.attr('data-dish-id');

            $.ajax({
                url: `/api/dish/${id}`,
                method: "DELETE",
                success: function() {
                    $(`#${id}`).remove();
                },
                error: function(error) {
                    console.error("Error deleting data:", error);
                }
            });
        });

        newElement.find('.updateBtn').on('click', async function() {
            let Dish;
            const btn = $(this);
            const id = btn.attr('data-dish-id');

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

            if ($(`#button-${dish._id}`).hasClass('bi bi-pencil-fill')) {
                $(`#button-${dish._id}`).removeClass('bi bi-pencil-fill').addClass('bi bi-check-lg');

                $(`#title-${id}`).remove();
                $(`#text-${id}`).remove();
                $(`#info-${id}`).remove();

                $(`#card-${id}`).append(`<div class="inputs">
                    <input value="${Dish.name}" class="form-control" id="name-${id}">
                    <input value="${Dish.price}" class="form-control" id="price-${id}">
                    <input value="${Dish.description}" class="form-control" id="description-${id}">
                </div>`);

                
            } else {
                let newDish;

                const name = $(`#name-${id}`).val();
                const price = $(`#price-${id}`).val();
                const description = $(`#description-${id}`).val();

                await $.ajax({
                    url:`api/dish/${id}`,
                    method: "PUT",
                    dataType: "json",
                    contentType: 'application/json',
                    data: JSON.stringify({
                        name: name,
                        price: price,
                        categoryId: Dish.categoryId,
                        picture: Dish.picture,
                        description: description
                    }),
                    success: function(data) {
                        console.log("Data saved successfully:", data);
                        newDish = data;
                    },
                    error: function(error) {
                        console.error("Error saving data:", error);
                    }
                });

                $('.inputs').remove();

                $(`#card-${id}`).append(`
                    <h5 class="card-title" id="title-${newDish._id}">${newDish.name}</h5>
                    <p class="card-text" id="text-${newDish._id}"> ${newDish.price}₪</p>
                    <p class="card-info" id="info-${newDish._id}"> ${newDish.description}</p>
                `);

                $(`#button-${dish._id}`).removeClass('bi bi-check-lg').addClass('bi bi-pencil-fill');
            }
        });

        dishesList.append(newElement);
    }

    const appendMealsLi = (meal) => {
        const newElement = $(`<li id="${meal._id}" class="nohide" data-meal-categoryId="${meal.categoryId}">
        <div class="card">
        <div class="row">
        <div class="col-md-4">
                <img src="${meal.picture}" class="card-img-top" alt="${meal.name}" id="picture">
            </div>
            <div class="col-md-8" id="card-${meal._id}">
                <div class="card-body">
                    <h5 class="card-title" id="title-${meal._id}">${meal.name}</h5>
                    <p class="card-text" id="text-${meal._id}"> ${meal.price}₪</p>
                    <p class="card-info" id="info-${meal._id}"> ${meal.description}</p>

                </div>
            </div>
        </div>
        <div class="buttons">
            <button class="updateBtn" data-meal-id="${meal._id}"><i id="button-${meal._id}" class="bi bi-pencil-fill"></i></button>
            <button class="deleteBtn" data-meal-id="${meal._id}"><i class="bi bi-x-lg"></i></button>
        </div>
        <a href="#" type="button" class="order-btn">הוספה להזמנה</a>

    </div>
    </li>`);

        newElement.find('.deleteBtn').on('click', function() {
            const btn = $(this);
            const id = btn.attr('data-meal-id');

            $.ajax({
                url: `/api/meal/${id}`,
                method: "DELETE",
                success: function() {
                    $(`#${id}`).remove();
                },
                error: function(error) {
                    console.error("Error deleting data:", error);
                }
            });
        });

        newElement.find('.updateBtn').on('click', async function() {
            let Meal;
            const btn = $(this);
            const id = btn.attr('data-meal-id');

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

            if ($(`#button-${Meal._id}`).hasClass('bi bi-pencil-fill')) {
                $(`#button-${Meal._id}`).removeClass('bi bi-pencil-fill').addClass('bi bi-check-lg');

                $(`#title-${id}`).remove();
                $(`#text-${id}`).remove();
                $(`#info-${id}`).remove();

                $(`#card-${id}`).append(`<div class="inputs">
                    <input value="${Meal.name}" class="form-control" id="name-${id}">
                    <input value="${Meal.price}" class="form-control" id="price-${id}">
                    <input value="${Meal.description}" class="form-control" id="description-${id}">
                </div>`);

                
            } else {
                let newMeal;

                const name = $(`#name-${id}`).val();
                const price = $(`#price-${id}`).val();
                const description = $(`#description-${id}`).val();

                await $.ajax({
                    url:`api/meal/${id}`,
                    method: "PUT",
                    dataType: "json",
                    contentType: 'application/json',
                    data: JSON.stringify({
                        name: name,
                        price: price,
                        dishes: Meal.dishes,
                        categoryId: Meal.categoryId,
                        picture: Meal.picture,
                        description: description
                    }),
                    success: function(data) {
                        console.log("Data saved successfully:", data);
                        newMeal = data;
                    },
                    error: function(error) {
                        console.error("Error saving data:", error);
                    }
                });

                $('.inputs').remove();

                $(`#card-${id}`).append(`
                    <h5 class="card-title" id="title-${newMeal._id}">${newMeal.name}</h5>
                    <p class="card-text" id="text-${newMeal._id}"> ${newMeal.price}₪</p>
                    <p class="card-info" id="info-${newMeal._id}"> ${newMeal.description}</p>
                `);

                $(`#button-${Meal._id}`).removeClass('bi bi-check-lg').addClass('bi bi-pencil-fill');
            }
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
            <a class="nameOfCategory" data-category-id="${category._id}" data-category-categorytype="${category.categorytype}" href="/menuManager#${category.name}">${category.name}</a>
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

    const addingProduct = $('.addingProduct');
    const addbtn = $('.add-btn');

    addbtn.on('click', async function() {
        addbtn.remove();

        addingProduct.append(`<div class="inputs">
            <input placeholder="">
            <input placeholder="">
            <input placeholder="">
            <input placeholder="">
            <input placeholder="">
            <input placeholder="">
            <input placeholder="">
        </div>`);
    });

});