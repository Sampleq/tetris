// rotation - rotatePiece() - calculated, using temporary array

// import { Controller } from "./controller.js";
import { colorsNumber } from "./view.js"; // число цветов для рандомной перекраски

export class Game {
    constructor(playfieldWidth, playfieldHeight) {
        this.playfieldWidth = playfieldWidth;
        this.playfieldHeight = playfieldHeight;

        this.playfield = this.createPlayfield(this.playfieldWidth, this.playfieldHeight);
        // объект игрового поля - двухмерный массив
        // playfield =     [
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        // ];
    }

    static points = {
        1: 100,
        2: 300,
        3: 600,
        4: 1000,
    }

    score = 0;
    lines = 0;
    // lines = 109;
    get level() {
        return Math.floor(this.lines / 10);
    }

    topOut = false; // topOut - термин из оф. документации Тетриса - это Game Over
    get isGameOver() {
        return this.topOut;
    }

    // объект активной фигуры (которая передвигается по полю) - её тоже будет представлять двухмерный массив. 

    activePiece = this.createPiece();

    nextPiece = this.createPiece();


    // метод, возвращающий состояние игрового поля - по сути мы будем фиксировать фигуру на другом массиве - дубликате - который мы будем возвращать для отображения  - использовать аргументом .renderPlayField() из Класса View
    getState() {
        // логику по перебору активной фигуры и игрового поля нужно будет вынести в отдельные методы

        const { x: pieceX, y: pieceY, blocks } = this.activePiece;

        // // получаем копию игрового поля - можно заменить глубоким копированием массива this.playfield ([...arr], recursy)
        const playfield = this.createPlayfield(this.playfieldWidth, this.playfieldHeight);

        // можно заменить методами массивов

        for (let y = 0; y < playfield.length; y++) {
            for (let x = 0; x < playfield[y].length; x++) {

                playfield[y][x] = this.playfield[y][x];

            }
        }



        // // копируем "текущий" массив значения активной фигуры
        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {

                if (blocks[y][x]) {
                    playfield[pieceY + y][pieceX + x] =
                        blocks[y][x];
                }

            }
        }

