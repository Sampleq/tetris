// rotation - rotatePiece() - calculated, WITHOUT temporary array

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
        }
    }

    rotatePiece() {
        this.rotateBlocks();

        if (this.hasCollision()) {
            this.rotateBlocks(false);
        }
    }

    rotateBlocks(clockwise = true) {
        const blocks = this.activePiece.blocks;
        const length = blocks.length;

        const x = Math.floor(length / 2);
        const y = length - 1;

        for (let i = 0; i < x; i++) {
            for (let j = i; j < y - i; j++) {
                //создадим переменную для сохранения промежуточного значения - оно нужно, т.к. мы изменяем значения внутри действующего массива.
                const temp = blocks[i][j];

                if (clockwise) {
                    // для того чтобы переставлять элементы в массиве - освобождается одно место в масиве (как в пятнашках) - его значение сохранено в temp - чтобы вставлять туда значения из других ячеек,  и далее тоже самое с  новым освободившимся местом.
                    // Сначала "поворачиваются" (последовательным копированием) углы квадрата, затем внутренние ячейки - т.к.  у нас матрица 3х3 - то поворачивается "крестик" внутри квадрата.

                    // поворот по часовой стрелке
                    blocks[i][j] = blocks[y - j][i];
                    blocks[y - j][i] = blocks[y - i][y - j];
                    blocks[y - i][y - j] = blocks[j][y - i];
                    blocks[j][y - i] = temp;
                } else {
                    // поворот против часовой стрелки
                    blocks[i][j] = blocks[j][y - i];
                    blocks[j][y - i] = blocks[y - i][y - j];
                    blocks[y - i][y - j] = blocks[y - j][i];
                    blocks[y - j][i] = temp;
                }

            }
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
        // метод lockPiece() не очищает поле от предыдущей позции фигуры activePiece после повторного применения - но это не важно, т.к. он  не будет вызываться при каждом движении, а будет вызываться только когда фигура дойдёт до конца поля или столкнётся с другой фигурой, а также перед представлением - отрисовкой игрового поля для пользователя.
    }

    constructor() {

    }
}