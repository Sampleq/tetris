// устанавливает взаимодействие между представлением и логикой
export class Controller {

    // для возможности управления  - получаем доступ к объектам игры и представления
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.isPaused = true;

        // можно переписать чтобы при паузе setInterval очищался при помощи clearInterval
        setInterval(() => {
            if (!this.isPaused) {
                this.update();
            }
            console.log('tic');
        }, 1000);



        document.addEventListener('keydown', (event) => this.handleKeyDown(event));

        this.view.renderStartScreen();

    }


    update() {
        this.game.movePieceDown();
        this.view.renderMainScreen(this.game.getState());
    }

    handleKeyDown(event) {
        // console.log(event.code);
        switch (event.code) {
            case 'ArrowLeft': // Left Arrow
            case 'KeyL': // L
            case 'KeyA': // A
                this.game.movePieceLeft();
                this.view.renderMainScreen(this.game.getState()); // вызываем после движения
                break;

            case 'ArrowRight': // RightArrow
            case 'KeyD': // D
            case 'Quote': // Quote '
                this.game.movePieceRight();
                this.view.renderMainScreen(this.game.getState());

                break;

            case 'ArrowDown': //  Arrow Down
            case 'KeyS': //  S
            case 'Semicolon': // Semicolon ;
                this.game.movePieceDown();
                this.view.renderMainScreen(this.game.getState());

                break;

            case 'Enter': // Enter 
            case 'ArrowUp': // ArrowUp
            case 'KeyW': // W
                this.game.rotatePiece();
                this.view.renderMainScreen(this.game.getState());

                break;

            case 'Space': //  Space
            case 'Escape': //  Escape

                if (this.isPaused) {
                    this.view.clearScreen();
                    this.view.renderMainScreen(this.game.getState());
                } else {
                    this.view.renderPauseScreen();
                }

                this.isPaused = !this.isPaused;


                break;

            // case '': // 

            //     break;

            default:
                break;
        }

        // view.render(game.getState());

    }

}