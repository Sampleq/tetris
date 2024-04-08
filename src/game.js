export class Game {
    score = 0;
    lines = 0;
    level = 0;

    // // !! -remade with new Array(20), fill() etc. 
    // объект игрового поля - двухмерный массив
    playfield = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

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
    activePiece = {
        x: 0,
        y: 0,
        blocks: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ],

    }

    // методы перемещения активной фигуры
    movePieceLeft() {
        this.activePiece.x--;

        if (this.isPieceOutOfBounds()) {
            this.activePiece.x++;
        }
    }

    movePieceRight() {
        this.activePiece.x++;

        if (this.isPieceOutOfBounds()) {
            this.activePiece.x--;
        }
    }

    movePieceDown() {
        this.activePiece.y++;

        if (this.isPieceOutOfBounds() || this.isCollided()) {
            this.activePiece.y--;
            this.lockPiece();
        }
    }

    // метод для проверки на выход за пределы поля
    isPieceOutOfBounds() {
        const playfield = this.playfield;
        const { x: pieceX, y: pieceY, blocks } = this.activePiece;
        // pieceX, pieceY - координаты массива с фигурой внутри поля playfield
        // x, y внутри цикла - локальные индексы внутри двумерного массива с фигурой activePiece

        // получаем доступ к ряду и колонке в котором находится activePiece (с учётом размеров текущей активной фигуры - для простоты проверяем каждый элемент фигуры) и проверяем что такие значения существуют (т.е. что мы не вышли за пределы поля)
        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {

                // проверяем что "ячейка" массива activePiece не пустая а затем  проверяем значение поля при сложении координат положения фигуры  activePiece и её внутренних координат её блока. Приоритет оператора && больше, чем у || - поэтому нужны скобки
                if (blocks[y][x] !== 0 &&
                    (playfield[pieceY + y] === undefined ||
                        playfield[pieceY + y][pieceX + x] === undefined)
                ) {
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
        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                // копируем значение из blocks в playfield  на соответствующее место, при этом проверяя что значение в blocks не равно нулю - чтобы можно было зафиксировать фигуру, которая повёрныта внутри своего блока так что не заниммает все столбцы или колонки своего блока - т.е. нули копироваться не будут
                // console.log(blocks[y][x]);
                // console.log(this.playfield[pieceY][pieceX]);

                // if (blocks[y][x]) { 
                // оставил !== 0 ( т.е. без приведения типов)для большей ясности
                if (blocks[y][x] !== 0) {
                    this.playfield[pieceY + y][pieceX + x] = blocks[y][x];
                }
            }
        }

        console.log('lockPiece()');
        // метод lockPiece() не очищает поле от предыдущей позции фигуры activePiece после повторного применения - но это не важно, т.к. он  не будет вызываться при каждом движении, а будет вызываться только когда фигура дойдёт до конца поля или столкнётся с другой фигурой, а также перед представлением - отрисовкой игрового поля для пользователя.
    }

    isCollided() {
        const playfield = this.playfield;
        const { x: pieceX, y: pieceY, blocks } = this.activePiece;

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {

                if (blocks[y][x] !== 0 &&
                    (playfield[pieceY + y] !== undefined && // эту строку можно убрать
                        playfield[pieceY + y][pieceX + x] !== 0)
                ) {
                    console.log(y);
                    console.log(x);
                    console.log(blocks[y][x]);
                    console.log(playfield[pieceY + y]);
                    console.log(playfield[pieceY + y][pieceX + x]);
                    console.log('isCollided()');
                    return true;
                }

            }
        }

        return false;
    }

    constructor() {

    }
}