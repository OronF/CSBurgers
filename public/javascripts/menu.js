$(document).ready(async function() {

    const dishesList = $('.dishes-list');
    const mealsList = $('.meals-list');
    const categories = $('.categories');

    const dishesSection = $('#dishesSection');
    const mealsSection = $('#mealsSection');

    let categorytypeFilter;

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

        </div>
    
        </li>`);

        if (dish.webServiceId) {
            $.ajax({
                url: `https://world.openfoodfacts.org/api/v0/product/${dish.webServiceId}`,
                method: "GET",
                success: function(response) {
                    newElement.find('.card-body').append(`<p>ערך תזונתי: ${response.product.nutriments.energy_value} קלוריות</p>`);
                },
                error: function(error) {
                    console.error("Error finding data:", error);
                }
            });
        }

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

        </div>

        </li>`);

        if (meal.webServiceId) {
            $.ajax({
                url: `https://world.openfoodfacts.org/api/v0/product/${meal.webServiceId}`,
                method: "GET",
                success: function(response) {
                    newElement.find('.card-body').append(`<p>ערך תזונתי: ${response.product.nutriments.energy_value} קלוריות</p>`);
                },
                error: function(error) {
                    console.error("Error finding data:", error);
                }
            });
        }

        mealsList.append(newElement);
    }

    const renderDishes = (data) => {
        data.forEach(dish => {
            appendDishesLi(dish, mealsList);
        });
    }

    const renderMeals = (data) => {
        data.forEach(dish => {
            appendMealsLi(dish);
        });
    }

    let categoryIdForFilter;

    const appendCategoryLi = (category) => {
        const newElement = $(`<li id="${category._id}" class="li-category" type="button">
            <a class="nameOfCategory" id="${category._id}" data-category-id="${category._id}" data-category-categorytype="${category.categorytype}" href="/menu#${category.name}">${category.name}</a>
        </li>`);

        newElement.find('.nameOfCategory').on('click', async function() {
            const btn = $(this);
            const id = btn.attr('data-category-id');
            const categorytype = btn.attr('data-category-categorytype');
            categoryIdForFilter = id;

            if (categorytype === "meal") {
                categorytypeFilter = 'meal';
                console.log('categorytypeFilter1',categorytypeFilter);

                if (mealsSection.hasClass('hide')) {
                    removeHideOnElement(mealsSection);
                    putHideOnElement(dishesSection);
                }
                filterDishes();
            } else if (categorytype === "dish") {
                categorytypeFilter = 'dish';

                if (dishesSection.hasClass('hide')) {
                    removeHideOnElement(dishesSection);
                    putHideOnElement(mealsSection);
                }
                filterDishes();
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

    $.ajax({
        url:"/api/dish",
        method: "GET",
        success: (data) => {
            renderDishes(data);
        },
        error: (error) => {
            console.log(error);
        }
    });

    const kosherCheck = $("#kosher-check");
const maxPriceCheck = $("#maxprice-check");
const sortCheck = $(".sortby-check");
const priceInp = $("#priceInp");
const sortSelect = $("#sort-select");

kosherCheck.on('change', filterDishes);
maxPriceCheck.on('change', filterDishes);
sortCheck.on('change', filterDishes);
sortSelect.on('change', checkSelect);
priceInp.keyup(checkPriceInp);

function checkSelect(){
    if(sortCheck.is(":checked")) {
        filterDishes();
    }
}

function checkPriceInp()
{
    if(maxPriceCheck.is(":checked")) {
        filterDishes();
    }
}
    async function filterDishes()
    {
        console.log('categorytypeFilter:' ,categorytypeFilter);
        if(categorytypeFilter === 'dish' && ((sortCheck.is(':checked') == true && (sortSelect.val() === "מהמחיר הנמוך לגבוה" || sortSelect.val() === "מהמחיר הגבוה לנמוך")) || kosherCheck.is(":checked") == true ||  (maxPriceCheck.is(":checked") == true && priceInp.val() !== ""))){
                    console.log("in");
                console.log(kosherCheck.is("checked"));
                $.ajax({
                url: "/api/dish",
                method: "GET",
                dataType: "json",
                contentType: 'application/json',
                data: {
                    categoryId: categoryIdForFilter,
                    kosher: kosherCheck.is(":checked"),
                    sort: sortSelect.val(),
                    price: priceInp.val(),
                    priceB: maxPriceCheck.is(":checked"),
                    sortB: sortCheck.is(':checked')
                },
                success: function(dishes)
                {
                    dishesList.empty();
                    console.log(dishes);
                    dishes.forEach(dish => {
                        appendDishesLi(dish, dishesList);
                    });
                },
                error: function(error) {
                    console.error("Error finding data:", error);
                }
            });
    }
    else if (categorytypeFilter === 'dish')
    {
        $.ajax({
        url: "/api/dish",
        method: "GET",
        dataType: "json",
        contentType: 'application/json',
        data: {
            categoryId: categoryIdForFilter,
        },
        success: function(dishes)
        {
            dishesList.empty();
            console.log(dishes);
            dishes.forEach(dish => {
                appendDishesLi(dish, dishesList);
            });
        },
        error: function(error) {
            console.error("Error finding data:", error);
        }
    });
    } else if(categorytypeFilter === 'meal' && ((sortCheck.is(':checked') == true && (sortSelect.val() === "מהמחיר הנמוך לגבוה" || sortSelect.val() === "מהמחיר הגבוה לנמוך")) || kosherCheck.is(":checked") == true ||  (maxPriceCheck.is(":checked") == true && priceInp.val() !== ""))){
        console.log("infdhgfhgf");
    console.log(kosherCheck.is("checked"));
    $.ajax({
    url: "/api/meal",
    method: "GET",
    dataType: "json",
    contentType: 'application/json',
    data: {
        categoryId: categoryIdForFilter,
        kosher: kosherCheck.is(":checked"),
        sort: sortSelect.val(),
        price: priceInp.val(),
        priceB: maxPriceCheck.is(":checked"),
        sortB: sortCheck.is(':checked')
    },
    success: function(meals)
    {
        mealsList.empty();
        console.log(meals);
        meals.forEach(meal => {
            appendMealsLi(meal);
        });
    },
    error: function(error) {
        console.error("Error finding data:", error);
    }
});
}
else if (categorytypeFilter === 'meal')
{
    $.ajax({
        url: "/api/meal",
        method: "GET",
        dataType: "json",
        contentType: 'application/json',
        data: {
            categoryId: categoryIdForFilter,
        },
        success: function(meals)
        {
        mealsList.empty();
        console.log(meals);
            meals.forEach(meal => {
            appendMealsLi(meal);
        });
        },
        error: function(error) {
        console.error("Error finding data:", error);
        }
        });
        } else if(((sortCheck.is(':checked') == true && (sortSelect.val() === "מהמחיר הנמוך לגבוה" || sortSelect.val() === "מהמחיר הגבוה לנמוך")) || kosherCheck.is(":checked") == true ||  (maxPriceCheck.is(":checked") == true && priceInp.val() !== ""))){
            await $.ajax({
                url: "/api/meal",
                method: "GET",
                dataType: "json",
                contentType: 'application/json',
                data: {
                    kosher: kosherCheck.is(":checked"),
                    sort: sortSelect.val(),
                    price: priceInp.val(),
                    priceB: maxPriceCheck.is(":checked"),
                    sortB: sortCheck.is(':checked')
                },
                success: function(meals)
                {
                    mealsList.empty();
                    console.log(meals);
                    meals.forEach(meal => {
                        appendMealsLi(meal);
                    });
                },
                error: function(error) {
                    console.error("Error finding data:", error);
                }
            });

            
                console.log("in");
            console.log(kosherCheck.is("checked"));
            $.ajax({
            url: "/api/dish",
            method: "GET",
            dataType: "json",
            contentType: 'application/json',
            data: {
                kosher: kosherCheck.is(":checked"),
                sort: sortSelect.val(),
                price: priceInp.val(),
                priceB: maxPriceCheck.is(":checked"),
                sortB: sortCheck.is(':checked')
            },
            success: function(dishes)
            {
                console.log(dishes);
                dishes.forEach(dish => {
                    appendDishesLi(dish, mealsList);
                });
            },
            error: function(error) {
                console.error("Error finding data:", error);
            }
            });
        } else {
            await $.ajax({
                url: "/api/meal",
                method: "GET",
                dataType: "json",
                contentType: 'application/json',
                data: {
                    categoryId: categoryIdForFilter,
                },
                success: function(meals)
                {
                mealsList.empty();
                console.log(meals);
                    meals.forEach(meal => {
                    appendMealsLi(meal);
                });
                },
                error: function(error) {
                console.error("Error finding data:", error);
                }
            }); 

            $.ajax({
                url: "/api/dish",
                method: "GET",
                dataType: "json",
                contentType: 'application/json',
                data: {
                    categoryId: categoryIdForFilter,
                },
                success: function(dishes)
                {
                    console.log(dishes);
                    dishes.forEach(dish => {
                        appendDishesLi(dish, mealsList);
                    });
                },
                error: function(error) {
                    console.error("Error finding data:", error);
                }
            });
        }
    } 
});



 function restrictInputToNumbers(event) {
    const input = event.target;
    const inputValue = input.value;
    const sanitizedValue = inputValue.replace(/[^\d]/g, ''); // Remove non-digit characters
    input.value = sanitizedValue;
  }