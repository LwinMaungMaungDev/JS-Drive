const canvas = document.getElementById("canvas");
const speedBtns = document.querySelector(".speed-btns");
const turnBtns = document.querySelector(".turn-btns");

const ctx = canvas.getContext("2d");

const img = new Image();

const imageUrl = new URL(
  "../img/canvas/spacebg.png?as=png&width=100%&height=100%",
  import.meta.url
);
img.src = imageUrl;

let forwardSpeed = 0;
let turnSpeed = 0;
let bgImgVerticalOffset = 0;
let bgImgHorizontalOffset = 0;
let speedUpTimer;
let slowDownTimer;

window.onload = function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  drawImage(img, bgImgHorizontalOffset, bgImgVerticalOffset);

  startCanvasAnimation();
};

function drawImage(img, dx, dy) {
  ctx.drawImage(img, dx, dy, canvas.width, canvas.height);
}

function drawCanvas() {
  drawImage(img, bgImgHorizontalOffset, bgImgVerticalOffset);
  drawImage(img, bgImgHorizontalOffset, bgImgVerticalOffset - canvas.height);
}

function startCanvasAnimation() {
  bgImgVerticalOffset += forwardSpeed;
  if (
    bgImgVerticalOffset === canvas.height ||
    bgImgVerticalOffset > canvas.height
  )
    bgImgVerticalOffset = 0;

  // Turn Left or Right
  if (
    (bgImgHorizontalOffset < canvas.width / 2 && turnSpeed > 0) ||
    (bgImgHorizontalOffset > canvas.width / -2 && turnSpeed < 0)
  )
    bgImgHorizontalOffset += turnSpeed;

  drawCanvas();

  window.requestAnimationFrame(startCanvasAnimation);
}

function speedUp() {
  if (speedUpTimer) return;
  if (forwardSpeed <= 0) forwardSpeed = 0.25;
  speedUpTimer = setInterval(() => (forwardSpeed += 0.5), 250);
}

function stopSpeedingUp() {
  if (!speedUpTimer) return;
  clearInterval(speedUpTimer);
  speedUpTimer = undefined;
}

function slowDown() {
  if (slowDownTimer) return;
  if (forwardSpeed >= 0) {
    forwardSpeed -= 0.2;
    slowDownTimer = setInterval(() => {
      forwardSpeed <= 0 ? (forwardSpeed = 0) : (forwardSpeed -= 2);
      if (forwardSpeed < 0) forwardSpeed = 0;
    }, 250);
  }
  if (forwardSpeed < 0) forwardSpeed = 0;
}

function stopSlowDown() {
  if (!slowDownTimer) return;
  clearInterval(slowDownTimer);
  slowDownTimer = undefined;
}

function turn(direction) {
  if (forwardSpeed <= 0) return;
  if (forwardSpeed > 0) turnSpeed = direction;
  if (forwardSpeed > 2) turnSpeed = direction * 5;
  else if (forwardSpeed > 7) turnSpeed = direction * 100 ** (1 / forwardSpeed);
}

["mousedown", "mouseup", "mouseout"].map((event) =>
  speedBtns.addEventListener(event, function (e) {
    const el = e.target.closest(".btn");
    if (!el) return;
    if (el.classList.contains("btn--lever")) {
      if (event === "mousedown") speedUp();
      else stopSpeedingUp();
    } else if (el.classList.contains("btn--brake")) {
      if (event === "mousedown") slowDown();
      else stopSlowDown();
    }
  })
);

["mousedown", "mouseup", "mouseout"].map((event) =>
  turnBtns.addEventListener(event, function (e) {
    const el = e.target.closest(".btn");
    if (!el) return;
    if (el.classList.contains("btn--turn-left")) {
      if (event === "mousedown") turn(1);
      else turn(0);
    } else if (el.classList.contains("btn--turn-right")) {
      if (event === "mousedown") turn(-1);
      else turn(0);
    }
  })
);

["keydown", "keyup"].map((event) => {
  const isKeydown = event === "keydown";
  document.addEventListener(event, function (e) {
    if (e.repeat) return;

    switch (e.key) {
      case "w":
        isKeydown ? speedUp() : stopSpeedingUp();
        break;
      case "a":
        isKeydown ? turn(1) : turn(0);
        break;
      case "d":
        isKeydown ? turn(-1) : turn(0);
        break;
      case " ":
        isKeydown ? slowDown() : stopSlowDown();
        break;
    }
  });
});

document.ondragstart = () => false;
