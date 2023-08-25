$(document).ready(function() {

    const branchList =  $('.branches-list');

    const appendBranchLi = (branch) => {
        const newElement = $(`<li id="${branch._id}">
        <div class="location-Section"> 
            <div class="location">
                <div class="location-icon">
                    <i class="bi bi-geo-alt-fill"></i>
                </div>

                <span class="nameOfLocation">${branch.name}</span>
            </div>

            <div class="buttons">
                <div type="button" class="remove-icon" data-branch-id="${branch._id}">
                    <i class="bi bi-x-circle-fill" id="iconToRemove-${branch._id}"></i>
                </div>
            
                <div type="button" class="plus-icon" data-branch-id="${branch._id}">
                    <i class="bi bi-plus-circle-fill" id="iconToClick-${branch._id}"></i>
                </div>

                <div type="button" class="update-icon" data-branch-id="${branch._id}" data-bs-toggle="modal" data-bs-target="#updateBranchModal">
                    <i class="bi bi-pencil-fill" id="iconToClick-${branch._id}"></i>
                </div>
            </div>
            
            </div>
        </li>`);

        newElement.find('.remove-icon').on('click', function() {
            const btn = $(this);
            const id = btn.attr('data-branch-id');

            $.ajax({
                url: `/api/branch/${id}`,
                method: "DELETE",
                success: function() {
                    $(`#${id}`).remove();
                },
                error: function(error) {
                    console.error("Error deleting data:", error);
                }
            });
        });

        newElement.find('.plus-icon').on('click', function() {
            const btn = $(this);
            const id = btn.attr('data-branch-id');
            const icon = $(`#iconToClick-${id}`);

            if(icon.hasClass('bi bi-plus-circle-fill')) {
                $.ajax({
                    url: `/api/branch/${id}`,
                    method: "GET"
                }).done(function(data) {
                    const li = $(`#${id}`);
                    li.append(`<div class="location-data" id="location-data-${id}">
                        <div id="map-${id}" style="width: 50%"></div>
                        <div class="branch-data" style="width: 50%">
                            <div class="data">כתובת: ${data.address}</div>
                            <div class="data">משלוחים: כן</div>
                            <div class="data">${data.phoneNumber} :טלפון</div>
                            <div class="data">שעות פתיחה: ${data.activityTime}</div>
                        </div>
                    </div>`);
    
                    icon.removeClass("bi bi-plus-circle-fill").addClass("bi bi-dash-circle-fill");
                    
                    // Initialize and add the map
                    let map;

                    async function initMap() {
                        // The location of Uluru
                        const position = { lat: data.coordinateX, lng: data.coordinateY };
                        // Request needed libraries.
                        //@ts-ignore
                        const { Map } = await google.maps.importLibrary("maps");
                        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

                         // The map, centered at Uluru
                        map = new Map(document.getElementById(`map-${id}`), {
                            zoom: 14,
                            center: position,
                            mapId: `CSBugerBranch-${id}`,
                        });

                        // The marker, positioned at Uluru
                        const marker = new AdvancedMarkerElement({
                            map: map,
                            position: position,
                            title: data.name,
                        });
                    }

                    initMap();
                });
            }
            else {
                $(`#location-data-${id}`).remove();
                icon.removeClass("bi bi-dash-circle-fill").addClass("bi bi-plus-circle-fill");
            }
        });

        newElement.find('.update-icon').on('click', async function() {
            const btn = $(this);
            const id = btn.attr('data-branch-id');

            await $.ajax({
                url:"/api/user",
                method: "GET",
                dataType: "json",
                contentType: 'application/json',
                data: {
                    is_Manager: true
                },
                success: function(data) {
                    users = data;
                },
                error: function(error) {
                    console.error("Error finding data:", error);
                }
            });
    
            const managers = $('#managers-update');
    
            managers.append(`<option disabled selected class="text-blue-600/100">שם מנהל</option>`);
    
            let index = 1;
    
            users.forEach(manager => {
                managers.append(`<option value="${index}" data-manager-id="${manager._id}" data-phone-number="${manager.phoneNumber}">${manager.fname}</option>`);
                index++;
            });
    
            const branchName = $("#branchName-update");
            const address = $("#address-update");
            const Activity = $("#Activity-update");
            const x = $("#x-update");
            const y = $("#y-update");

            let updatebranch;

            await $.ajax({
                url: `/api/branch/${id}`,
                method: "GET",
                success: (data) => {
                    updatebranch = data;
                },
                error: (error) => {
                    console.log(error);
                }   
            });

            branchName.val(updatebranch.name);
            address.val(updatebranch.address);
            Activity.val(updatebranch.activityTime);
            x.val(updatebranch.coordinateX);
            y.val(updatebranch.coordinateY);
    
            const saveBtn = $('.saveBtn-update');
    
            const modalbuttons = $('.modal-buttons-update');
    
            saveBtn.on('click', async function() {
                if (branchName.val() && address.val() && Activity.val() && x.val() && y.val()) {
                    const selectedManager = managers.find(":selected");
                    if (selectedManager.length) {
                        const managerId = selectedManager.attr('data-manager-id');
                        const phoneNumber = selectedManager.attr('data-phone-number');
                        
                        await $.ajax({
                            url: `/api/branch/${id}`,
                            method: "PUT",
                            dataType: "json",
                            contentType: 'application/json',
                            data: JSON.stringify({
                                name: branchName.val(),
                                address: address.val(),
                                phoneNumber: phoneNumber,
                                activityTime: Activity.val(),
                                manager: managerId,
                                coordinateX: x.val(),
                                coordinateY: y.val()
                            }),
                            success: function(newData) {
                                console.log("saving data:", error);
                            },
                            error: function(error) {
                                console.error("Error saving data:", error);
                            }
                        });
    
                        branchName.val("");
                        address.val("");
                        Activity.val("");
                        x.val("");
                        y.val("");
                        managers.find(":selected").val(""); 
    
                        const newElement = $(`<button type="button" class="closebtn-update" data-bs-dismiss="modal" aria-label="Close"><i class="bi bi-check2"></i></button>`);
    
                        newElement.find('.clodebtn-update').on('click', function() {
                            modalbuttons.append(saveBtn);
                            newElement.find('.clodebtn-update').remove();
                        });
    
                        modalbuttons.append(newElement);
    
                        saveBtn.remove();
                    }
                }
            });
        });
        
        branchList.append(newElement);
    }

    let Branches = [];

    const render = async (data) => {
        Branches = data.map(branch => {
            appendBranchLi(branch);
            return {id: branch._id, name: branch.name, element: $(`#${branch._id}`)};
        });

        const addBranch = $('#addNewBranch');
        const nohide = $('#nohide');
        const hide = $('#hide');

        addBranch.on('click', async function() {
            hide.removeClass('hide').addClass('nohide');
            nohide.removeClass('nohide').addClass('hide');
        });

        let users;

        await $.ajax({
            url:"/api/user",
            method: "GET",
            dataType: "json",
            contentType: 'application/json',
            data: {
                is_Manager: true
            },
            success: function(data) {
                users = data;
            },
            error: function(error) {
                console.error("Error finding data:", error);
            }
        });

        const managers = $('#managers');

        managers.append(`<option disabled selected class="text-blue-600/100">שם מנהל</option>`);

        let index = 1;

        users.forEach(manager => {
            managers.append(`<option value="${index}" data-manager-id="${manager._id}" data-phone-number="${manager.phoneNumber}">${manager.fname}</option>`);
            index++;
        });

        const branchName = $("#branchName");
        const address = $("#address");
        const Activity = $("#Activity");
        const x = $("#x");
        const y = $("#y");

        const saveBtn = $('.saveBtn');

        const modalbuttons = $('.modal-buttons');

        saveBtn.on('click', async function() {
            if (branchName.val() && address.val() && Activity.val() && x.val() && y.val()) {
                const selectedManager = managers.find(":selected");
                if (selectedManager.length) {
                    const managerId = selectedManager.attr('data-manager-id');
                    const phoneNumber = selectedManager.attr('data-phone-number');
                    
                    await $.ajax({
                        url: "/api/branch",
                        method: "POST",
                        dataType: "json",
                        contentType: 'application/json',
                        data: JSON.stringify({
                            name: branchName.val(),
                            address: address.val(),
                            phoneNumber: phoneNumber,
                            activityTime: Activity.val(),
                            manager: managerId,
                            coordinateX: x.val(),
                            coordinateY: y.val()
                        }),
                        success: function(newData) {
                            data.push(newData);
                            appendBranchLi(newData);
                        },
                        error: function(error) {
                            console.error("Error saving data:", error);
                        }
                    });

                    branchName.val("");
                    address.val("");
                    Activity.val("");
                    x.val("");
                    y.val("");
                    managers.find(":selected").val("");

                    nohide.removeClass('hide').addClass('nohide');

                    const newElement = $(`<button type="button" class="closebtn" data-bs-dismiss="modal" aria-label="Close"><i class="bi bi-check2"></i></button>`);

                    newElement.find('.clodebtn').on('click', function() {
                        modalbuttons.append(saveBtn);
                        newElement.find('.clodebtn').remove();
                    });

                    modalbuttons.append(newElement);

                    saveBtn.remove();
                }
            }
        });



        const searchTxt = $('#searchTxt');

        searchTxt.on('input', function() {
            const value = searchTxt.val();
    
            Branches.forEach(branch => {
                console.log(branch.name);

                const isVisible = branch.name.includes(value);
                branch.element.toggleClass("hide", !isVisible);
            });
        });
    }   

    $.ajax({
        url:"/api/branch",
        method: "GET",
        success: (data) => {
            render(data);
        },
        error: (error) => {
            console.log(error);
        }
    });
});