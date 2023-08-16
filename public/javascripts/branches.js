$(document).ready(function() {

    let Branches = [];

    $.ajax({
        url:"/api/branches",
        method: "GET"
    }).done(function(data) {
        Branches = data.map(branch => {
            $('.branches-list').append(`<li  id="${branch._id}">
                <div class="location-Section"> 
                    <div class="location">
                        <div class="location-icon">
                            <i class="bi bi-geo-alt-fill"></i>
                        </div>

                        <span class="nameOfLocation">${branch.name}</span>
                    </div>

                    <div class="plus-icon" data-branch-id="${branch._id}">
                        <i class="bi bi-plus-circle-fill" id="iconToClick-${branch._id}"></i>
                    </div>
                </div>
            </li>`);
            return {id: branch._id, name: branch.name, element: $(`#${branch._id}`)};
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
                        <div id="map-${id}" class="map"></div>
                        <div class="branch-data">
                            <div class="data">כתובת: ${data.address}</div>
                            <div class="data">משלוחים: כן</div>
                            <div class="data">${data.phoneNumber} :טלפון</div>
                            <div class="data">שעות פתיחה<div class="inner-data-activity">${data.activityTime}</div></div>
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