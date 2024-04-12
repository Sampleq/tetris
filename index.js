// import { Game } from "./src/game-rotation-calc-without-temp-array.js";
import { Game } from "./src/game.js";
import { View } from "./src/view.js";
import { Controller } from "./src/controller.js";

// элемент для отправки аргументом в Класс View
const root = document.querySelector('#root');

const game = new Game();

// // размеры и параметры игрового поля
const width = 480 // 480  420
const height = 640 // 640  560
const rows = 20
const columns = 10

const view = new View(root, width, height, rows, columns);


const controller = new Controller(game, view);

// //  Для разработки и тестирования
// view.renderPlayField(game.getState()); //передаём аргументом метод, возвращающий актуальное состояние игрового поля




// setInterval(() => {
//     game.movePieceDown();
//     view.render(game.getState());
// }, 1000);


// для возможности видеть выводить значения свойств в консоль (т.к. модуль - это отдельная область видимости)
// window.game = game;
// window.view = view;
window.controller = controller;