import { Game } from "./src/game.js";

const game = new Game();

// для возможности видеть выводить значения свойств в консоль (т.к. модуль - это отдельная область видимости)
window.game = game;

console.log(game);