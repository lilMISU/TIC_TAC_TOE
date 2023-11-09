const displayController = (()=>{
    const renderMessage = (message) =>{
        document.querySelector("#message").innerHTML = message;
    }

    return {
        renderMessage,
    }
})();

var Gameboard = (function () {
    let gameboard = ["", "", "", "", "", "", "", "", ""];

    const render = () => {
        let boardHTML = "";
        gameboard.forEach((square, index) => {
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`

        });
        document.querySelector('#gameboard').innerHTML = boardHTML;
        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", Game.handleClick);
        })
    };

    const update = (index, value) => {
        gameboard[index] = value;
        render();
    }

    const getGameboard = () => {
        return gameboard;
    }

    return {
        render,
        update,
        getGameboard,
    }

})();

const createPlayer = (name, mark) => {
    return {
        name,
        mark
    }
};

const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const start = () => {
        players = [
            createPlayer(document.querySelector('#player1').value, "X"),
            createPlayer(document.querySelector('#player2').value, "O")
        ];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();
        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", handleClick);
        })
    }

    const restart = () =>{
        for(let i=0;i<9;i++)
        {
            Gameboard.update(i,"");
        }

        Gameboard.render();
        currentPlayerIndex = 0;
        gameOver = false;
        displayController.renderMessage("");
    }

    const handleClick = (event) => {
        if(gameOver)
        return;
        
        let index = parseInt(event.target.id.split("-")[1]);

        if (Gameboard.getGameboard()[index] !== "")
            return;

        Gameboard.update(index, players[currentPlayerIndex].mark);

        if(checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)){
            gameOver = true;
            displayController.renderMessage(`${players[currentPlayerIndex].name} won!`)
        }
        else if(checkForTie(Gameboard.getGameboard())){
            gameOver=true;
            displayController.renderMessage("ITS A TIE");
        }

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }



    return {
        start,
        restart,
        handleClick,
    }
})();

function checkForWin(board){
    const winningCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,4,8],
        [2,4,6],
        [0,3,6],
        [1,4,7],
        [2,5,8]
    ]

    for(let i=0;i<winningCombinations.length;i++){
        const [a,b,c] = winningCombinations[i];
        if(board[a] === board[b] && board[a] === board[c] && board[a])
        return true;
    }
    return false;
}

function checkForTie(board){
    return board.every(cell => cell !== "");
}

const startButton = document.getElementById("start-button");
startButton.addEventListener("click", () => {
    Game.start();
});

const restartButton = document.getElementById("restart-button");
restartButton.addEventListener("click", () => {
    Game.restart();
});