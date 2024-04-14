// устанавливает взаимодействие между представлением и логикой
export class Controller {

    // для возможности управления  - получаем доступ к объектам игры и представления
    constructor(game, view, btns) {
        this.game = game;
        this.view = view;
        this.isPaused = true;

        this.btns = btns;
        this.btnLeft = this.btns.querySelector('.btn_left');
        this.btnRight = this.btns.querySelector('.btn_right');
        this.btnDown = this.btns.querySelector('.btn_down');
        this.btnRotate = this.btns.querySelector('.btn_rotate');
        this.btnPause = this.btns.querySelector('.btn_pause');

        this.intervalBtnL = null;
        this.timeoutBtnL = null;

        this.intervalBtnR = null;
        this.timeoutBtnR = null;

        this.intervalBtnD = null;
        this.timeoutBtnD = null;

        this.intervalBtnRt = null;
        this.timeoutBtnRt = null;

        this.intervalId = null;

        // setInterval(() => {
        //     if (!this.isPaused) {
        //         this.update();
        //     }
        //     console.log('tic');
        // }, 1000);



        document.addEventListener('keydown', (event) => this.handleKeyDown(event));

        // //   при зажатой клавише вниз таймер сдвига вниз всё равно срабатывает - получаем лишний(??) сдвиг вниз -  разве это баг? . чисто попробовать как играется с отключением таймера
        // document.addEventListener('keyup', (event) => this.handleKeyUp(event));

        //  листнеры для виртуальных кнопок
        this.btns.addEventListener('click', (event) => this.handleBtns(event));

        this.btns.addEventListener('touchstart', (event) => this.hoverBtns(event));
        this.btns.addEventListener('touchend', (event) => this.unhoverBtns(event));

        this.btns.addEventListener('touchstart', (event) => this.holdBtns(event));
        this.btns.addEventListener('touchend', (event) => this.releaseBtns(event));


        // only for Mouse devices. NOT touchscreens
        if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
            this.btns.addEventListener('mousedown', (event) => this.holdBtns(event));
            this.btns.addEventListener('mouseup', (event) => this.releaseBtns(event));

            console.log(true, `matchMedia('(hover: hover) and (pointer: fine)').matches`)
        } else {
            console.log(false, `matchMedia('(hover: hover) and (pointer: fine)').matches`)
        }



