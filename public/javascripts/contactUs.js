$(document).ready(function() {

    const framework = $('#framework');

    framework.append(`<option disabled selected class="text-blue-600/100">שם הסניף</option>`);

    let index = 1;

    const createSelection = (branch) => {
        framework.append(`<option value="${index}" data-manager-id="${branch.manager}">${branch.name}</option>`);
        index++;
    }

    const render = (data) => {
        data.forEach(branch => {
            createSelection(branch);
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

const approveBtn = $('#approve-btn');

window.addEventListener("keyup", e => {
    e.preventDefault();
    if (e.key === "Enter") {
        approveBtn.click();
    }
});