import { SPEED_UP_RATE, SPEED_UP_INTERVAL, SLOW_DOWN_RATE } from "../config.js";
import { stones } from "./gameObjects/stones.js";
import { roadRepairs } from "./gameObjects/roadRepairs.js";
import { coins } from "./gameObjects/coins.js";
import { roads } from "./gameObjects/roads.js";

export const state = {
  canvas: {
    forwardSpeed: 0,
    turnSpeed: 0,
    bgImgVerticalOffset: 0,
    bgImgHorizontalOffset: 0,
    speedUpTimer: undefined,
    slowDownTimer: undefined,
  },
  stone: {
    displayInterval: -1,
  },
  roadrepair: {
    displayInterval: -1,
  },
  coin: {
    displayInterval: -1,
  },
  road: {
    type: 1,
    displayInterval: -1,
    leftOffsetReducedFactor: 0.36,
    rightOffsetReducedFactor: 0.36,
  },
  botCars: [
    {
      displayInterval: 3,
      dx: 0.8, // 0 means left-most and 1 means right-most
      dy: 0,
      width: 35,
      height: (35 * 337) / 178,
    },
    {
      displayInterval: 5,
      dx: 0.2, // 0 means left-most and 1 means right-most
      dy: 0,
      width: 35,
      height: (35 * 337) / 178,
    },
  ],
  game: {
    stones,
    roadRepairs,
    coins,
    botCars: [
      {
        displayInterval: 3,
        dx: 0.8, // 0 means left-most and 1 means right-most
        dy: 0,
        width: 35,
        height: (35 * 337) / 178,
      },
    ],
    roads,
    health: 100,
    currentInterval: 1,
    score: 0,
  },
};

//////////////////////////////////////////////////////////////////////////////
// Driving

export const setBgImgVerticalOffset = function (offset) {
  state.canvas.bgImgVerticalOffset = offset;

  // After each bg img passed, we increase the interval and prepare objects
  if (offset === 0 && state.canvas.forwardSpeed > 0) {
    state.game.currentInterval++;
    // Add stone
    if (
      state.game.stones.length &&
      state.game.currentInterval > state.stone.displayInterval
    )
      state.stone = state.game.stones.pop();
    // Add road repairs
    if (
      state.game.roadRepairs.length &&
      state.game.currentInterval > state.roadrepair.displayInterval
    )
      state.roadrepair = state.game.roadRepairs.pop();
    // Add coins
    if (
      state.game.coins.length &&
      state.game.currentInterval > state.coin.displayInterval
    )
      state.coin = state.game.coins.pop();
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
  if (canvas.forwardSpeed > 2) canvas.turnSpeed = direction * 4;
  else if (canvas.forwardSpeed > 7)
    canvas.turnSpeed = direction * 100 ** (1.5 / canvas.forwardSpeed);
};

export const switchRoad = function () {
  if (
    state.game.roads.length &&
    state.game.currentInterval > state.road.displayInterval
  ) {
    state.road = state.game.roads.pop();
    return state.road;
  }
};

//////////////////////////////////////////////////////////////////////////////
// Collision Handler

export const handleCollision = function (direction) {
  if (direction === 0) {
    state.game.health -= state.canvas.forwardSpeed * 4;
    state.canvas.forwardSpeed = -1;
  } else {
    state.game.health -= state.canvas.forwardSpeed * 2;
    state.canvas.turnSpeed = state.canvas.forwardSpeed * -direction;
    state.canvas.forwardSpeed *= 0.9;
  }
};

export const collectCoin = function () {
  state.coin = state.game.coins.pop();
  state.game.score++;
};
