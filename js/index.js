const allImage = [
  "7.png",
  "bg1.png",
  "bg2.png",
  "endi.png",
  "endi2.png",
  "icon-daywalker.png",
  "icon-vampire.png",
  "liza.png",
  "logo.png",
  "mark.png",
  "mula.png",
  "People copy 3png",
];
allImage.forEach((file) => {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = `assets/1-first/${file}`;
  link.type = "image/png";
  document.head.appendChild(link);
});
const allSourceVideo = ["1", "2", "3", "4"];
allSourceVideo.forEach((file) => {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "video";
  link.href = `assets/video/${file}.mp4`; // добавляем расширение
  link.type = "video/mp4";
  document.head.appendChild(link);
});

const video = document.querySelector(".vid");
const gameBackground = document.querySelector(".game-start");
const startCont = document.querySelector(".first");
const endCard = document.querySelector(".end-card");
const toggle = document.querySelector(".toggle");

const daywalker = document.querySelector(".daywalker");
const vampire = document.querySelector(".vampire");
const platform = document.querySelector(".platform");
const timer = document.querySelector("#time");
const scorePlayerEl = document.querySelectorAll(".days");
const scoreBotEl = document.querySelectorAll(".vam");
const endScore = document.querySelector(".dayses");

let selectedPlayer = "daywalker";
let timeInterval;
let spawnInterval;
let timers = 20;
let botScore = 0;
let playerScore = 0;
let videoConte = video.parentElement;
let mutetion = true;
let unmute = (video.muted = mutetion);
let windowH = window.innerHeight > 400;
let random = Math.round(Math.random());
let initialPlayerPos = { left: 0, top: 0 };
let initialBotPos = { left: 0, top: 0 };
let botMoveInterval;
let activePoints = [];
let isBotCatching = false;

video.play();

timer.textContent = timers;

const pos = {
  v: ["3v", "1v"],
  h: ["1", "3"],
};

window.addEventListener("DOMContentLoaded", () => {
  if (windowH) {
    video.src = `assets/video/${pos.v[random]}.mp4`;
  } else {
    video.src = `assets/video/${pos.h[random]}.mp4`;
  }
  video.play();
});
window.addEventListener("resize", () => {
  video.muted = true;
  if (windowH) {
    video.src = `assets/video/${pos.v[random]}.mp4`;
  } else {
    video.src = `assets/video/${pos.h[random]}.mp4`;
  }
});
video.addEventListener("ended", () => {
  videoConte.classList.add("hidden");
  video.pause();
  startCont.classList.remove("hidden");
});
function clickVolume() {
  if (unmute === true) {
    video.muted = false;
    unmute = false;
    console.log("unmuted");
    toggle.innerHTML = `<i class="bxr bx-volume-full"></i>`;
  } else {
    toggle.innerHTML = `<i class="bxr bx-volume-mute"></i>`;
    video.muted = true;
    unmute = true;
    console.log("muted");
  }
}

function ChoosePerson(name) {
  selectedPlayer = name;
  const botName = name === "daywalker" ? "vampire" : "daywalker";

  daywalker.classList.remove("bot-crosshair");
  vampire.classList.remove("bot-crosshair");

  if (selectedPlayer === "daywalker") {
    playerScoreDisplay = scorePlayerEl;
    botScoreDisplay = scoreBotEl;
  } else {
    playerScoreDisplay = scoreBotEl;
    botScoreDisplay = scorePlayerEl;
  }

  if (botName === "daywalker") {
    daywalker.classList.add("bot-crosshair");
    gameBackground.classList.add("l3");
  } else {
    vampire.classList.add("bot-crosshair");
    gameBackground.classList.add("l2");
  }
  botScore = 0;
  playerScore = 0;
  updateScores();

  startCont.classList.add("hidden");
  endCard.classList.add("hidden");
  gameBackground.classList.remove("hidden");

  const playerTarget = vampire.classList.contains("bot-crosshair")
    ? daywalker
    : vampire;
  const botTarget = vampire.classList.contains("bot-crosshair")
    ? vampire
    : daywalker;
  const gameRect = platform.getBoundingClientRect();
  const playerRect = playerTarget.getBoundingClientRect();
  const botRect = botTarget.getBoundingClientRect();

  initialPlayerPos = {
    left: playerRect.left - gameRect.left,
    top: playerRect.top - gameRect.top,
  };
  initialBotPos = {
    left: botRect.left - gameRect.left,
    top: botRect.top - gameRect.top,
  };

  startGame();
}

