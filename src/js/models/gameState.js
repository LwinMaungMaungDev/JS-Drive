import { SPEED_UP_INTERVAL } from "../config.js";
import { stones } from "./gameObjects/stones.js";
import { roadRepairs } from "./gameObjects/roadRepairs.js";
import { coins } from "./gameObjects/coins.js";
import { roads } from "./gameObjects/roads.js";
import { botCars } from "./gameObjects/botCars.js";
import { cars } from "./gameObjects/cars.js";

export const state = {};

//////////////////////////////////////////////////////////////////////////////
// Game

export const pauseGame = function (value) {
  state.game.pause = value;
  clearInterval(state.game.gamePlayTimer);
};

export const startCountPlayTime = function (updateGamePlayTime) {
  state.game.gamePlayTimer = setInterval(function () {
    state.game.playTime++;
    updateGamePlayTime(state.game.playTime);
  }, 1000);
};

/**
 *
 * @param {Object} car
 * car = {maxSpeed: {number}, speedUpRate: {number}, slowDownRate: {number}, turnSpeed: {number}}
 */
export const initializeGameStates = function () {
  if (state.canvas?.speedUpTimer) {
    clearInterval(state.canvas.speedUpTimer);
  }
  if (state.canvas?.slowDownTimer) {
    clearInterval(state.canvas.slowDownTimer);
  }
  if (state.game?.gamePlayTimer) {
    clearInterval(state.game.gamePlayTimer);
  }

  state.canvas = {
    forwardSpeed: 0,
    turnSpeed: 0,
    parallaxVerticalOffset: 0,
    parallaxHorizontalOffset: 0,
    speedUpTimer: undefined,
    slowDownTimer: undefined,
  };

  state.stone = {
    displayInterval: -1,
  };
  state.roadrepair = {
    displayInterval: -1,
  };
  state.coin = {
    displayInterval: -1,
  };

  state.road = {
    type: 1,
    displayInterval: -1,
    leftOffsetReducedFactor: 0.36,
    rightOffsetReducedFactor: 0.36,
  };

  state.botCars = [];

  state.game = {
    pause: false,
    stones: [...stones.map((stone) => ({ ...stone }))],
    roadRepairs: [...roadRepairs.map((roadRepair) => ({ ...roadRepair }))],
    coins: [...coins.map((coin) => ({ ...coin }))],
    botCars: [...botCars.map((botCar) => ({ ...botCar }))],
    roads: [...roads.map((road) => ({ ...road }))],
    health: 100,
    maxHealth: 100,
    currentInterval: 1,
    score: 0,
    playTime: 0,
    gamePlayTimer: undefined,
  };

  state.car = cars[0];
};

export const prevCar = function () {
  if (state.car.id === 0) {
    state.car = cars[cars.length - 1];
  } else {
    state.car = cars.find((car) => car.id === state.car.id - 1);
  }
};

export const nextCar = function () {
  if (state.car.id === cars.length - 1) {
    state.car = cars[0];
  } else {
    state.car = cars.find((car) => car.id === state.car.id + 1);
  }
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
  // Add bot cars
  if (state.game.botCars.length) {
    while (
      state.game.currentInterval + 1 >=
      state.game.botCars[state.game.botCars.length - 1].displayInterval
    ) {
      state.botCars.push(state.game.botCars.pop());
      if (!state.game.botCars.length) break;
    }
  }
  // Remove bot cars
  state.botCars.forEach((botCar, i) => {
    if (state.game.currentInterval > botCar.displayInterval + 15) {
      state.botCars.splice(i, 1);
    }
  });
};

export const setParallaxHorizontalOffset = function (offset) {
  state.canvas.parallaxHorizontalOffset = offset;
};

export const setForwardSpeed = function (speed) {
  state.canvas.forwardSpeed = speed;
};

export const speedUp = function () {
  const { canvas } = state;
  const { car } = state;
  if (canvas.speedUpTimer) return;
  if (canvas.forwardSpeed <= 0) canvas.forwardSpeed = car.speedUpRate / 2;
  canvas.speedUpTimer = setInterval(() => {
    if (canvas.forwardSpeed < state.car.maxSpeed)
      canvas.forwardSpeed += car.speedUpRate;
    if (canvas.forwardSpeed > state.car.maxSpeed)
      canvas.forwardSpeed = state.car.maxSpeed;
  }, SPEED_UP_INTERVAL * 1000);
};

export const stopSpeedingUp = function () {
  if (!state.canvas.speedUpTimer) return;
  clearInterval(state.canvas.speedUpTimer);
  state.canvas.speedUpTimer = undefined;
};

export const slowDown = function () {
  const { canvas } = state;
  const { car } = state;
  if (canvas.slowDownTimer) return;
  if (canvas.forwardSpeed >= 0) {
    canvas.forwardSpeed -= car.slowDownRate / 10;
    canvas.slowDownTimer = setInterval(() => {
      canvas.forwardSpeed <= 0
        ? (canvas.forwardSpeed = 0)
        : (canvas.forwardSpeed -= car.slowDownRate);
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
  const { car } = state;
  if (canvas.forwardSpeed <= 0) return;
  if (canvas.forwardSpeed > 20) {
    canvas.turnSpeed =
      direction * 10000 ** (car.turnSpeed / canvas.forwardSpeed);
  } else if (canvas.forwardSpeed > 2)
    canvas.turnSpeed = direction * car.turnSpeed;
  else if (canvas.forwardSpeed > 0)
    canvas.turnSpeed = (direction * car.turnSpeed) / 2;
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
    if (state.canvas.forwardSpeed) {
      // Player hit object
      state.game.health -= Math.round(state.canvas.forwardSpeed);
      if (state.game.health < state.game.maxHealth * 0.05) {
        state.game.health = 0;
      }
      state.canvas.forwardSpeed = -1;
    } else {
      // Object hit player
      _handleObjectHitPlayerCar();
    }
  } else {
    if (state.canvas.forwardSpeed) {
      // Player hit object
      state.game.health -= Math.round(state.canvas.forwardSpeed * 0.5);
      if (state.game.health < state.game.maxHealth * 0.05) {
        state.game.health = 0;
      }
      state.canvas.turnSpeed =
        state.canvas.forwardSpeed * -direction * (2 / state.car.turnSpeed);
      state.canvas.forwardSpeed *= 0.9;
    } else {
      // Object hit player
      _handleObjectHitPlayerCar(direction);
    }
  }
};

const _handleObjectHitPlayerCar = function (direction) {
  state.game.health -= 1;
  state.canvas.forwardSpeed = 2;
  state.canvas.turnSpeed = 2 * (direction ? -direction : -1);
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