        this.view.renderStartScreen();

    }


    update() {
        this.game.movePieceDown();
        const currentState = this.game.getState();
        this.view.renderMainScreen(currentState);


        if (currentState.isGameOver) {
            console.log('currentState.isGameOver', currentState.isGameOver);

            // GameOver - по сути ставит игру на паузу и вешает флаг isGameOver после которого игра сбрасывается при перезапуске
            this.pause();
            this.view.renderEndScreen(currentState)
        }
    }

    pause() {
        // обязательно очищаем  интервалы эмулирующие зажатие нарисованых кнопок
        clearTimeout(this.timeoutBtnL);
        clearInterval(this.intervalBtnL);
        clearTimeout(this.timeoutBtnR);
        clearInterval(this.intervalBtnR);
        clearTimeout(this.timeoutBtnD);
        clearInterval(this.intervalBtnD);
        clearTimeout(this.timeoutBtnRt);
        clearInterval(this.intervalBtnRt);

        this.isPaused = true;
        this.view.renderPauseScreen();
        this.stopTimer();
    }

    play() {
        this.isPaused = false;
        this.view.clearScreen();
        this.view.renderMainScreen(this.game.getState());
        this.startTimer();
    }

    startTimer() {
        const speed = 1000 - this.game.getState().level * 100


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
            case 'Space':
            case 'Escape':
                if (this.game.isGameOver) {
                    this.resetGame();
                }

                if (this.isPaused) {
                    this.play();
                } else {
                    this.pause();
                }

                // this.isPaused = !this.isPaused; - лучше вынести в методы
                break;
        }

        switch (this.isPaused || this.game.isGameOver || event.code) { //  || вместо if-ов
            case 'ArrowLeft': // Left Arrow
            case 'KeyL': // L
            case 'KeyA': // A
                this.game.movePieceLeft();
                this.view.renderMainScreen(this.game.getState()); // вызываем после движения
                break;

            case 'ArrowRight':
            case 'KeyD': // D
            case 'Quote': // '
                this.game.movePieceRight();
                this.view.renderMainScreen(this.game.getState());

                break;

            case 'ArrowDown':
            case 'KeyS': //  S
            case 'Semicolon': // ;
                // this.stopTimer();  //  для использования с handleKeyUp(event)
                this.game.movePieceDown();
                this.view.renderMainScreen(this.game.getState());

                break;

            case 'Enter':
            case 'ArrowUp':
            case 'KeyW': // W
                this.game.rotatePiece();
                this.view.renderMainScreen(this.game.getState());

                break;

            // case '': // 

            //     break;
        }

    }

    handleBtns(event) {
        // // only for touch screens
        // if (matchMedia('(pointer:coarse)').matches) {
        //     return
        // }

        console.log(event.target);
        switch (event.target) {

            case this.btnPause:

                if (this.game.isGameOver) {
                    this.resetGame();
                }

                if (this.isPaused) {
                    this.play();
                } else {
                    this.pause();
                }

                // this.isPaused = !this.isPaused; - лучше вынести в методы
                break;
        }

    }

    holdBtns(event) {

        // unify the touch and click event in one common event:  - ивенты тача и mousedown   нельзя просто объединять - глючит на iOS !!! - надо отключать листнеры mousedown  для тачскринов
        event = (event.changedTouches) ? event.changedTouches[0] : event

        const timeoutBtnDelay = 500;
        const intervalBtnDelay = 100;


        switch (this.isPaused || this.game.isGameOver || event.target) { //  || вместо if-ов

            case this.btnLeft:

                this.game.movePieceLeft();
                this.view.renderMainScreen(this.game.getState()); // вызываем после движения

                this.timeoutBtnL = setTimeout(() => {
                    this.intervalBtnL = setInterval(() => {
                        console.log('intervalBtnL')
                        this.game.movePieceLeft();
                        this.view.renderMainScreen(this.game.getState());
                    }, intervalBtnDelay);
                }, timeoutBtnDelay);


                break;

            case this.btnRight:

                this.game.movePieceRight();
                this.view.renderMainScreen(this.game.getState());

                this.timeoutBtnR = setTimeout(() => {
                    this.intervalBtnR = setInterval(() => {
                        this.game.movePieceRight();
                        this.view.renderMainScreen(this.game.getState());
                    }, intervalBtnDelay);
                }, timeoutBtnDelay);


                break;

            case this.btnDown:

                this.game.movePieceDown();
                this.view.renderMainScreen(this.game.getState());

                this.timeoutBtnD = setTimeout(() => {
                    this.intervalBtnD = setInterval(() => {
                        console.log('intervalBtnD')
                        this.game.movePieceDown();
                        this.view.renderMainScreen(this.game.getState());
                    }, intervalBtnDelay);
                }, timeoutBtnDelay);

                break;

            case this.btnRotate:

                this.game.rotatePiece();
                this.view.renderMainScreen(this.game.getState());

                this.timeoutBtnRt = setTimeout(() => {
                    this.intervalBtnRt = setInterval(() => {
                        console.log('intervalBtnRt')
                        this.game.rotatePiece();
                        this.view.renderMainScreen(this.game.getState());
                    }, intervalBtnDelay * 2.5);
                }, timeoutBtnDelay);

                break;
        }
    }

    releaseBtns(event) {
        switch (this.isPaused || this.game.isGameOver || event.target) { //  || вместо if-ов

            case this.btnLeft:
            case this.btnRight:
            case this.btnDown:
            case this.btnRotate:

                clearTimeout(this.timeoutBtnL);
                clearInterval(this.intervalBtnL);
                clearTimeout(this.timeoutBtnR);
                clearInterval(this.intervalBtnR);
                clearTimeout(this.timeoutBtnD);
                clearInterval(this.intervalBtnD);
                clearTimeout(this.timeoutBtnRt);
                clearInterval(this.intervalBtnRt);
                break;
        }
    }

    // btns mobile hover effect
    hoverBtns(event) {
        event.changedTouches[0].target.classList.add('btn_hover');
    }
    unhoverBtns(event) {
        event.changedTouches[0].target.classList.remove('btn_hover');
    }


    // handleKeyUp(event) {
    //     switch (this.isPaused || this.game.topOut || event.code) {
    //         case 'ArrowDown': //  Arrow Down
    //         case 'KeyS': //  S
    //         case 'Semicolon': // Semicolon ;
    //             this.startTimer();

    //             break;
    //     }
    // }


}