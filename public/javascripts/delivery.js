$(document).ready(function() {
    const framework = $('#framework');
    const branches = $('#branches');

    framework.append(`<option disabled selected class="text-blue-600/100">שם הסניף</option>`);
    branches.append(`<option disabled selected class="text-blue-600/100">שם הסניף</option>`);

    let index = 1;

    const createSelection = (branch) => {
        framework.append(`<option value="${index}" data-manager-id="${branch._id}">${branch.name}</option>`);
        branches.append(`<option value="${index}" data-manager-id="${branch._id}">${branch.name}</option>`);
        index++;
    }

    const render = (data) => {
        data.forEach(branch => {
            createSelection(branch);
        });
    }

    $.ajax({
        dataType: "json",
        url: '/delivery',
        method: 'GET',
        success: (data) => {
            console.log(data.id);
        },
        error: (error) => {
            console.error(error);
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