$(document).ready(async function() {

    const dishesList = $('.dishes-list');
    const mealsList = $('.meals-list');
    const categories = $('.categories');

    const errorscategory = $('.errors-category');
    const errorsmeal = $('.errors-meal');
    const errorsdish = $('.errors-dish');
    errorscategory.hide();
    errorsmeal.hide();
    errorsdish.hide();

    let categorytypeFilter;

    const dishesSection = $('#dishesSection');
    const mealsSection = $('#mealsSection');

    let categoryIdForFilter;

    const putHideOnElement = (element) => {
        element.removeClass('nohide').addClass('hide');
    }

    const removeHideOnElement = (element) => {
        element.removeClass('hide').addClass('nohide');
    }

    const appendDishesLi = (dish, list) => {
        const newElement = $(`<li id="${dish._id}" class="nohide" data-dish-categoryId="${dish.categoryId}">
            <div class="card">
            <div class="row">
            <div class="col-md-4" id="picture-div-${dish._id}">
                    <img src="${dish.picture}" class="card-img-top" alt="${dish.name}" id="picture-${dish._id}">
                </div>
                <div class="col-md-8" id="card-${dish._id}">
                <div class="card-body">
                    <div class="same-level" id="same-level-${dish._id}"> 
                        <div class="buttons">
                            <button class="updateBtn btn btn-success" data-dish-id="${dish._id}"><i id="button-${dish._id}" class="bi bi-pencil-fill"></i></button>
                            <button class="deleteBtn btn btn-danger" data-dish-id="${dish._id}"><i class="bi bi-x-lg"></i></button>
                        </div>

                        <h5 class="card-title" id="title-${dish._id}">${dish.name}</h5>
                    </div>

                        <p class="card-text" id="text-${dish._id}"> ${dish.price}₪</p>
                        <p class="card-info" id="info-${dish._id}"> ${dish.description}</p>
                    </div>
                </div>
            </div>

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
                url:`/api/dish/${id}`,
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
                $(`#picture-${id}`).remove();

                $(`#card-${id}`).append(`<div class="inputs-${id}">
                    <div class="update-dish-errors">
                    <input value="${Dish.name}" class="form-control" id="name-${id}">
                    <input value="${Dish.price}" class="form-control" id="price-${id}">
                    <input value="${Dish.description}" class="form-control" id="description-${id}">
                    <input value="${Dish.picture}" class="form-control" id="new-picture-${id}">
                </div>`);
                
            } else {
                let newDish;

                const updatedisherrors = $(`.update-dish-errors`);
                const name = $(`#name-${id}`).val();
                const price = $(`#price-${id}`).val();
                const description = $(`#description-${id}`).val();
                const picture = $(`#new-picture-${id}`).val();

                if (name && price && description && picture) {

                    if (name.length > 14) {
                        updatedisherrors.html('שם הארוחה ארוך מידי');
                        updatedisherrors.show();
                        return;
                    } else {
                        for (let i = 0; i< name.length; i++) {
                            const charCode = name.charCodeAt(i);
            
                            if (charCode < 1488 || charCode > 1514) { 
                                updatedisherrors.html('שם הארוחה מכיל תווים לא בעברית');
                                updatedisherrors.show();
                                return;
                            }
                        }
                    }
        
                    if (price.length > 2) {
                        updatedisherrors.html('המחיר גדול מידי');
                        updatedisherrors.show();
                        return;
                    } else {
                        for (let i = 0; i < price.length; i++) {
                            if (price[i] < '0' || price[i] > '9') { 
                                updatedisherrors.html('המחיר מכיל תווים שהם לא מספרים');
                                updatedisherrors.show();
                                return;
                            }
                        }
                    }
        
                    if (description.length > 125) {
                        updatedisherrors.html('התיאור ארוך מידי');
                        updatedisherrors.show();
                        return;
                    } else {
                        for (let i = 0; i< description.length; i++) {
                            const charCode = description.charCodeAt(i);
            
                            if (charCode < 1488 || charCode > 1514) { 
                                updatedisherrors.html('תיאור הארוחה מכיל תווים לא בעברית');
                                updatedisherrors.show();
                                return;
                            }
                        }
                    }

                    await $.ajax({
                        url:`/api/dish/${id}`,
                        method: "PUT",
                        dataType: "json",
                        contentType: 'application/json',
                        data: JSON.stringify({
                            name: name,
                            price: price,
                            categoryId: Dish.categoryId,
                            picture: picture,
                            description: description,
                            kosher: Dish.kosher
                        }),
                        success: function(data) {
                            updatedisherrors.hide();
                            console.log("Data saved successfully:", data);
                            newDish = data;
                        },
                        error: function(error) {
                            console.error("Error saving data:", error);
                        }
                    });
    
                    $(`.inputs-${id}`).remove();
    
                    $(`#same-level-${id}`).append(`<h5 class="card-title" id="title-${newDish._id}">${newDish.name}</h5>`);
                    $(`#picture-div-${id}`).append(`<img src="${newDish.picture}" class="card-img-top" alt="${newDish.name}" id="picture-${newDish._id}">`);
                    $(`#card-${id}`).append(`
                        <p class="card-text" id="text-${newDish._id}"> ${newDish.price}₪</p>
                        <p class="card-info" id="info-${newDish._id}"> ${newDish.description}</p>
                    `);
    
                    $(`#button-${dish._id}`).removeClass('bi bi-check-lg').addClass('bi bi-pencil-fill');
                } else {
                    updatedisherrors.html('לא הזנת את כל הפרטים');
                    updatedisherrors.show();
                }
            }
        });

        list.append(newElement);
    }

    const appendMealsLi = (meal) => {
        const newElement = $(`<li id="${meal._id}" class="nohide" data-meal-categoryId="${meal.categoryId}">
        <div class="card">
        <div class="row">
        <div class="col-md-4" id="picture-div-${meal._id}">
                <img src="${meal.picture}" class="card-img-top" alt="${meal.name}" id="picture-${meal._id}">
            </div>
            <div class="col-md-8" id="card-${meal._id}">
                <div class="card-body">

                    <div class="same-level" id="same-level-${meal._id}"> 
                        <div class="buttons">
                            <button class="updateBtn btn btn-success" data-meal-id="${meal._id}"><i id="button-${meal._id}" class="bi bi-pencil-fill"></i></button>
                            <button class="deleteBtn btn btn-danger" data-meal-id="${meal._id}"><i class="bi bi-x-lg"></i></button>
                        </div>

                        <h5 class="card-title" id="title-${meal._id}">${meal.name}</h5>
                    </div>
                    
                    <p class="card-text" id="text-${meal._id}"> ${meal.price}₪</p>
                    <p class="card-info" id="info-${meal._id}"> ${meal.description}</p>

                </div>
            </div>
        </div>
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
                url:`/api/meal/${id}`,
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
                $(`#picture-${id}`).remove();

                $(`#card-${id}`).append(`<div class="inputs-${id}">
                    <div class="meal-update-errors"></div>
                    <input value="${Meal.name}" class="form-control" id="name-${id}">
                    <input value="${Meal.price}" class="form-control" id="price-${id}">
                    <input value="${Meal.description}" class="form-control" id="description-${id}">
                    <input value="${Meal.picture}" class="form-control" id="new-picture-${id}">
                </div>`);

                
            } else {
                let newMeal;

                const mealupdateerrors = $('.meal-update-errors');
                const name = $(`#name-${id}`).val();
                const price = $(`#price-${id}`).val();
                const description = $(`#description-${id}`).val();
                const picture = $(`#new-picture-${id}`).val();

                if (name && price && description && picture) {
                    if (name.length > 14) {
                        mealupdateerrors.html('שם הארוחה ארוך מידי');
                        mealupdateerrors.show();
                        return;
                    } else {
                        for (let i = 0; i< name.length; i++) {
                            const charCode = name.charCodeAt(i);
            
                            if (charCode < 1488 || charCode > 1514) { 
                                mealupdateerrors.html('שם הארוחה מכיל תווים לא בעברית');
                                mealupdateerrors.show();
                                return;
                            }
                        }
                    }
        
                    if (price.length > 2) {
                        mealupdateerrors.html('המחיר גדול מידי');
                        mealupdateerrors.show();
                        return;
                    } else {
                        for (let i = 0; i < price.length; i++) {
                            if (price[i] < '0' || price[i] > '9') { 
                                mealupdateerrors.html('המחיר מכיל תווים שהם לא מספרים');
                                mealupdateerrors.show();
                                return;
                            }
                        }
                    }
        
                    if (description.length > 125) {
                        mealupdateerrors.html('התיאור ארוך מידי');
                        mealupdateerrors.show();
                        return;
                    } else {
                        for (let i = 0; i< description.length; i++) {
                            const charCode = description.charCodeAt(i);
            
                            if (charCode < 1488 || charCode > 1514) { 
                                mealupdateerrors.html('תיאור הארוחה מכיל תווים לא בעברית');
                                mealupdateerrors.show();
                                return;
                            }
                        }
                    }
    
                    await $.ajax({
                        url:`/api/meal/${id}`,
                        method: "PUT",
                        dataType: "json",
                        contentType: 'application/json',
                        data: JSON.stringify({
                            name: name,
                            price: price,
                            dishes: Meal.dishes,
                            categoryId: Meal.categoryId,
                            picture: picture,
                            description: description,
                            kosher: Meal.kosher
                        }),
                        success: function(data) {
                            mealupdateerrors.hide();
                            console.log("Data saved successfully:", data);
                            newMeal = data;
                        },
                        error: function(error) {
                            console.error("Error saving data:", error);
                        }
                    });
    
                    $(`.inputs-${id}`).remove();
    
                    $(`#same-level-${id}`).append(`<h5 class="card-title" id="title-${newMeal._id}">${newMeal.name}</h5>`);
                    $(`#picture-div-${id}`).append(`<img src="${newMeal.picture}" class="card-img-top" alt="${newMeal.name}" id="picture-${newMeal._id}">`);
                    $(`#card-${id}`).append(`
                        <p class="card-text" id="text-${newMeal._id}"> ${newMeal.price}₪</p>
                        <p class="card-info" id="info-${newMeal._id}"> ${newMeal.description}</p>
                    `);
    
                    $(`#button-${Meal._id}`).removeClass('bi bi-check-lg').addClass('bi bi-pencil-fill');
                } else {
                    mealupdateerrors.html('לא הזנת את כל הפרטים');
                    mealupdateerrors.show();
                }
            }
        });

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

    const appendCategoryLi = (category) => {
        const newElement = $(`<li id="${category._id}" class="li-category" type="button">
            <div class="categoryBtns">
            <button class="updateBtn btn btn-success" data-category-id="${category._id}"><i id="button-${category._id}" class="bi bi-pencil-fill"></i></button>
            <button class="deleteBtn btn btn-danger" data-category-id="${category._id}"><i class="bi bi-x-lg"></i></button>
            </div>
            <a class="nameOfCategory" data-category-id="${category._id}" data-category-categorytype="${category.categorytype}" id="name-${category._id}" href="/manager/managerMenu#${category.name}">${category.name}</a>
        </li>`);

        newElement.find('.deleteBtn').on('click', function() {
            const btn = $(this);
            const id = btn.attr('data-category-id');

            $.ajax({
                url: `/api/category/${id}`,
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
            let Category;
            const btn = $(this);
            const id = btn.attr('data-category-id');

            await $.ajax({
                url:`/api/category/${id}`,
                method: "GET",
                success: (data) => {
                    Category = data;
                },
                error: (error) => {
                    console.log(error);
                }
            });

            if ($(`#button-${Category._id}`).hasClass('bi bi-pencil-fill')) {
                $(`#button-${Category._id}`).removeClass('bi bi-pencil-fill').addClass('bi bi-check-lg');

                $(`#name-${id}`).remove();

                $(`#${id}`).append(`<div class="inputs-${id}">
                    <div class="update-category-errors"></div>
                    <input value="${Category.name}" class="form-control" id="name-${id}">
                </div>`);  
            } else {
                let newCategory;

                const updatecategoryerrors = $('.update-category-errors');
                const name = $(`#name-${id}`).val();

                if (name) {
                    if (name.length > 14) {
                        updatecategoryerrors.html('שם הרחוב ארוך מידי');
                        updatecategoryerrors.show();
                        return;
                    } else {
                        for (let i = 0; i< name.length; i++) {
                            const charCode = name.charCodeAt(i);
            
                            if (charCode < 1488 || charCode > 1514) { 
                                updatecategoryerrors.html('שם הרחוב מכיל תווים לא בעברית');
                                updatecategoryerrors.show();
                                return;
                            }
                        }
                    }

                    await $.ajax({
                        url:`/api/category/${id}`,
                        method: "PUT",
                        dataType: "json",
                        contentType: 'application/json',
                        data: JSON.stringify({
                            name: name,
                            categorytype: Category.categorytype
                        }),
                        success: function(data) {
                            updatecategoryerrors.hide();
                            console.log("Data saved successfully:", data);
                            newCategory = data;
                        },
                        error: function(error) {
                            console.error("Error saving data:", error);
                        }
                    });
    
                    $(`.inputs-${id}`).remove();
    
                    $(`#${id}`).append(`<a class="nameOfCategory" data-category-id="${newCategory._id}" data-category-categorytype="${newCategory.categorytype}" id="name-${newCategory._id}" href="/manager/managerMenu#${newCategory.name}">${newCategory.name}</a>`);
    
                    $(`#button-${Category._id}`).removeClass('bi bi-check-lg').addClass('bi bi-pencil-fill');
                } else {
                    updatecategoryerrors.html('לא הזנת את הפרטים');
                    updatecategoryerrors.show();
                }
            }
        });

        newElement.find('.nameOfCategory').on('click', async function() {
            const btn = $(this);
            const id = btn.attr('data-category-id');
            const categorytype = btn.attr('data-category-categorytype');
            categoryIdForFilter = id;

            if (categorytype === "meal") {
                categorytypeFilter = 'meal';
                if (mealsSection.hasClass('hide')) {
                    removeHideOnElement(mealsSection);
                    putHideOnElement(dishesSection);
                }
            } else if (categorytype === "dish") {
                categorytypeFilter = 'dish';

                if (dishesSection.hasClass('hide')) {
                    removeHideOnElement(dishesSection);
                    putHideOnElement(mealsSection);
                }
            }
        });

        categories.append(newElement);
    }

    const renderCategories = (data) => {
        data.forEach(category => {
            appendCategoryLi(category);
        });
    }

    await $.ajax({
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

    const newCategoryBtn = $(`<li class="newCategoryBtn" type="button" data-bs-toggle="modal" data-bs-target="#newCategoryModal"><i class="bi bi-plus-circle" id="addIcon"></i></li>`)

    const saveBtn = $('.saveBtn');
    const categoryName = $('#categoryName');
    const Categorytype = $('#Categorytype');
    const modalbuttons = $('.modal-buttons')

    newCategoryBtn.on('click', function() {
        newCategoryBtn.remove();
    });

    saveBtn.on('click', function() {
        const CategorytypeVal = Categorytype.find(':selected').attr('data-Categorytype');
        const categoryNameVal = categoryName.val();

        if (categoryNameVal && CategorytypeVal) {

            if (categoryNameVal.length > 15) {
                errorscategory.html('שם הקטגוריה ארוך מידי');
                errorscategory.show();
                return;
            } else {
                for (let i = 0; i< categoryNameVal.length; i++) {
                    const charCode = categoryNameVal.charCodeAt(i);
    
                    if (charCode < 1488 || charCode > 1514) { 
                        errorscategory.html('שם הקטגוריה מכיל תווים לא בעברית');
                        errorscategory.show();
                        return;
                    }
                }
            }

            $.ajax({
                url: "/api/category",
                method: "POST",
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify({
                    name: categoryNameVal,
                    categorytype: CategorytypeVal
                }),
                success: function(data) {
                    errorscategory.hide()
                    appendCategoryLi(data);
                    categories.append(newCategoryBtn);
                    saveBtn.remove();
                    const newElement = $(`<button type="button" class="closebtn" data-bs-dismiss="modal" aria-label="Close"><i class="bi bi-check2"></i></button>`);
                    categoryName.val("");
                    modalbuttons.append(newElement);
                },
                error: function(error) {
                    console.error(error);
                }
            });
            
        } else {
            errorscategory.show();
            errorscategory.html('לא הזנת את כל הפרטים');
        }
    });

    $('.clodebtn').on('click', function() {
        modalbuttons.append(saveBtn);
        newElement.find('.clodebtn').remove();
    });

    categories.append(newCategoryBtn);

    $('#newCategoryModal').on('hide.bs.modal', function() {
        categories.append(newCategoryBtn);
    });

    let index = 1;

    const dishcategories = $('#dish-categories');
    const mealcategories = $('#meal-categories');
    const mealdish = $('#meal-dish');
    const mealdrink = $('#meal-drink');
    const mealextra = $('#meal-extra');

    dishcategories.append(`<option disabled selected class="text-blue-600/100">סוג המנה</option>`);
    mealcategories.append(`<option disabled selected class="text-blue-600/100">סוג הארוחה</option>`);
    mealdish.append(`<option disabled selected class="text-blue-600/100">סוג המנה</option>`);
    mealdrink.append(`<option disabled selected class="text-blue-600/100">סוג השתייה</option>`);
    mealextra.append(`<option disabled selected class="text-blue-600/100">סוג התוספת</option>`);

    const createSelectionDish = (category) => {
        dishcategories.append(`<option value="${index}" data-category-id="${category._id}">${category.name}</option>`);
        
        index++;
    }

    index = 1;

    const createSelectionMeal = (category) => {
        mealcategories.append(`<option value="${index}" data-category-id="${category._id}">${category.name}</option>`);
        index++;
    }
    
    $.ajax({
        url: "/api/category",
        method: "GET",
        dataType: "json",
        contentType: 'application/json',
        data: {
            categorytype: "dish"
        },
        success: function(data) {
            data.forEach(category => {
                createSelectionDish(category);
            });
        },
        error: function(error) {
            console.error(error);
        }
    });

    $.ajax({
        url: "/api/category",
        method: "GET",
        dataType: "json",
        contentType: 'application/json',
        data: {
            categorytype: "meal"
        },
        success: function(data) {
            data.forEach(category => {
                createSelectionMeal(category);
            });
        },
        error: function(error) {
            console.error(error);
        }
    });

    const nameDish = $('#dish-name');
    const priceDish = $('#dish-price');
    const descriptionDish = $('#dish-description');
    const pictureDish = $('#dish-picture');

    const nameMeal = $('#meal-name');
    const priceMeal = $('#meal-price');
    const descriptionMeal = $('#meal-description');
    const pictureMeal = $('#meal-picture');

    const moveBtn = $('.moveBtn');

    moveBtn.on('click', async function() {
        if(nameDish.val() && priceDish.val() && descriptionDish.val() && pictureDish.val() && dishcategories.find(":selected").attr('data-category-id')) {
            
            if (nameDish.val().length > 14) {
                errorsdish.html('שם הארוחה ארוך מידי');
                errorsdish.show();
                return;
            } else {
                for (let i = 0; i< nameDish.val().length; i++) {
                    const charCode = nameDish.val().charCodeAt(i);
    
                    if (charCode < 1488 || charCode > 1514) { 
                        errorsdish.html('שם הארוחה מכיל תווים לא בעברית');
                        errorsdish.show();
                        return;
                    }
                }
            }

            if (priceDish.val().length > 2) {
                errorsdish.html('המחיר גדול מידי');
                errorsdish.show();
                return;
            } else {
                for (let i = 0; i < priceDish.val().length; i++) {
                    if (priceDish.val()[i] < '0' || priceDish.val()[i] > '9') { 
                        errorsdish.html('המחיר מכיל תווים שהם לא מספרים');
                        errorsdish.show();
                        return;
                    }
                }
            }

            if (descriptionDish.val().length > 125) {
                errorsdish.html('התיאור ארוך מידי');
                errorsdish.show();
                return;
            } else {
                for (let i = 0; i< descriptionDish.val().length; i++) {
                    const charCode = descriptionDish.val().charCodeAt(i);
    
                    if (charCode < 1488 || charCode > 1514) { 
                        errorsdish.html('תיאור הארוחה מכיל תווים לא בעברית');
                        errorsdish.show();
                        return;
                    }
                }
            }
            
            await $.ajax({
                url: "/api/dish",
                method: "POST",
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify({
                    name: nameDish.val(),
                    price: priceDish.val(),
                    categoryId: dishcategories.find(":selected").attr('data-category-id'),
                    picture: pictureDish.val(),
                    description: descriptionDish.val(),
                    kosher: true
                }),
                success: function(data) {
                    errorsdish.hide();
                    nameDish.val("");
                    priceDish.val("");
                    descriptionDish.val("");
                    pictureDish.val("");
                    moveBtn.hide();
                    const newElement = $(`<button type="button" class="closebtn" data-bs-dismiss="modal" aria-label="Close"><i class="bi bi-check2"></i></button>`);

                    newElement.on('click', function() {
                        moveBtn.show();
                        newElement.remove();
                    });

                    $('.modal-buttons-dish').append(newElement);

                    if (categoryIdForFilter == data.categoryId) {
                        appendDishesLi(data, dishesList);
                    } else if (!categoryIdForFilter) {
                        appendDishesLi(data, mealsList)
                    }
                },
                error: function(error) {
                    console.error(error);
                }
            });

            $.ajax({
                url: "/manager/posttopage",
                method: "POST",
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify({
                    img: pictureDish.val(),
                    Productdesctiption: descriptionDish.val()
                }),
                success: function(response) {
                    console.log(response);
                },
                error: function(error) {
                    console.error(error);
                }
            });
        } else {
            errorsdish.html('לא הזנת את כל הפרטים');
            errorsdish.show();
        }
    });

    let categoriesArray = [];

    await $.ajax({
        url: "/api/category",
        method: "GET",
        dataType: "json",
        contentType: 'application/json',
        data: {
            categorytype: "dish"
        },
        success: function(data) {
            data.forEach(category => {
                if (category.name === "מוצרים בודדים" || category.name === "תוספות" || category.name === "שתייה") {
                    categoriesArray.push(category);
                }
            })
        },
        error: function(error) {
            console.error(error);
        }
    });

    index = 1;

    const createSelectionForDish = (dish) => {
        mealdish.append(`<option value="${index}" data-dish-id="${dish._id}">${dish.name}</option>`);
        index++;
    }

    await $.ajax({
        url: "/api/dish",
        method: "GET",
        dataType: "json",
        contentType: 'application/json',
        data: {
            categoryId: categoriesArray[0]["_id"]
        },
        success: (data) => {
            data.forEach(dish => {
                createSelectionForDish(dish);
            });
        },
        error: (error) => {
            console.log(error);
        }
    });  

    index = 1;

    const createSelectionForExtra = (extra) => {
        mealextra.append(`<option value="${index}" data-extra-id="${extra._id}">${extra.name}</option>`);
        index++;
    }

    await $.ajax({
        url: "/api/dish",
        method: "GET",
        dataType: "json",
        contentType: 'application/json',
        data: {
            categoryId: categoriesArray[2]["_id"]
        },
        success: (data) => {
            data.forEach(extra => {
                createSelectionForExtra(extra);
            });
        },
        error: (error) => {
            console.log(error);
        }
    });  

    index = 1;

    const createSelectionForDrink = (drink) => {
        mealdrink.append(`<option value="${index}" data-drink-id="${drink._id}">${drink.name}</option>`);
        index++;
    }

    await $.ajax({
        url: "/api/dish",
        method: "GET",
        dataType: "json",
        contentType: 'application/json',
        data: {
            categoryId: categoriesArray[1]["_id"]
        },
        success: (data) => {
            data.forEach(drink => {
                createSelectionForDrink(drink);
            });
        },
        error: (error) => {
            console.log(error);
        }
    });  

    $('.moveBtn-meal').on('click', async function() {
        if(nameMeal.val() && priceMeal.val() && descriptionMeal.val() && pictureMeal.val() && mealcategories.find(":selected").attr('data-category-id') && mealdrink.find(":selected").attr('data-drink-id')  && mealdish.find(":selected").attr('data-dish-id') && mealextra.find(":selected").attr('data-extra-id')) {
            
            if (nameMeal.val().length > 14) {
                errorsmeal.html('שם הארוחה ארוך מידי');
                errorsmeal.show();
                return;
            } else {
                for (let i = 0; i< nameMeal.val().length; i++) {
                    const charCode = nameMeal.val().charCodeAt(i);
    
                    if (charCode < 1488 || charCode > 1514) { 
                        errorsmeal.html('שם הארוחה מכיל תווים לא בעברית');
                        errorsmeal.show();
                        return;
                    }
                }
            }

            if (priceMeal.val().length > 2) {
                errorsmeal.html('המחיר גדול מידי');
                errorsmeal.show();
                return;
            } else {
                for (let i = 0; i < priceMeal.val().length; i++) {
                    if (priceMeal.val()[i] < '0' || priceMeal.val()[i] > '9') { 
                        errorsmeal.html('המחיר מכיל תווים שהם לא מספרים');
                        errorsmeal.show();
                        return;
                    }
                }
            }

            if (descriptionMeal.val().length > 125) {
                errorsmeal.html('התיאור ארוך מידי');
                errorsmeal.show();
                return;
            } else {
                for (let i = 0; i< descriptionMeal.val().length; i++) {
                    const charCode = descriptionMeal.val().charCodeAt(i);
    
                    if (charCode < 1488 || charCode > 1514) { 
                        errorsmeal.html('תיאור הארוחה מכיל תווים לא בעברית');
                        errorsmeal.show();
                        return;
                    }
                }
            }

            await $.ajax({
                url: "/api/meal",
                method: "POST",
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify({
                    name: nameMeal.val(),
                    price: priceMeal.val(),
                    dishes: [mealdish.find(":selected").attr('data-dish-id'),
                    mealextra.find(":selected").attr('data-extra-id'),
                    mealdrink.find(":selected").attr('data-drink-id')],
                    categoryId: mealcategories.find(":selected").attr('data-category-id'),
                    picture: pictureMeal.val(),
                    description: descriptionMeal.val(),
                    kosher: true
                }),
                success: function(data) {
                    errorsmeal.hide();
                    nameDish.val("");
                    priceDish.val("");
                    descriptionDish.val("");
                    pictureDish.val("");

                    $('.moveBtn-meal').hide();

                    const newElement = $(`<button type="button" class="closebtn-meal" data-bs-dismiss="modal" aria-label="Close"><i class="bi bi-check2"></i></button>`);
                    $('.modal-buttons-meal').append(newElement);

                    newElement.on('click', function() {
                        $('.moveBtn-meal').show();
                        newElement.remove();
                    });

                    $('.modal-buttons-meal').append(newElement);

                    if (!categoryIdForFilter || categoryIdForFilter == data.categoryId) {
                        appendMealsLi(data);
                    }
                },
                error: function(error) {
                    console.error(error);
                }
            });

            $.ajax({
                url: "/manager/posttopage",
                method: "POST",
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify({
                    img: pictureMeal.val(),
                    Productdesctiption: descriptionMeal.val()
                }),
                success: function(response) {
                    console.log(response);
                },
                error: function(error) {
                    console.error(error);
                }
            });
        } else {
            errorsmeal.html('לא הזנת את כל הפרטים');
            errorsmeal.show();
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

