import canvasView from "./views/canvasView.js";
import gameUiView from "./views/gameUiView.js";

import * as gameObjects from "./models/gameObjects.js";

////////////////////////////////////////////////////////////////////////////////////
// This will always be running with 60 fps.

function startCanvasAnimation() {
  const { canvas } = gameObjects.state;
  const { game } = gameObjects.state;
  const { brick1 } = gameObjects.state;
  // 1) If there is some forwardSpeed, this will move the canvas down or the car up.
  gameObjects.setBgImgVerticalOffset(
    canvas.bgImgVerticalOffset + canvas.forwardSpeed
  );
  // 2) If the image is fully displayed, set back to zero.
  if (canvasView.isBgImgEnd(canvas.bgImgVerticalOffset))
    gameObjects.setBgImgVerticalOffset(0);
  // 3) Turn Left or Right
  if (canvas.forwardSpeed > 0) {
    if (
      canvasView.canMoveHorizontal(
        canvas.bgImgHorizontalOffset,
        canvas.turnSpeed
      )
    )
      gameObjects.setBgImgHorizontalOffset(
        canvas.bgImgHorizontalOffset + canvas.turnSpeed
      );
  }

  // 4) With the values just calculated, redraw the canvas.
  canvasView.drawCanvas(
    canvas.bgImgHorizontalOffset,
    canvas.bgImgVerticalOffset,
    brick1,
    game.currentInterval
  );

  // 5) Loop the animation
  window.requestAnimationFrame(startCanvasAnimation);
}

//////////////////////////////////////////////////////////////////////////////
// Handling Keyboard presses

function handleControlKeyPresses() {
  ["keydown", "keyup"].map((event) => {
    const isKeydown = event === "keydown";
    document.addEventListener(event, function (e) {
      if (e.repeat) return;

      switch (e.key) {
        case "w":
          isKeydown ? gameObjects.speedUp() : gameObjects.stopSpeedingUp();
          break;
        case "a":
          isKeydown ? gameObjects.turn(1) : gameObjects.turn(0);
          break;
        case "d":
          isKeydown ? gameObjects.turn(-1) : gameObjects.turn(0);
          break;
        case " ":
          isKeydown ? gameObjects.slowDown() : gameObjects.stopSlowDown();
          break;
      }
    });
  });
}

const init = function () {
  document.ondragstart = () => false; // Prevent images dragged
  window.onload = function () {
    canvasView.initializeCanvas(startCanvasAnimation);
    gameUiView.addHandlerStartCountPlayTime();
  };
  handleControlKeyPresses();
  gameUiView.addHandlerControlSpeed(
    gameObjects.speedUp,
    gameObjects.stopSpeedingUp,
    gameObjects.slowDown,
    gameObjects.stopSlowDown
  );
  gameUiView.addHandlerControlTurn(gameObjects.turn);
};

init();