        return {
            score: this.score,
            level: this.level,
            lines: this.lines,
            nextPiece: this.nextPiece,
            playfield,
            isGameOver: this.topOut,
        }

    }

    createPlayfield(width = 10, height = 20) {
        return new Array(height).fill('').map(line => new Array(width).fill(0));

        // const line = new Array(10).fill(0);
        // const playfield = Array.from(new Array(20), () => Array.from(line))
        // return playfield;
    }

    createPiece() {
        const pieces = 'IJLOSTZ.IJLOSTZIJLOSTZ'; // задаём типы фигур

        // получаем случайное число от 0 до 6 - т.к. в тетрисе 7 фигур 
        const index = Math.floor(Math.random() * pieces.length); // - с одинаковой вероятностью

        const type = pieces[index]  // Получаем случайную фигуру. Каждый элемент строки - это название фигуры (её внешний вид)

        const piece = {};

        switch (type) {
            case 'I':
                // положение фигуры задаём исходя из выбранной системы ротации
                // цифра задаёт цвет - или можем генерировать цвет случайно - см. класс View
                piece.blocks = [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ];
                break;

            case 'J':
                piece.blocks = [
                    [0, 0, 0],
                    [2, 2, 2],
                    [0, 0, 2],

                ];
                break;

            case 'L':
                piece.blocks = [
                    [0, 0, 0],
                    [3, 3, 3],
                    [3, 0, 0],
                ];
                break;

            case 'O':
                piece.blocks = [
                    [0, 0, 0, 0],
                    [0, 4, 4, 0],
                    [0, 4, 4, 0],
                    [0, 0, 0, 0],
                ];
                break;

            case 'S':
                piece.blocks = [
                    [0, 0, 0],
                    [0, 5, 5],
                    [5, 5, 0],
                ];
                break;

            case 'T':
                piece.blocks = [
                    [0, 0, 0],
                    [6, 6, 6],
                    [0, 6, 0],
                ];
                break;

            case 'Z':
                piece.blocks = [
                    [0, 0, 0],
                    [7, 7, 0],
                    [0, 7, 7],
                ];
                break;

            case '.':
                piece.blocks = [
                    [0, 0, 0],
                    [0, 1, 0],
                    [0, 0, 0],
                ];
                break;

            default:

                throw new Error('Unknown type of piece');
        }

        // задаём координаты появления фигуры, после того как мы уже знаем какая фигура появится

        // 10 - ширина игрового поля - ОТРЕФАКТОРИТЬ - брать из переменной/свойства
        piece.x = Math.floor((10 - piece.blocks[0].length) / 2);
        piece.y = -1; //  у всех фигур верхний ряд в bounding box - пустой

        // // раскрашиваем фигуры в случайный цвет. 1/20 - вероятность разноцветной фигуры
        if (Math.floor(Math.random() * 21)) {
            piece.blocks =
                this.repaintPiece(piece.blocks, colorsNumber, Math.ceil(Math.random() * colorsNumber));
        } else {
            piece.blocks = this.repaintPiece(piece.blocks, colorsNumber);
        }


        return piece;
    }

    repaintPiece(block_2d, colorsNumber = 7, colorIndex) {
        return block_2d = block_2d.reduce((pieceBlock, rowPiece) => {
            rowPiece = rowPiece.map(el => {
                if (el) {
                    return (colorIndex)
                        ? colorIndex
                        : Math.ceil(Math.random() * colorsNumber);
                } else {
                    return el;
                }
            });

            pieceBlock.push(rowPiece);
            return pieceBlock;
        }, []);
    }



    // // методы перемещения активной фигуры
    movePieceLeft() {
        this.activePiece.x--;

        if (this.hasCollision()) {
            this.activePiece.x++;
        }
    }

    movePieceRight() {
        this.activePiece.x++;

        if (this.hasCollision()) {
            this.activePiece.x--;
        }
    }

    movePieceDown() {
        if (this.topOut) {
            return;
        }

        this.activePiece.y++;

        if (this.hasCollision()) {
            this.activePiece.y--;
            this.lockPiece();

            // после того как зафиксировали фигуру проверяем на возможность очистки линий и взависимости от кол-ва линий - обновляем счёт
            // this.updateScore(this.clearLines());

            const clearLines = this.clearLines();
            this.updateScore(clearLines);

            // обновляем значения свойств activePiece и nextPiece
            this.updatePieces();
        }

        // после создания новых фигур ещё раз проверяем, нет ли столкновения - т.е. есть ли место куда падать или уже нет - т.е. игра окончена.
        if (this.hasCollision()) {
            this.topOut = true;
            console.log('topOut');
        }
    }

    rotatePiece() {
        const blocks = this.activePiece.blocks;
        const length = blocks.length;

        // массив, который будет представлять новое (повёрнутое) состояние блоков
        const temp = [];

        for (let i = 0; i < length; i++) { // переделать на .forEach()
            temp[i] = new Array(length).fill(0);
        }

        // Алгоритм: в полученный пустой массив мы "вставим" состояние повёрнутой фигуры. Значение в массиве blocks у объекта фигуры activePiece изменять не будем - мы высчитаем новое положение блоков и заменим старый массив на новый с повёрнутой фигурой.

        for (let y = 0; y < length; y++) {  //  на .forEach()
            for (let x = 0; x < length; x++) {
                temp[x][y] = blocks[length - 1 - y][x];
            }
        }

        this.activePiece.blocks = temp;

        // если будет коллизия - присваиваем this..activePiece.blocks массив с предыдущим состоянием, на который ссылается заданная нами внутри метода rotatePiece() переменная blocks
        if (this.hasCollision()) {
            this.activePiece.blocks = blocks
        }

    }

    // метод для проверки на столкновения  или выход за пределы поля
    hasCollision() {
        const playfield = this.playfield;
        const { x: pieceX, y: pieceY, blocks } = this.activePiece;
        // pieceX, pieceY - координаты массива с фигурой внутри поля playfield
        // x, y внутри цикла - локальные индексы внутри двумерного массива с фигурой activePiece

        // получаем доступ к ряду и колонке в котором находится activePiece (с учётом размеров текущей активной фигуры - для простоты проверяем каждый элемент фигуры) и проверяем что такие значения существуют (т.е. что мы не вышли за пределы поля)
        for (let y = 0; y < blocks.length; y++) { // отрефакторить на Array.some()
            for (let x = 0; x < blocks[y].length; x++) {

                // проверяем что "ячейка" массива activePiece не пустая а затем  проверяем значение поля при сложении координат положения фигуры  activePiece и её внутренних координат её блока. Приоритет оператора && больше, чем у || - поэтому нужны скобки
                if (blocks[y][x] !== 0 &&
                    ((playfield[pieceY + y] === undefined ||
                        playfield[pieceY + y][pieceX + x] === undefined) ||
                        playfield[pieceY + y][pieceX + x] !== 0) // упросить до проверки только точки (используя .?)
                ) {
                    console.log('has Collision');
                    return true;
                }

            }
        }

        return false;
    }

    // метод, который переносит значения из массива игровой фигуры activePiece в игровое поле playfield - для того чтобы зафиксировать положение фигур
    lockPiece() {
        const { x: pieceX, y: pieceY, blocks } = this.activePiece;
        // pieceX, pieceY - координаты массива с фигурой внутри поля playfield
        // x, y внутри цикла - локальные индексы внутри двумерного массива с фигурой activePiece
        for (let y = 0; y < blocks.length; y++) { // отрефакторить на метод массива (.forEach())
            for (let x = 0; x < blocks[y].length; x++) {
                // копируем значение из blocks в playfield  на соответствующее место, при этом проверяя что значение в blocks не равно нулю - чтобы можно было зафиксировать фигуру, которая повёрнута внутри своего блока так что не занимает все столбцы или колонки своего блока - т.е. нули копироваться не будут
                // console.log(blocks[y][x]);
                // console.log(this.playfield[pieceY][pieceX]);

                // if (blocks[y][x]) { 
                // оставил !== 0 ( т.е. без приведения типов)для большей ясности
                if (blocks[y][x] !== 0) {
                    this.playfield[pieceY + y][pieceX + x] = blocks[y][x];
                }
            }
        }

        console.log('lock Piece');
        // метод lockPiece() не очищает поле от предыдущей позции фигуры activePiece после повторного применения - но это не важно, т.к. он  не будет вызываться при каждом движении, а будет вызываться только когда фигура дойдёт до конца поля или столкнётся с другой фигурой (, а также перед представлением - отрисовкой игрового поля для пользователя. - ??)
    }

    clearLines() {
        const rows = this.playfieldHeight;
        const columns = this.playfieldWidth;

        const lines = [];

        for (let y = rows - 1; y >= 0; y--) { // перебираем ряды с последнего
            let numberOfBlocks = 0; // начальное число заполненных блоков в ряду

            for (let x = 0; x < columns; x++) {
                if (this.playfield[y][x] !== 0) {
                    numberOfBlocks++;
                }
            }

            // если ряд пустой - прерываем цикл - т.к. над пустым рядом точно не может быть заволненных рядов или блоков
            if (numberOfBlocks === 0) {
                break
            } else if (numberOfBlocks < columns) {
                continue; // если ряд заполнен неполностью - переходим слудующей итерации цикла - т.е. перебору следующего, вышестоящего ряда 
            } else if (numberOfBlocks === columns) {
                // отмечаем ряд если он полностью заполненный - но сразу его не удаляем, т.к. тогда сместятся остальные ряды, а мы ещё не прошлись по ним циклом. Отмеченный как полностью заполненные ряды удаляем в конце.
                // Добавляем индекс полностью заполненного ряда в начало массива lines - чтоб  потом поочереди сверху вниз убирать заполненные ряды
                lines.unshift(y);


            }
        }

        // перебираем массив с индексами полностью заполненных линий (сохранены в обратном порядке 0-й - самая верхняя линия) и удаляем из игрового поля линию (ряд) с соответствующим индексом, а сверху - т.е. в начало игрового поля - б=добавляем пустую линию (из нулей)
        for (const index of lines) {
            // добавить эффект заполненной линии перед удалением - например перемигивание разными цветами

            this.playfield.splice(index, 1);
            this.playfield.unshift((new Array(columns)).fill(0));
        }

        return lines.length;

    }


    // обновление очков - счёта
    updateScore(clearedLines) {
        if (clearedLines > 0) {
            // !! Добавить увеличенное кол-во очков за удаление линии с фигурой nugget - разноцветной
            this.score += Math.round(Game.points[clearedLines] * (1 + this.level / 10)); // Math.round - из-за работы с дробными значениями

            this.lines += clearedLines; // увеличиваем счётс=чик линий
            // this.level = Math.floor(this.lines / 10); вынес в класс как свойство-геттер

            // console.log(this.score, this.lines, this.level)
        }
    }


    updatePieces() {
        this.activePiece = this.nextPiece;
        this.nextPiece = this.createPiece();
    }


}