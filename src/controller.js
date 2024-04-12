// устанавливает взаимодействие между представлением и логикой
export class Controller {

    // для возможности управления  - получаем доступ к объектам игры и представления
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.isPaused = true;

        // можно переписать чтобы при паузе setInterval очищался при помощи clearInterval
        this.intervalId = null;

        // setInterval(() => {
        //     if (!this.isPaused) {
        //         this.update();
        //     }
        //     console.log('tic');
        // }, 1000);



        document.addEventListener('keydown', (event) => this.handleKeyDown(event));

        this.view.renderStartScreen();

    }


    update() {
        this.game.movePieceDown();
        const currentState = this.game.getState();
        this.view.renderMainScreen(currentState);


        if (currentState.isGameOver) {
            console.log('currentState.isGameOver', currentState.isGameOver);

            // this.stopTimer();
            this.isPaused = true;
            this.pause();
            this.view.renderEndScreen(currentState)
        }
    }

    pause() {
        this.view.renderPauseScreen();
        this.stopTimer();
    }

    play() {
        this.view.clearScreen();
        this.view.renderMainScreen(this.game.getState());
        this.startTimer();
    }

    startTimer() {
        const speed = 1000 - this.game.getState().level * 75


        this.intervalId = setInterval(() => {
            this.update();
            console.log('tic');

        }, (speed > 0) ? speed : 100);
    }

    stopTimer() {
        clearInterval(this.intervalId);
        console.log('timer stopped');
    }

    resetGame() {
        this.game.playfield = this.game.createPlayField();
        this.game.topOut = false;
        this.game.score = 0;
        this.game.lines = 0;
        this.game.updatePieces();
    }


    handleKeyDown(event) {
        // console.log(event.code);
        switch (event.code) {
            case 'Space': //  Space
            case 'Escape': //  Escape

                if (this.isPaused) {
                    if (this.game.getState().isGameOver) {
                        this.resetGame();
                    }

                    this.play();

                    // this.view.clearScreen();
                    // this.view.renderMainScreen(this.game.getState());
                } else {
                    this.pause();

                    // this.view.renderPauseScreen();
                }

                this.isPaused = !this.isPaused;
                break;
        }

        switch (this.isPaused || this.game.topOut || event.code) { //  || вместо if-ов
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

            // case '': // 

            //     break;

            default:
                break;
        }

        // view.render(game.getState());

    }

}