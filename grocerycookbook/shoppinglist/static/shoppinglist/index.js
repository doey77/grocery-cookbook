$(document).ready(function() {
    var table_shopping_list = $('#tblShoppingList').DataTable();

    var selected_list = $('#id_shopping_list').find(":selected").text();

    var add_item_to_list_url = JSON.parse(document.getElementById('add_item_to_list_url').textContent);

    $("#addToShoppingListForm").on('submit', function(event){
        event.preventDefault();
        add_item_to_list(add_item_to_list_url);
    });
});

// AJAX call for adding item to list
function add_item_to_list(ajax_url) {
    $.ajax({
        url: ajax_url,
        type: 'POST',

        data: {
            shopping_list: $('#id_shopping_list').find(":selected").text(),
            item: $('#id_item').val(),
            quantity: $('#id_quantity').val(),
        },

        success: function(json) {
            console.log(json);
            //clear item and set quantity back to 1
            $('#id_item').val('');
            $('#id_quantity').val('1');
        },

        error: function(xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText); // Extra info for console
        },

        // append csrftoken to the request
        beforeSend: function(xhr) {
            xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        },

    })
}

// Function to get cookie. Use for getting csrftoken
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}