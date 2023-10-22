import canvasView from "./views/canvasView.js";
import gameUiView from "./views/gameUiView.js";

import * as gameState from "./models/gameState.js";

////////////////////////////////////////////////////////////////////////////////////
// This will always be running with 60 fps.

function startCanvasAnimation() {
  const { canvas } = gameState.state;
  const { game } = gameState.state;
  const { stone } = gameState.state;
  const { roadrepair } = gameState.state;
  const { coin } = gameState.state;
  const { road } = gameState.state;
  const { botCars } = gameState.state;
  // 1) If there is some forwardSpeed, this will move the canvas down or the car up.
  gameState.setParallaxVerticalOffset(
    canvas.parallaxVerticalOffset + canvas.forwardSpeed
  );
  gameState.moveBotCars();
  // 2) If the image is fully displayed,
  if (canvasView.isParallaxEnd(canvas.parallaxVerticalOffset)) {
    gameState.setParallaxVerticalOffset(0);
    canvasView.resetView(road, false); // Needs to do before switching road
    const newRoad = gameState.switchRoad();
    if (newRoad) canvasView.switchRoad(newRoad, true);
  }
  // 3) Turn Left or Right
  if (canvas.forwardSpeed > 0) {
    if (
      canvasView.canMoveHorizontal(
        canvas.parallaxHorizontalOffset,
        canvas.turnSpeed,
        road.leftOffsetReducedFactor,
        road.rightOffsetReducedFactor
      )
    )
      gameState.setParallaxHorizontalOffset(
        canvas.parallaxHorizontalOffset + canvas.turnSpeed
      );
  }

  // 4) With the values just calculated, redraw the canvas.
  canvasView.drawCanvas(canvas, stone, roadrepair, coin, game.currentInterval);

  // 5) Draw bot cars and move them
  canvasView.drawBotCars(
    canvas.parallaxHorizontalOffset,
    canvas.parallaxVerticalOffset,
    botCars,
    game.currentInterval
  );

  // 6) Detect collision for stones
  if (stone.displayInterval === game.currentInterval) _detectCollision(stone);

  // 7) Detect collision for road repairs
  if (roadrepair.displayInterval === game.currentInterval)
    _detectCollision(roadrepair);

  // 8) Detect collision for coins
  if (coin.displayInterval === game.currentInterval) _detectCoinCollect(coin);

  // 9) Detect collision for botCar
  botCars.map((botCar) => {
    if (botCar.displayInterval <= game.currentInterval)
      _detectCollision(botCar);
  });

  // 10) Update Accelerometer
  _updateAccelerometer();

  // 11) Loop the animation
  window.requestAnimationFrame(startCanvasAnimation);
}

//////////////////////////////////////////////////////////////////////////////
// Detect Collision

function _detectCollision(object) {
  const { canvas } = gameState.state;
  canvasView.detectCollision(
    canvas.parallaxHorizontalOffset,
    canvas.parallaxVerticalOffset,
    object,
    _handleCollision
  );
}

function _detectCoinCollect(coin) {
  const { canvas } = gameState.state;
  canvasView.detectCollision(
    canvas.parallaxHorizontalOffset,
    canvas.parallaxVerticalOffset,
    coin,
    _handleCoinCollect
  );
}

//////////////////////////////////////////////////////////////////////////////
// Handle Collision
function _handleCollision(direction) {
  const { game } = gameState.state;
  gameState.handleCollision(direction);
  if (game.health <= 0) {
    console.log("Game Over");
  }
  gameUiView.updateHealthBar(game.health / game.maxHealth);
}

function _handleCoinCollect() {
  gameState.collectCoin();
  gameUiView.setCurrentScore(gameState.state.game.score);
}

//////////////////////////////////////////////////////////////////////////////
// Accelerometer
function _updateAccelerometer() {
  const { forwardSpeed } = gameState.state.canvas;
  const { maxSpeed } = gameState.state.car;
  gameUiView.updateAccelerometer(forwardSpeed, maxSpeed);
}

//////////////////////////////////////////////////////////////////////////////
// Handling Keyboard presses

function handleControlKeyPresses() {
  ["keydown", "keyup"].map((event) => {
    const isKeydown = event === "keydown";
    document.addEventListener(event, function (e) {
      switch (e.key) {
        case "w":
          if (e.repeat) return;
          isKeydown ? gameState.speedUp() : gameState.stopSpeedingUp();
          break;
        case "a":
          isKeydown
            ? gameState.turn(1)
            : gameState.state.canvas.turnSpeed < 0
            ? // If the "d" is already pressed (turnSpeed < 0), do not stop turning
              null
            : gameState.turn(0);
          break;
        case "d":
          isKeydown
            ? gameState.turn(-1)
            : gameState.state.canvas.turnSpeed > 0
            ? // If the "a" is already pressed (turnSpeed > 0), do not stop turning
              null
            : gameState.turn(0);
          break;
        case " ":
          if (e.repeat) return;
          isKeydown ? gameState.slowDown() : gameState.stopSlowDown();
          break;
      }
    });
  });
}

const init = function () {
  const { game } = gameState.state;
  document.ondragstart = () => false; // Prevent images dragged
  window.onload = function () {
    canvasView.initializeCanvas(startCanvasAnimation);
    gameUiView.addHandlerStartCountPlayTime();
    gameUiView.updateHealthBar(game.health / game.maxHealth);
  };
  handleControlKeyPresses();
  gameUiView.addHandlerControlSpeed(
    gameState.speedUp,
    gameState.stopSpeedingUp,
    gameState.slowDown,
    gameState.stopSlowDown
  );
  gameUiView.addHandlerControlTurn(gameState.turn);
};

init();
