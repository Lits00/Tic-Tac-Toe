const gameboard = (() => {
    const _board = ["", "", "", "", "", "", "", "", ""];

    const render = () => {
        const buttons = document.querySelectorAll('.slot');
        buttons.forEach((button, index) => {
            button.textContent = _board[index];
        });
    };
    
    const getBoard = () => _board;

    const reset = () => {
        for(let i = 0; i < _board.length; i++){
            _board[i] = "";
        }
    }

    return { render, getBoard, reset }

})();

// factory function for player
const Player = mark => {
    const _marker = mark;

    const getMarker = () => _marker;

    return { getMarker };
};

// Game control
const game = (() => {
    const _playerX = Player("X");
    const _playerO = Player("O");
    let _currentPlayer = _playerX;
    let endGame = false;
    let tie = false;
    let winner;

    const board = gameboard.getBoard();
    const playerTurn = document.querySelector('.currentPlayer');
    const restart = document.getElementById('restart');

    const play = () => {
        const buttons = document.querySelectorAll('.slot');

        buttons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                if(endGame || board[index] !== "") return;
                board[index] = _currentPlayer.getMarker();
                gameboard.render();
                _currentPlayer = _currentPlayer === _playerX ? _playerO : _playerX;
                playerTurn.textContent = `Player ${_currentPlayer.getMarker()}'s turn`;
                if(checkWinner()) {
                    displayController.result(winner);
                    playerTurn.textContent = `Game Over!`;
                } 
                if(!checkWinner() && checkTie()) {
                    displayController.result();
                    playerTurn.textContent = `Game Over!`;
                }
            })
        })
    };

    // check for mark pattern
    const checkWinner = () => {
        // win _board[index] pattern
        winPattern = [
            // horizontal win pattern
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            // vertical win pattern
            [0, 3 ,6],
            [1, 4, 7],
            [2, 5, 8],
            // diagonal win pattern
            [0, 4, 8],
            [2, 4, 6]
        ];

        for(let i = 0; i < winPattern.length; i++){
            const [a, b, c] = winPattern[i];
            if(board[a] && board[a] === board[b] && board[a] === board[c]) {
                winner = board[a];
                endGame = true;
                return true;
            }
        }
        return false;
    };

    const checkTie = () => {
        if(board.includes("")) return false;
        return true;
    }

    restart.addEventListener('click', () => {
        _currentPlayer = _playerX;
        endGame = false;

        const gameResult = document.getElementById('game-result');
        gameResult.style.display = 'none';
        playerTurn.textContent = `Player ${_currentPlayer.getMarker()}'s turn`;

        gameboard.reset();
        gameboard.render();
    });

    return { play };
})();

const displayController = (() => {
    const gameResult = document.getElementById('game-result');
    const para = document.querySelector('.gameWinner');

    // initiates game logic
    game.play();

    const result = sign => {    
        gameResult.style.display = 'block';
        if(sign === undefined){
            para.textContent = `It's a Tie!`
        } else {
            para.textContent = `Player ${sign} wins !`
        }
    };

    return { result };
})();