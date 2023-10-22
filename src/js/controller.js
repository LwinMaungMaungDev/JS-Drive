import canvasView from "./views/canvasView.js";
import gameUiView from "./views/gameUiView.js";
import gameMenuView from "./views/gameMenuView.js";

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

  if (game.pause) return;

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
// Handling Events

/**
 * When the start button is pressed, remove the game menu and load the game canvas
 */
function handleGameStartEvent() {
  const { game } = gameState.state;
  // 1) Clear Game Menu
  gameMenuView.clear();

  // Render game canvas and ui buttons
  canvasView.render("data"); // Can pass data here for markup
  gameUiView.render("data"); // Can pass data here for markup

  // Start canvas animations
  canvasView.initializeCanvas(startCanvasAnimation);

  // Activate game play timer
  gameState.startCountPlayTime(updateGamePlayTime);

  // Activate listeners
  _handleControlKeyPresses();
  gameUiView.updateHealthBar(game.health / game.maxHealth);
  gameUiView.addHandlerControlSpeed(
    gameState.speedUp,
    gameState.stopSpeedingUp,
    gameState.slowDown,
    gameState.stopSlowDown
  );
  gameUiView.addHandlerControlTurn(gameState.turn);
  gameUiView.addHandlerGamePause(_handleGamePause);
  gameUiView.addHandlerGameResume(_handleGameResume);
  gameUiView.addHandlerGameQuit(_handleGameQuit);
}

function _handleGamePause() {
  gameState.pauseGame(true);
  gameState.stopSpeedingUp();
  gameState.stopSlowDown();
}

function _handleGameResume() {
  gameState.pauseGame(false);
  gameState.startCountPlayTime(updateGamePlayTime);
  startCanvasAnimation();
}

function _handleGameQuit() {
  console.log("Quit");
}

function updateGamePlayTime() {
  gameUiView.updateGamePlayTime(gameState.state.game.playTime);
}

//////////////////////////////////////////////////////////////////////////////
// Handling Keyboard presses

function _handleControlKeyPresses() {
  ["keydown", "keyup"].map((event) => {
    const isKeydown = event === "keydown";
    document.addEventListener(event, function (e) {
      console.log(gameState.state.game.pause);
      if (gameState.state.game.pause) return;

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
  document.ondragstart = () => false; // Prevent images dragged
  gameMenuView.render("car1"); // Can pass data here for the markup
  gameMenuView.addHandlerGameStart(handleGameStartEvent);
};

init();
