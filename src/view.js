export class View {
    // static colors = [null, 'red', 'yellow', 'yellowgreen', 'green', 'orange', 'cyan', 'purple'];
    static colors = {   // для большей наглядности соответствия цифhы цвету используем объект
        1: 'cyan',
        2: 'blue',
        3: 'orange',
        4: 'yellow',
        5: 'green',
        6: 'purple',
        7: 'red',
    }

    /**
     * 
     * @param {*} element - DOM элемент, куда будет помещено представление (визуализация)
     */
    constructor(element, width, height, rows, columns) {
        this.element = element;
        this.width = width;
        this.height = height;

        // создаём HTML5 холст
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // контекст с помощью которого будем непосредственно  рисовать на холсте
        this.context = this.canvas.getContext('2d');

        // ширина границы
        this.playfieldBoarderWidth = 4; // обязательно число а не строка - будем делать мат операции и не должно быть конкатенации

        // координаты начала игрового поля
        this.playfieldX = this.playfieldBoarderWidth;
        this.playfieldY = this.playfieldBoarderWidth;

        // ширина и высота игрового поля
        this.playfieldWidth = this.width * 2 / 3;
        this.playfieldHeight = this.height;

        // внутренние ширина и высота игрового поля
        this.playfieldInnerWidth = this.playfieldWidth - this.playfieldBoarderWidth * 2;
        this.playfieldInnerHeight = this.playfieldHeight - this.playfieldBoarderWidth * 2;

        this.blockWidth = this.playfieldInnerWidth / columns;
        this.blockHeight = this.playfieldInnerHeight / rows;

        // отступ перед панелью
        this.gap = 30;  // 20 пикселей


        // свойства боковой панели
        this.panelX = this.playfieldWidth + this.gap; // 20px - отсуп между игровым полем и панелью
        // this.panelX = this.playfieldWidth;
        this.panelY = this.gap;
        this.panelWidth = this.width * 1 / 3 - this.gap;
        // this.panelWidth = this.width * 1 / 3;
        this.panelHeight = this.height;

        // добавляем в элемент холст, который мы создали
        this.element.appendChild(this.canvas)

    }


    renderMainScreen(currentState) {
        this.renderPlayField(currentState);
        this.renderPanel(currentState);
    }

    renderStartScreen() {
        this.context.fillStyle = 'whitesmoke';
        this.context.font = '3.0rem "Arial"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText(`Press ${this.getPauseBtnName()} to Start`, this.width / 2, this.height / 2);
    }

    renderPauseScreen() {
        this.context.fillStyle = 'rgba(0,0,0,0.25)';
        this.context.fillRect(0, 0, this.width, this.height);

        this.context.fillStyle = 'whitesmoke';
        this.context.font = '3.0rem "Arial"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText(`Press ${this.getPauseBtnName()} to Resume`, this.width / 2, this.height / 2);
    }

    renderEndScreen(currentState) {
        const { score } = currentState

        this.clearScreen()

        this.context.fillStyle = 'whitesmoke';
        this.context.font = '3.0rem "Arial"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('GAME OVER', this.width / 2, this.height / 2 - 50);
        this.context.fillText(`Score: ${score}`, this.width / 2, this.height / 2);
        this.context.fillText(`Press ${this.getPauseBtnName()} to Retry`, this.width / 2, this.height / 2 + 100);

    }

    getPauseBtnName() {
        return ('ontouchstart' in document.documentElement) ? 'Start/Pause' : 'SPACE or ESC';
    }

    //  метод который будет рисовать игровое поле. В качестве аргумента принимает двухмерный массив (playfield), на основе которого будет строить представление (т.е. наше игровое поле).
    // Логика метода: перебираем массив и на каждый непустой элемент что-то отрисовываем
    renderPlayField(currentState) {

        const { playfield } = currentState;


        for (let y = 0; y < playfield.length; y++) {
            const line = playfield[y];

            for (let x = 0; x < line.length; x++) {
                const block = line[x];

                // const indexColor = (Math.floor(Math.random() * 7) + block) % 7;


                // для непустых ячеек отрисовываем блок, пустые - очищаем
                this.renderBlock(
                    block,
                    // (x * this.blockWidth),
                    // (y * this.blockHeight),
                    this.playfieldX + (x * this.blockWidth),
                    this.playfieldY + (y * this.blockHeight),
                    this.blockWidth,
                    this.blockHeight,
                    View.colors[block],
                    // 'red', // фиксированный цвет
                )

            }
        }

        // задаём свойства границы игрового поля
        this.context.strokeStyle = 'whitesmoke';
        this.context.lineWidth = this.playfieldBoarderWidth;
        // непосредственно рисуем границу игрового поля
        this.context.strokeRect(0, 0, this.playfieldWidth, this.playfieldHeight)

    }

    renderPanel(currentState) {
        const { level, score, lines, nextPiece } = currentState
        // задаём необходимые свойства context-у canvas-а
        this.context.textAlign = 'start';
        this.context.textBaseline = 'top'; // форматируем текст по верхнему краю
        this.context.fillStyle = 'white' // цвет текста
        // this.context.font = '1.4rem "Press Start 2P"';
        this.context.font = '1.8rem "Arial"';

        // предварительно очищаем панель - иначе изображения накладываются
        this.context.clearRect(this.panelX, this.panelY, this.panelWidth, this.panelHeight)

        // теперь выводим информацию в боковую панель
        this.context.fillText(`Score:  ${score}`, this.panelX + 0, this.panelY + 0); // выводим текст в canvas (на холст)
        this.context.fillText(`Lines:   ${lines}`, this.panelX + 0, this.panelY + 25); // выводим текст в canvas (на холст)
        this.context.fillText(`Level:   ${level}`, this.panelX + 0, this.panelY + 50); // выводим текст в canvas (на холст)
        this.context.fillText(`Next:`, this.panelX + 0, this.panelY + 100); // 


        for (let y = 0; y < nextPiece.blocks.length; y++) {
            for (let x = 0; x < nextPiece.blocks[y].length; x++) {
                const blockOfNextPiece = nextPiece.blocks[y][x];

                this.renderBlock(
                    blockOfNextPiece,
                    this.panelX + (x * this.blockWidth * 0.75),
                    this.panelY + 125 + (y * this.blockHeight * 0.75),
                    this.blockWidth * 0.75,
                    this.blockHeight * 0.75,
                    View.colors[blockOfNextPiece]
                );


            }

        }

    }

    renderBlock(block, x, y, width, height, color) {
        if (block) {
            this.context.fillStyle = color; // цвет заливки
            this.context.strokeStyle = 'black'  // цвет обводки
            this.context.lineWidth = 2;// ширина обводки (2 пикселя)

            //  непосредственно рисование
            this.context.fillRect(x, y, width, height);
            this.context.strokeRect(x, y, width, height)

        } else { // в случае пустой ячейки в переданном текущем состоянии поля - очищаем canvas (холст)
            this.context.clearRect(x, y, width, height)
        }
    }

    /* можно разбить renderPlayField() на 
     общий метод render(), вызвывающий при if - renderPlayField() и при else - clearScreen()
    но т.к. мой метод renderBlock очищает только пустые ячейки за один проход цикла - отдельный метод clearScreen(), предварительно очищающий всё игровое поле - не нужен. 
    */


    clearScreen() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

}

export const colorsNumber = Object.keys(View.colors).length;

