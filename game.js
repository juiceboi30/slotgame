const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  "A": 2,
  "B": 4,
  "C": 6,
  "D": 8
};
const SYMBOL_VALUES = {
  "A": 5,
  "B": 4,
  "C": 3,
  "D": 2
};

let balance = 0;
let round = 0;

function startGame() {
  const deposit = parseFloat(document.getElementById("deposit").value);
  if (isNaN(deposit) || deposit <= 0) {
    alert("Invalid deposit amount!");
    return;
  }
  balance = deposit;
  document.getElementById("balance").innerText = balance;
  document.getElementById("controls").style.display = "block";
}

function spin() {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }
  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
}

function transpose(reels) {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
}

function printRows(rows) {
  const gameDiv = document.getElementById("game");
  gameDiv.innerHTML = "";
  rows.forEach(row => {
    const div = document.createElement("div");
    div.className = "row";
    div.textContent = row.join(" | ");
    gameDiv.appendChild(div);
  });
}

function getWinnings(rows, bet, lines) {
  let winnings = 0;
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = symbols.every(s => s === symbols[0]);
    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }
  return winnings;
}

function playRound() {
  const lines = parseInt(document.getElementById("lines").value);
  const bet = parseFloat(document.getElementById("bet").value);

  if (isNaN(lines) || lines < 1 || lines > 3) {
    alert("Invalid number of lines!");
    return;
  }
  if (isNaN(bet) || bet <= 0 || bet * lines > balance) {
    alert("Invalid bet amount!");
    return;
  }

  const totalBet = bet * lines;
  balance -= totalBet;

  const reels = spin();
  const rows = transpose(reels);
  printRows(rows);

  const winnings = getWinnings(rows, bet, lines);
  balance += winnings;

  document.getElementById("balance").innerText = balance;
  document.getElementById("result").innerText = "You won $" + winnings;

  round++;
  updateHistory(round, totalBet, winnings, totalBet - winnings, balance);

  if (balance <= 0) {
    alert("Game over! You're out of money.");
    document.getElementById("controls").style.display = "none";
  }
}

function updateHistory(round, bet, won, lost, balanceAfter) {
  const tbody = document.querySelector("#history tbody");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${round}</td>
    <td>$${bet}</td>
    <td style="color:lightgreen;">$${won}</td>
    <td style="color:red;">$${lost}</td>
    <td>$${balanceAfter}</td>
  `;

  tbody.appendChild(row);
}
