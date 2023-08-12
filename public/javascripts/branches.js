$(document).ready(function() {
    $.ajax({
        url:"/api/branches",
        method: "GET"
    }).done(function(data) {
        data.forEach(function(branch) {
            $('.branches-list').append(`<li class="${branch._id}">
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
                    const li = $(`.${id}`);
                    li.append(`<div class="location-data" id="location-data-${id}">
                        <span class="data">כתובת: ${data.address}</span>
                        <span class="data">משלוחים: כן</span>
                        <span class="data">${data.phoneNumber} :טלפון</span>
                        <span class="data">שעות פתיחה: ${data.activityTime}</span>
                    </div>`);
    
                   icon.removeClass("bi bi-plus-circle-fill").addClass("bi bi-dash-circle-fill");
                });
            }
            else {
                $(`#location-data-${id}`).remove();
                icon.removeClass("bi bi-dash-circle-fill").addClass("bi bi-plus-circle-fill");
            }
        });
    }); 
});