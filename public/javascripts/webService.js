$(document).ready(function() {

    $.ajax({
        url: "https://world.openfoodfacts.org/api/v0/product/2000000002603",
        method: "GET",
        success: function(response) {
            console.log(response);
        },
        error: function(error) {
            console.error("Error saving data:", error);
        }
    });
});