// import { Game } from "./src/game-rotation-calc-without-temp-array.js";
import { Game } from "./src/game.js";
import { View } from "./src/view.js";

// элемент для отправки аргументом в Класс View
const root = document.querySelector('#root');

const game = new Game();

// // размеры и параметры игрового поля
const width = 280 // 480
const height = 560 // 640
const rows = 20
const columns = 10

const view = new View(root, width, height, rows, columns);

// //  Для разработки и тестирования
// view.renderPlayField(game.getState()); //передаём аргументом метод, возвращающий актуальное состояние игрового поля



// временно прямо здесь опишем события клавиатуры

document.addEventListener('keydown', (event) => {
    // console.log(event.code);
    switch (event.code) {
        case 'ArrowLeft': // Left Arrow
        case 'KeyL': // L
        case 'KeyA': // A
            game.movePieceLeft();
            // view.renderPlayField(game.getState()); // вызываем после движения
            break;

        case 'ArrowRight': // RightArrow
        case 'KeyD': // D
        case 'Quote': // Quote '
            game.movePieceRight();
            break;


        case 'ArrowDown': //  Arrow Down
        case 'KeyS': //  S
        case 'Semicolon': // Semicolon ;
            game.movePieceDown();
            break;



        case 'Enter': // Enter 
        case 'ArrowUp': // ArrowUp
        case 'KeyW': // W
            game.rotatePiece();
            break;

        // case '': //  
        // case '': // 

        //     break;

        default:
            break;
    }

    view.renderPlayField(game.getState());

})


// setInterval(() => {
//     game.movePieceDown();
//     view.renderPlayField(game.getState());
// }, 1000);



// для возможности видеть выводить значения свойств в консоль (т.к. модуль - это отдельная область видимости)
window.game = game;
window.view = view;