$(document).ready(function() {
    const side = 10;

    for (let index = 0; index < side * side; index++) {
        $('.grid').append($('<div>', {
            class: 'grid-item'
        }));
    }
});