function updateScores() {
  console.log("👤 playerScoreDisplay", playerScoreDisplay);
  console.log("📊 botScoreDisplay", botScoreDisplay);

  console.log("playerScore = ", playerScore);
  console.log("botScore = ", botScore);
  playerScoreDisplay.forEach((e) => {
    e.textContent = playerScore;
  });
  botScoreDisplay.forEach((e) => {
    e.textContent = botScore;
  });
}

function startGame() {
  spawnInterval = setInterval(spawnPoint, 1000);
  timeInterval = setInterval(() => {
    if (timers > 0) {
      timers--;
      timer.textContent = timers;
    } else {
      endGame();
      clearInterval(timeInterval);
    }
  }, 1000);
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
  activePoints.push(point);
  animatePoint(point);
}

function animatePoint(point) {
  let top = -70;
  const fall = setInterval(() => {
    top += 2.1;
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
  const point = e.target.closest(".point");
  const playerTarget = vampire.classList.contains("bot-crosshair")
    ? daywalker
    : vampire;
  if (point) {
    const rect = point.getBoundingClientRect();

    moveTargetTo(rect.x, rect.y, playerTarget);

    setTimeout(() => {
      playerTarget.style.left = `${initialPlayerPos.left}px`;
      playerTarget.style.top = `${initialPlayerPos.top}px`;
      point.remove();
      playerScore++;
      updateScores();
    }, 500);
  } else {
    let x = e.clientX - 50;
    let y = e.clientY - 50;
    moveTargetTo(x, y, playerTarget);
    setTimeout(() => {
      playerTarget.style.left = `${initialPlayerPos.left}px`;
      playerTarget.style.top = `${initialPlayerPos.top}px`;
    }, 500);
  }
});

let botCaughtCount = 0;

function botCatchLoop() {
  if (botCaughtCount >= 6) {
    const botTarget = document.querySelector(".bot-crosshair");
    if (!botMoveInterval) animateCrosshair(botTarget);
    return;
  }

  if (activePoints.length === 0 || isBotCatching) return;

  const botTarget = document.querySelector(".bot-crosshair");
  const point = activePoints[1];

  if (!document.body.contains(point)) {
    activePoints.shift();
    return;
  }

  isBotCatching = true;

  const rect = point.getBoundingClientRect();
  moveTargetTo(rect.x - 100, rect.y - 100, botTarget);

  setTimeout(() => {
    if (document.body.contains(point)) {
      point.remove();
      botScore++;
      botCaughtCount++;
      updateScores();
    }

    activePoints.shift();
    botTarget.style.left = `${initialBotPos.left}px`;
    botTarget.style.top = `${initialBotPos.top}px`;

    isBotCatching = false;
  }, 800);
}

setInterval(botCatchLoop, 2000); // каждый 1с бот проверяет

function animateCrosshair(who) {
  const platformRect = platform.getBoundingClientRect();
  const step = 50;
  let currentX = parseFloat(who.style.left) || 0;
  let currentY = parseFloat(who.style.top) || 0;

  // если уже работает — не запускать заново
  if (botMoveInterval) clearInterval(botMoveInterval);

  botMoveInterval = setInterval(() => {
    const directions = ["left", "right", "up", "down"];
    const dir = directions[Math.floor(Math.random() * directions.length)];

    switch (dir) {
      case "left":
        currentX = Math.max(0, currentX - step);
        break;
      case "right":
        currentX = Math.min(platformRect.width - 50, currentX + step);
        break;
      case "up":
        currentY = Math.max(0, currentY - step);
        break;
      case "down":
        currentY = Math.min(platformRect.height - 50, currentY + step);
        break;
    }

    who.style.left = `${currentX}px`;
    who.style.top = `${currentY}px`;
  }, 800);
}

function endGame() {
  clearInterval(timeInterval);
  clearInterval(spawnInterval);
  const allPoints = platform.querySelectorAll(".point");
  allPoints.forEach((p) => p.remove());
  endScore.textContent = playerScore;

  gameBackground.classList.add("hidden");
  endCard.classList.remove("hidden");
}

function replay() {
  clearInterval(timeInterval);
  clearInterval(spawnInterval);

  timers = 20;
  timer.textContent = timers;

  botScore = 0;
  playerScore = 0;
  botCaughtCount = 0;
  endScore.textContent = 0;
  updateScores();

  const allPoints = platform.querySelectorAll(".point");
  allPoints.forEach((p) => p.remove());

  activePoints = [];
  isBotCatching = false;
  if (botMoveInterval) {
    clearInterval(botMoveInterval);
    botMoveInterval = null;
  }

  // вернуть прицелы на начальные позиции
  daywalker.style.right = "0";
  daywalker.style.left = "150px";
  daywalker.style.top = `40%`;
  vampire.style.left = "0";
  vampire.style.top = `40%`;

  endCard.classList.add("hidden");
  startCont.classList.remove("hidden");
}
