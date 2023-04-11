$(document).ready(function() {
    const side = 10;

    for (let index = 0; index < side * side; index++) {
        $('.grid').append($('<div>', {
            class: 'grid-item'
        }));
    }

    const chance = 0.33;
    let mines = [];

    for (let index = 0; index < side * side; index++) {
        if (Math.random() <= chance) {
            mines.push({
                y: Math.floor(index / 10),
                x: index % 10,
            });

            // для наглядности
            $('.grid-item:eq(' + index + ')').addClass('revealed');
        }
    }

    console.log(mines);
    $('#minesLeft').html(mines.length);
});