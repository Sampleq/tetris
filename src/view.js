export class View {

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


        this.blockWidth = this.width / columns;
        this.blockHeight = this.height / rows;


        // добавляем в элемент холст, который мы создали
        this.element.appendChild(this.canvas)

    }


    //  метод который будет рисовать игровое поле. В качестве аргумента принимает двухмерный массив (playfield), на основе которого будет строить представление (т.е. наше игровое поле).
    // Логика метода: перебираем массив и на каждый непустой элемент что-то отрисовываем
    renderPlayField(currentState) {

        const { playfield } = currentState

        for (let y = 0; y < playfield.length; y++) {
            const line = playfield[y];

            for (let x = 0; x < line.length; x++) {
                const block = line[x];

                // для непустых ячеек отрисовываем блок, пустые - очищаем
                this.renderBlock(block,
                    x * this.blockWidth,
                    y * this.blockHeight,
                    this.blockWidth,
                    this.blockHeight,
                    'red',
                )

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



}
