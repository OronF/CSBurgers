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
            <a href="#" type="button" class="order-btn">הוספה להזמנה</a>

        </div>
    
        </li>`);

        dishesList.append(newElement);
    }

    const appendMealsLi = (dish) => {
        const newElement = $(`<li id="${dish._id} class="nohide">

                <div class="card">
            <div class="row">
            
            <div class="col-md-4">
            <img src="${dish.picture}" class="card-img-top" alt="${dish.name}" id="picture">
        </div>
                <div class="col-md-8">
                    <h5 class="card-title title-color">${dish.name}</h5>
                    <p class="card-text"> ${dish.price}₪</p>
                    <p class="card-info"> ${dish.description}</p>

                </div>
            </div>
            <a href="#" type="button" class="order-btn">הוספה להזמנה</a>

        </div>

    
        </li>`);

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
            <a class="nameOfCategory" data-category-id="${category._id}" data-category-categorytype="${category.categorytype}" href="/menu#${category.name}">${category.name}</a>
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


    
  const kosherCheck = $('#kosherCheckbox'); 

kosherCheck.addEventListener('change', async function() {
    if (kosherCheck.checked) {
        try {
            const data = await $.ajax({
                url: "/api/dish",
                method: "GET",
                dataType: "json",
                contentType: 'application/json',
                data: {
                    kosher: true
                },
                success: function(dishes)
                {
                    dishesList.empty();
                    dishes.forEach(dish => {
                        appendDishesLi(dish);
                    });
                },
                error: function(error) {
                    console.error("Error finding data:", error);
                }
            });

            console.log(data);
        } catch (error) {
            console.error("AJAX request error:", error);
        }
    }
});

});

 function restrictInputToNumbers(event) {
    const input = event.target;
    const inputValue = input.value;
    const sanitizedValue = inputValue.replace(/[^\d]/g, ''); // Remove non-digit characters
    input.value = sanitizedValue;
  }
