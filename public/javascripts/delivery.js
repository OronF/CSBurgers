$(document).ready(function() {
    const framework = $('#framework');
    const branches = $('#branches');

    framework.append(`<option disabled selected class="text-blue-600/100">שם הסניף</option>`);
    branches.append(`<option disabled selected class="text-blue-600/100">שם הסניף</option>`);

    let index = 1;

    const createSelection = (branch) => {
        framework.append(`<option value="${index}" data-branch-id="${branch._id}">${branch.name}</option>`);
        branches.append(`<option value="${index}" data-branch-id="${branch._id}">${branch.name}</option>`);
        index++;
    }

    const render = (data) => {
        data.forEach(branch => {
            createSelection(branch);
        });
    }

    $('#first-btn').on('click', async function() {
        const city = $('#city').val();
        const street = $('#street').val();
        const houseNum = $('#houseNum').val();
        const framework = $('#framework').find(":selected").attr('data-branch-id');

        let length;

        await $.ajax({
            url: "api/order",
            method: "GET",
            success: function(data) {
                length = data.length + 1;
            },
            error: function (error) {
                console.error(error);
            }
        });

        if (city && street && houseNum && framework) {
            $.ajax({
                url: "api/order",
                method: "POST",
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify({
                    orderNumber: length,
                    orderDate: Date.now,
                    location: `${city}, ${street}, ${houseNum}`,
                    totalprice: 15,
                    meals: [],
                    dishes: [],
                    branch: framework
                }),
                success: function(data) {
                    window.location.href = `orders/${data._id}`;
                },
                error: function(error) {
                    console.error(error);
                }
            });        
        }
    });

    $.ajax({
        url: "/api/branches",
        method: "GET",
        success: (data) => {
            render(data);
        },
        error: (error) => {
            console.log(error);
        }
    });
});