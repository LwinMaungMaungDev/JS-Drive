import { SPEED_UP_RATE, SPEED_UP_INTERVAL, SLOW_DOWN_RATE } from "../config.js";
import { stones } from "./gameObjects/stones.js";
import { roadRepairs } from "./gameObjects/roadRepairs.js";
import { coins } from "./gameObjects/coins.js";
import { roads } from "./gameObjects/roads.js";

export const state = {
  canvas: {
    forwardSpeed: 0,
    turnSpeed: 0,
    parallaxVerticalOffset: 0,
    parallaxHorizontalOffset: 0,
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
      dx: 0.5, // 0 means left-most and 1 means right-most
      dy: 0,
      width: 0.05,
      height: (0.05 * 337) / 178,
      speed: 2,
    },
    {
      displayInterval: 5,
      dx: 0.4, // 0 means left-most and 1 means right-most
      dy: 0,
      width: 0.05,
      height: (0.05 * 337) / 178,
      speed: 3,
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
        speed: 2,
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

export const setParallaxVerticalOffset = function (offset) {
  state.canvas.parallaxVerticalOffset = offset;

  // After each bg img passed, we increase the interval and prepare objects
  if (offset === 0 && state.canvas.forwardSpeed > 0) {
    state.game.currentInterval++;
    _addObjects();
  }
};

/**
 * Add objects onto the canvas in each frame.
 */
const _addObjects = function () {
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
};

export const setParallaxHorizontalOffset = function (offset) {
  state.canvas.parallaxHorizontalOffset = offset;
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

/**
 * Handle the player's car collision with objects.
 * 0 means player hits object straight from the middle.
 * -1 and 1 means player hits object from the left or right.
 * @param {number} direction Possible values are -1, 0, and 1.
 */
export const handleCollision = function (direction) {
  if (direction === 0) {
    state.game.health -= Math.round(state.canvas.forwardSpeed);
    state.canvas.forwardSpeed = -1;
  } else {
    state.game.health -= Math.round(state.canvas.forwardSpeed * 0.5);
    state.canvas.turnSpeed = state.canvas.forwardSpeed * -direction;
    state.canvas.forwardSpeed *= 0.9;
  }
};

/**
 * If the player collects coins, increase the score.
 */
export const collectCoin = function () {
  state.coin = state.game.coins.pop();
  state.game.score++;
};

//////////////////////////////////////////////////////////////////////////////
// Move Bot Cars

/**
 * Bot cars move themselves upward.
 * At the same time, they move down as the player's car moves upward
 */
export const moveBotCars = function () {
  state.botCars.forEach((botCar, i) => {
    if (state.game.currentInterval >= botCar.displayInterval) {
      // Move bot cars down by forward speed
      state.botCars[i].dy += state.canvas.forwardSpeed;
      // Move bot cars up
      state.botCars[i].dy -= state.botCars[i].speed;
    }
  });
};
