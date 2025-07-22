const video = document.querySelector(".vid");
const gameBackground = document.querySelector(".game-start");
const startCont = document.querySelector(".first");
const endCard = document.querySelector(".end-card");
const point = document.querySelector(".point");

const daywalker = document.querySelector(".daywalker");
const vampire = document.querySelector(".vampire");
const player = document.querySelector(".player");
const bot = document.querySelector(".bot");
const scorePlayer = document.querySelectorAll("#scorePlayer");
const scoreBot = document.querySelectorAll("#scoreBot");
const timer = document.querySelector("#time");
const platform = document.querySelector(".platform");

let masPlayer = [];
let masBot = [];
function ChoosePerson(name) {
  if (name === "mark") {
    player.src = `assets/1-first/${name}.png`;
    bot.src = `assets/1-first/mula.png`;
    gameBackground.classList.add("l3");
  } else if (name === "mula") {
    player.src = `assets/1-first/${name}.png`;
    bot.src = `assets/1-first/endi.png`;
    gameBackground.classList.remove("l2");
    gameBackground.classList.add("l3");
  } else if (name === "endi") {
    player.src = `assets/1-first/${name}.png`;
    bot.src = `assets/1-first/liza.png`;
    gameBackground.classList.add("l2");
  } else {
    player.src = `assets/1-first/${name}.png`;
    bot.src = `assets/1-first/mark.png`;
    gameBackground.classList.add("l2");
  }
  startCont.classList.add("hidden");
  gameBackground.classList.remove("hidden");
  startGame();
}

let playerScore = 0;
let botScore = 0;
let botCaught = 0;
let selectedPlayer = "daywalker";
let timeInterval;
let timers = 25;
let spawnInterval;

timer.textContent = timers;
function startGame() {
  spawnInterval = setInterval(spawnPoint, 1000);
  timeInterval = setInterval(() => {
    if (timers > 0) {
      timers--;
      timer.textContent = timers;
    } else {
      endGame();
      console.log("end");

      clearInterval(timeInterval);
    }
  }, 1000);
}
function changeScore(value, pla) {
  let who = value === "bot" ? scoreBot : scorePlayer;
  who.forEach((e) => (e.textContent = pla));
}

function spawnPoint() {
  const point = document.createElement("div");
  point.classList.add("point");
  point.innerHTML = `<img src="assets/fruit.png" alt="" />`;
  point.style.position = "absolute";

  const maxX = platform.offsetWidth - 40;
  const randomX = Math.random() * maxX;

  point.style.left = `${randomX}px`;
  point.style.top = `-50px`;

  platform.appendChild(point);
  animatePoint(point);
  botTryCatch(point);
}

function endGame() {
  stopSpawn();
  gameBackground.classList.add("hidden");
  endCard.classList.remove("hidden");
}

function stopSpawn() {
  clearInterval(spawnInterval);
  const allPoints = platform.querySelectorAll(".point");
  allPoints.forEach(p => p.remove());
}

function animatePoint(point) {
  let top = -70;
  const fall = setInterval(() => {
    top += 0.9;
    point.style.top = `${top}px`;

    if (top > window.innerHeight) {
      clearInterval(fall);
      point.remove();
    }
  }, 16);
}

function moveTargetTo(x, y, who) {
  const rect = platform.getBoundingClientRect();

  const relativeX = x - rect.left;
  const relativeY = y - rect.top;

  who.style.left = `${relativeX}px`;
  who.style.top = `${relativeY}px`;
}

platform.addEventListener("click", (e) => {
  if (e.target.closest(".point")) {
    const point = e.target.closest(".point");
    const rect = point.getBoundingClientRect();

    const target = selectedPlayer === "daywalker" ? daywalker : vampire;
    moveTargetTo(rect.left, rect.top, target);

    point.remove();
    playerScore++;
    changeScore("player", playerScore);
  }
});

function botTryCatch(point) {
  if (botCaught > 2) return;

  const delay = Math.random() * 5000 + 3000;
  setTimeout(() => {
    if (document.body.contains(point)) {
      const rect = point.getBoundingClientRect();
      const target = selectedPlayer === "daywalker" ? vampire : daywalker;
      moveTargetTo(rect.left, rect.top, target);

      point.remove();
      botScore++;
      botCaught++;
      changeScore("bot", botScore);
    }
  }, delay);
}

function animateCrosshair(who) {
  const move = () => {
    const platformRect = platform.getBoundingClientRect();

    const maxX = platform.offsetWidth - 100;
    const maxY = platform.offsetHeight - 100;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    who.style.left = `${x}px`;
    who.style.top = `${y}px`;
  };

  setInterval(move, 1000);
}
function replay() {
  startCont.classList.remove("hidden")
  endCard.classList.add("hidden")
}

animateCrosshair(vampire);
daywalker.style.position = "absolute";
vampire.style.position = "absolute";
