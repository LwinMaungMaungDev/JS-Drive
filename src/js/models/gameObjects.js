import { SPEED_UP_RATE, SPEED_UP_INTERVAL, SLOW_DOWN_RATE } from "../config";

export const state = {
  canvas: {
    forwardSpeed: 0,
    turnSpeed: 0,
    bgImgVerticalOffset: 0,
    bgImgHorizontalOffset: 0,
    speedUpTimer: undefined,
    slowDownTimer: undefined,
  },
  brick1: {
    type: 1,
    displayInterval: -1,
    dx: 0.5, // 0 means left-most and 1 means right-most
  },
  game: {
    bricks: [
      // Do not put bricks until interval 3
      { type: 1, displayInterval: 8, dx: 0.2 },
      { type: 1, displayInterval: 5, dx: 0.7 },
      { type: 1, displayInterval: 3, dx: 0.5 },
    ],
    currentInterval: 1,
  },
};

export const setBgImgVerticalOffset = function (offset) {
  state.canvas.bgImgVerticalOffset = offset;

  // After each bg img passed, we increase the interval and prepare objects
  if (offset === 0 && state.canvas.forwardSpeed > 0) {
    state.game.currentInterval++;
    if (
      state.game.bricks.length &&
      state.game.currentInterval > state.brick1.displayInterval
    ) {
      state.brick1 = state.game.bricks.pop();
    }
  }
};

export const setBgImgHorizontalOffset = function (offset) {
  state.canvas.bgImgHorizontalOffset = offset;
};

export const setForwardSpeed = function (speed) {
  state.canvas.forwardSpeed = speed;
};

export const speedUp = function () {
  const { canvas } = state;
  if (canvas.speedUpTimer) return;
  if (canvas.forwardSpeed <= 0) canvas.forwardSpeed = SPEED_UP_RATE / 2;
  canvas.speedUpTimer = setInterval(
    () => (canvas.forwardSpeed += SPEED_UP_RATE),
    SPEED_UP_INTERVAL * 1000
  );
};

export const stopSpeedingUp = function () {
  if (!state.canvas.speedUpTimer) return;
  clearInterval(state.canvas.speedUpTimer);
  state.canvas.speedUpTimer = undefined;
};

export const slowDown = function () {
  const { canvas } = state;
  if (canvas.slowDownTimer) return;
  if (canvas.forwardSpeed >= 0) {
    canvas.forwardSpeed -= SLOW_DOWN_RATE / 10;
    canvas.slowDownTimer = setInterval(() => {
      canvas.forwardSpeed <= 0
        ? (canvas.forwardSpeed = 0)
        : (canvas.forwardSpeed -= SLOW_DOWN_RATE);
      if (canvas.forwardSpeed < 0) _stopReset();
    }, SPEED_UP_INTERVAL * 1000);
  }
  if (canvas.forwardSpeed < 0) _stopReset();
};

export const _stopReset = function () {
  state.canvas.forwardSpeed = 0;
  state.canvas.turnSpeed = 0;
};

export const stopSlowDown = function () {
  if (!state.canvas.slowDownTimer) return;
  clearInterval(state.canvas.slowDownTimer);
  state.canvas.slowDownTimer = undefined;
};

export const turn = function (direction) {
  const { canvas } = state;
  if (canvas.forwardSpeed <= 0) return;
  if (canvas.forwardSpeed > 0) canvas.turnSpeed = direction;
  if (canvas.forwardSpeed > 2) canvas.turnSpeed = direction * 5;
  else if (canvas.forwardSpeed > 7)
    canvas.turnSpeed = direction * 100 ** (1 / canvas.forwardSpeed);
};
