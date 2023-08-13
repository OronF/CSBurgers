$(document).ready(function() {

    let Branches = [];

    $.ajax({
        url:"/api/branches",
        method: "GET"
    }).done(function(data) {
        Branches = data.map(branch => {
            $('.branches-list').append(`<li id="${branch._id}">
                <div class="location-Section"> 
                    <div class="location">
                        <div class="location-icon">
                            <i class="bi bi-geo-alt-fill"></i>
                        </div>

                        <span class="nameOfLocation">${branch.name}</span>
                    </div>

                    <div class="remove-icon" data-branch-id="${branch._id}">
                        <i class="bi bi-x-circle-fill" id="iconToRemove-${branch._id}"></i>
                    </div>

                    <div class="plus-icon" data-branch-id="${branch._id}">
                        <i class="bi bi-plus-circle-fill" id="iconToClick-${branch._id}"></i>
                    </div>
                </div>
            </li>`);
            return {id: branch._id, name: branch.name, element: $(`#${branch._id}`)};
        });

        const addBranch = $('#addNewBranch');
        const nohide = $('#nohide');
        const hide = $('#hide');

        addBranch.on('click', async function() {
            hide.removeClass('hide').addClass('nohide');
            nohide.removeClass('nohide').addClass('hide');

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

            managers.append(`<option  disabled selected class="text-blue-600/100">שם מנהל</option>`);

            let index = 1;

            users.forEach(manager => {
                managers.append(`<option value="${index}" data-manager-id="${manager._id}" data-phone-number="${manager.phoneNumber}">${manager.fname}</option>`);
                index++;
            });

            const closeBtn = $('.closeBtn');

            closeBtn.on('click', function() { 
                hide.removeClass('nohide').addClass('hide');
                nohide.removeClass('hide').addClass('nohide');
            });
    
            const branchName = $("#branchName");
            const address = $("#address");
            const Activity = $("#Activity");
            const x = $("#x");
            const y = $("#y");
    
            const saveBtn = $('.saveBtn');

            saveBtn.on('click', async function() {
                if (branchName.val() && address.val() && Activity.val() && x.val() && y.val()) {
                    const selectedManager = managers.find(":selected");
                    if (selectedManager.length) {
                        const managerId = selectedManager.attr('data-manager-id');
                        const phoneNumber = selectedManager.attr('data-phone-number');
                        
                        let branch;
                        
                        await $.ajax({
                            url: "/api/branches",
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
                            success: function(data) {
                                branch = data;
                                console.log("Data saved successfully:", data);
                            },
                            error: function(error) {
                                console.error("Error saving data:", error);
                            }
                        });
        
                        $('.branches-list').append(`<li id="${branch._id}">
                            <div class="location-Section"> 
                                <div class="location">
                                    <div class="location-icon">
                                        <i class="bi bi-geo-alt-fill"></i>
                                    </div>
        
                                    <span class="nameOfLocation">${branch.name}</span>
                                </div>

                                <div class="remove-icon" data-branch-id="${branch._id}">
                                    <i class="bi bi-x-circle-fill" id="iconToRemove-${branch._id}"></i>
                                </div>
        
                                <div class="plus-icon" data-branch-id="${branch._id}">
                                    <i class="bi bi-plus-circle-fill" id="iconToClick-${branch._id}"></i>
                                </div>
                            </div>
                        </li>`);

                        Branches.push({id: branch._id, name: branch.name, element: $(`#${branch._id}`)});
                        
                        hide.removeClass('nohide').addClass('hide');
                        nohide.removeClass('hide').addClass('nohide');
                    }
                }
            });
        });

        $('.plus-icon').on('click', function() {
            const btn = $(this);
            const id = btn.attr('data-branch-id');
            const icon = $(`#iconToClick-${id}`);

            if(icon.hasClass('bi bi-plus-circle-fill')) {
                $.ajax({
                    url: `/api/branches/${id}`,
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

        $('.remove-icon').on('click', function() {
            
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
    }); 
});