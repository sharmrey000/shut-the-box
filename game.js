let player1Name = "";
let player2Name = "";
let player1Points = 0;
let player2Points = 0;
let currentPlayer = 1;
let round = 1;
let boxes = [0, 0, 0, 0, 0, 0, 0, 0, 0];

const startBtn = document.getElementById("start-btn");
const rollBtn = document.getElementById("roll-btn");
const individualBtn = document.getElementById("individual-btn");
const sumBtn = document.getElementById("sum-btn");
const endTurnBtn = document.getElementById("end-turn-btn");
const player1NameInput = document.getElementById("player1-name");
const player2NameInput = document.getElementById("player2-name");
const currentPlayerDisplay = document.getElementById("current-player");
const roundDisplay = document.getElementById("round-display");
const winnerSection = document.querySelector(".winner");
const playAgainBtn = document.getElementById("play-again-btn");
const gameBoard = document.querySelector(".game-board");

function updatePlayerDisplay() {
    currentPlayerDisplay.textContent = `It's ${currentPlayer === 1 ? player1Name : player2Name}'s turn!`;
    roundDisplay.textContent = `Round: ${round}`;
}

function resetBoard() {
    boxes = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const boxElements = document.querySelectorAll(".box");
    boxElements.forEach(function(box, index) {
        box.classList.remove("shut");
        box.textContent = index + 1;
    });
}

function endTurn() {
    let pointsThisTurn = 0;


    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i] === 0) {
            pointsThisTurn += i + 1;
        }
    }

    if (currentPlayer === 1) {
        player1Points += pointsThisTurn;
    } else {
        player2Points += pointsThisTurn;
    }


    const row = document.createElement("tr");
    row.innerHTML = `
        <th>Round ${round}</th>
        <td class="p1Pts">${currentPlayer === 1 ? pointsThisTurn : ""}</td>
        <td class="p2Pts">${currentPlayer === 2 ? pointsThisTurn : ""}</td>
    `;
    document.querySelector("tbody").appendChild(row);


    if (round >= 5) {
        gameOver();
    } else {
        nextTurn();
    }
}

function nextTurn() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;

    if (currentPlayer === 1) {
        round++;
    }

    updatePlayerDisplay();
    resetBoard();
    enableButtons();
}

function gameOver() {
    gameBoard.style.display = "none";
    winnerSection.style.display = "block";
    const winner = player1Points > player2Points ? player1Name : player2Name;
    document.getElementById("winner-name").textContent = `${winner} wins!`;
    playAgainBtn.style.display = "block";
}

function playAgain() {
    player1Name = "";
    player2Name = "";
    player1Points = 0;
    player2Points = 0;
    round = 1;
    boxes = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    document.querySelector("tbody").innerHTML = "";
    gameBoard.style.display = "block";
    winnerSection.style.display = "none";
    playAgainBtn.style.display = "none";
    enableButtons();
    updatePlayerDisplay();
}

function enableButtons() {
    rollBtn.disabled = false;
    individualBtn.disabled = false;
    sumBtn.disabled = false;
    endTurnBtn.disabled = true;
}

function disableButtons() {
    rollBtn.disabled = true;
    individualBtn.disabled = true;
    sumBtn.disabled = true;
    endTurnBtn.disabled = true;
}

function disableAction(activeAction) {
    if (activeAction === "individual") {
        sumBtn.disabled = true;
    } else if (activeAction === "sum") {
        individualBtn.disabled = true;
    }
}

startBtn.addEventListener("click", function() {
    player1Name = player1NameInput.value.trim();
    player2Name = player2NameInput.value.trim();

    if (!player1Name || !player2Name) {
   
        return;
    }

    document.querySelector(".game-setup").style.display = "none";
    gameBoard.style.display = "block";
    updatePlayerDisplay();
    enableButtons();
});

rollBtn.addEventListener("click", function() {
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;

    document.getElementById("die1").className = `bi bi-dice-${die1}`;
    document.getElementById("die2").className = `bi bi-dice-${die2}`;

    const sum = Number(die1) + Number(die2);

    if ((boxes[die1 - 1] === "X" && boxes[die2 - 1] === "X") || sum > 9 || boxes[sum - 1] === "X") {

        rollBtn.disabled = true;
        endTurnBtn.disabled = false;
    } else {
        individualBtn.disabled = false;
        sumBtn.disabled = false;
    }
});

individualBtn.addEventListener("click", function() {
    const die1 = document.getElementById("die1").className.split("-")[2];
    const die2 = document.getElementById("die2").className.split("-")[2];

    if (boxes[die1 - 1] !== "X") {
        boxes[die1 - 1] = "X";
        document.getElementById(`box${die1}`).classList.add("shut");
    }

    if (boxes[die2 - 1] !== "X") {
        boxes[die2 - 1] = "X";
        document.getElementById(`box${die2}`).classList.add("shut");
    }

    disableAction("individual");

    if (boxes.every(box => box === "X")) {

        disableButtons();
        endTurnBtn.disabled = false;
    } else {
        rollBtn.disabled = false;
    }
});

sumBtn.addEventListener("click", function() {
    const die1 = document.getElementById("die1").className.split("-")[2];
    const die2 = document.getElementById("die2").className.split("-")[2];

    const sum = Number(die1) + Number(die2);

    if (sum > 9 || boxes[sum - 1] === "X") {

    } else {
        boxes[sum - 1] = "X";
        document.getElementById(`box${sum}`).classList.add("shut");
    }

    disableAction("sum");

    if (boxes.every(function(box) { return box === "X"; })) {

        disableButtons();
        endTurnBtn.disabled = false;
    } else {
        rollBtn.disabled = false;
    }
});

endTurnBtn.addEventListener("click", endTurn);

playAgainBtn.addEventListener("click", playAgain);
