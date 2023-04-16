const playerConditions = new Map();
playerConditions.set('start', '😁');
playerConditions.set('middle', '😳');
playerConditions.set('end', '😰');
playerConditions.set('victory', '😎');
playerConditions.set('defeat', '🤯');

const cellConditions = new Map();
cellConditions.set('normal', ' ');
cellConditions.set('marked', '🚩');
cellConditions.set('bomb', '💣');

const toolConditions = new Map();
toolConditions.set('peek', '👀')
toolConditions.set('mark', '🚩')

const side = 10;
const chance = 0.15;

let field = [];

let totalMines = 0;
let minesLeft = 0;

let currentTool = toolConditions.get('peek');

function generateMines() {
    field = [];

    for (let indexI = 0; indexI < side; indexI++) {
        let fieldRow = [];

        for (let indexJ = 0; indexJ < side; indexJ++) {
            if (Math.random() <= chance) {
                fieldRow.push(1);
            } else {
                fieldRow.push(0);
            }
        }

        field.push(fieldRow);
    }

    console.log(field);
}

function countMines(y, x) {
    let count = 0;
    for (let indexI = -1; indexI <= 1; indexI++) {
        for (let indexJ = -1; indexJ <= 1; indexJ++) {
            const checkY = Number(Number(y) + Number(indexI));
            const checkX = Number(Number(x) + Number(indexJ));
            
            if (checkY < 0 || checkY >= side) {
                continue;
            } else if (checkX < 0 || checkX >= side) {
                continue;
            } 
            else {
                console.log('checking', checkY, checkX);
                if (field[checkY][checkX]) {
                    console.log('found', checkY, checkX)
                    count ++;
                }
            }
        }
    }

    return count;
}

function countMarks(y, x) {
    let count = 0;
    for (let indexI = -1; indexI <= 1; indexI++) {
        for (let indexJ = -1; indexJ <= 1; indexJ++) {
            const checkY = Number(Number(y) + Number(indexI));
            const checkX = Number(Number(x) + Number(indexJ));
            
            if (checkY < 0 || checkY >= side) {
                continue;
            } else if (checkX < 0 || checkX >= side) {
                continue;
            } 
            else {
                const index = checkY * 10 + checkX;
                if ($(`.grid-item:eq(${index})`).hasClass('marked')) {
                    console.log('found mark on ', checkY, checkX)
                    count ++;
                }
            }
        }
    }

    return count;
}

function clickAround(y, x) {
    for (let indexI = -1; indexI <= 1; indexI++) {
        for (let indexJ = -1; indexJ <= 1; indexJ++) {
            const clickY = Number(Number(y) + Number(indexI));
            const clickX = Number(Number(x) + Number(indexJ));

            if (clickY < 0 || clickY >= side) {
                continue;
            } else if (clickX < 0 || clickX >= side) {
                continue;
            } 
            else {
                const index = clickY * 10 + clickX;
                const clickCell = $(`.grid-item:eq(${index})`);
                if (!clickCell.hasClass('revealed') && !clickCell.hasClass('marked')) {
                    clickCell.click();
                }
            }
        }
    }
}

function onDefeat() {
    $('.condition').html(playerConditions.get('defeat'));
    for (let cellIndex = 0; cellIndex < side * side; cellIndex++) {
        const cellY = Math.floor(cellIndex / 10);
        const cellX = cellIndex % 10;
        let cellValue = (countMines(cellY, cellX) ? countMines(cellY, cellX) : '');

        if (field[cellY][cellX]) {
            cellValue = cellConditions.get('bomb');
        }

        $(`.grid-item:eq(${cellIndex})`)
            .attr('onclick', '')
            .addClass('revealed')
            .html(cellValue);
    }
}

function revealCell(element) {
    const x = $(element).attr('data-x');
    const y = $(element).attr('data-y');

    console.log(y, x);

    $(element).addClass('revealed');

    if (field[y][x]) {
        onDefeat();
    } else {
        if (countMines(y, x)) {
            $(element).html(countMines(y, x));
        } else {
            clickAround(y, x);
        }
    }
}

function decreaseMines() {
    minesLeft--;
    $('#minesLeft').html(minesLeft);

    if (minesLeft / totalMines <= 0.33) {
        $('condition').html(playerConditions.get('end'));
    } else if (minesLeft / totalMines <= 0.66) {
        $('condition').html(playerConditions.get('middle'));
    }
}

function increaseMines() {
    minesLeft++;
    $('#minesLeft').html(minesLeft);

    if (minesLeft / totalMines >= 0.66) {
        $('condition').html(playerConditions.get('start'));
    } else if (minesLeft / totalMines >= 0.33) {
        $('condition').html(playerConditions.get('middle'));
    }
}

function markCell(element) {
    if (!$(element).hasClass('revealed')) {
        $(element).addClass('marked');
        $(element).html(cellConditions.get('marked'));
        decreaseMines();
    }
}

function unmarkCell(element) {
    $(element).removeClass('marked');
    $(element).html('');
    increaseMines();
}

function onCellClick(element) {
    if (currentTool == toolConditions.get('peek')) {
        if ($(element).hasClass('revealed')) {
            const x = $(element).attr('data-x');
            const y = $(element).attr('data-y');
            if (countMines(y, x) == countMarks(y, x)) {
                clickAround(y, x);
            }
        } else if (!$(element).hasClass('marked')) {
            revealCell(element);
        }
    } else {
        if ($(element).hasClass('marked')) {
            unmarkCell(element);
        } else {
            markCell(element);
        }
    }
}

function switchTool() {
    if (currentTool == toolConditions.get('peek')) {
        $('#tool').html(toolConditions.get('mark'));
        currentTool = toolConditions.get('mark');
    } else {
        $('#tool').html(toolConditions.get('peek'));
        currentTool = toolConditions.get('peek');
    }
}

function startGame() {
    for (let index = 0; index < side * side; index++) {
        $(`.grid-item:eq(${index})`)
            .removeClass('revealed')
            .removeClass('marked')
            .html('')
            .attr('onclick', 'onCellClick(this)');
    }

    $('.condition').html(playerConditions.get('start'));

    generateMines();

    totalMines = 0;

    for (let indexI = 0; indexI < side; indexI++) {
        for (let indexJ = 0; indexJ < side; indexJ++) {
            if (field[indexI][indexJ]) {
                totalMines++;
            }
        }
        
    }

    minesLeft = totalMines;

    $('#minesLeft').html(minesLeft);
}

$(document).ready(function() {
    for (let index = 0; index < side * side; index++) {
        $('.grid').append($('<div>', {
            class: 'grid-item',
            'data-y': Math.floor(index / 10),
            'data-x': index % 10,
            onclick: 'onCellClick(this)'
        }));
    }

    $('.condition').click();
});