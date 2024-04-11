// rotation - rotatePiece() - calculated, using temporary array

export class Game {
    score = 0;
    lines = 0;
    level = 0;

    // // !! -remade with new Array(20), fill() etc. 
    // объект игрового поля - двухмерный массив
    playfield = this.createPlayField();

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



    // объект активной фигуры (которая передвигается по полю) - её тоже будет представлять двухмерный массив. 

    // (Для примера опишем Т образную фигуру. 3 - й ряд нужен чтобы её можно было повернуть.)

    // activePieceX = 0;
    // activePieceY = 0;
    // activePiece = [
    //     [0, 1, 0],
    //     [1, 1, 1],
    //     [0, 0, 0],

    // ];

    // пока вручную присвоили значение фигуры Т

    activePiece = this.createPiece();

    nextPiece = this.createPiece();


    // метод, возвращающий состояние игрового поля - по сути мы будем фиксировать фигуру на другом массиве - дубликате - который мы будем возвращать для отображения  - использовать аргументом .renderPlayField() из Класса View
    getState() {
        // логику по перебору активной фигуры и игрового поля нужно будет вынести в отдельные методы

        const { x: pieceX, y: pieceY, blocks } = this.activePiece;

        // // получаем копию игрового поля - можно заменить глубоким копированием массива this.playfield ([...arr], recursy)
        const playfield = this.createPlayField();

        // можно заменить методами массивов
        for (let y = 0; y < playfield.length; y++) {  // временно указываем 20, а не берём из переменной
            for (let x = 0; x < playfield[y].length; x++) { // временно указываем 10, а не берём из переменной

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
            playfield, // сокращённая запись свойства playfield: playfield
        }

    }

    createPlayField() {
        // эту генерацию можно заменить new Array(), fill(0 )
        const playfield = [];

        for (let y = 0; y < 20; y++) {  // временно указываем 20, а не берём из переменной
            playfield[y] = [];
            for (let x = 0; x < 10; x++) { // временно указываем 10, а не берём из переменной
                playfield[y][x] = 0;
            }
        }

        return playfield;

    }

    createPiece() {
        // получаем случайное число от 0 до 6 - т.к. в тетрисе 7 фигур 
        const index = Math.floor(Math.random() * 7); // - с одинаковой вероятностью

        const type = 'IJLOSTZ'[index]  // Получаем случайную фигуру. Каждый элемент строки - это название фигуры (её внешний вид)

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

            default:

                throw new Error('Unknown type of piece');
        }

        // задаём координаты появления фигуры, после того как мы уже знаем какая фигура появится

        // 10 - ширина игрового поля - ОТРЕФАКТОРИТЬ - брать из переменной/свойства
        piece.x = Math.floor((10 - piece.blocks[0].length) / 2);
        piece.y = -1; //  у всех фигур верхний ряд в bounding box - пустой

        return piece;
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
        this.activePiece.y++;

        if (this.hasCollision()) {
            this.activePiece.y--;
            this.lockPiece();

            // обновляем значения свойств activePiece и nextPiece
            this.updatePieces();
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


    updatePieces() {
        this.activePiece = this.nextPiece;
        this.nextPiece = this.createPiece();
    }


}