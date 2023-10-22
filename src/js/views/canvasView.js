import {
  calCarDx,
  calCarDy,
  calCarDimensions,
  responsive,
  calcRadian,
} from "../helper.js";
import { turn } from "../models/gameState.js";

class CanvasView {
  _canvas = document.getElementById("canvas");
  _ctx = this._canvas.getContext("2d");
  _road1 = new Image();
  _road2 = new Image();
  _stone1 = new Image();
  _car1 = new Image();
  _roadrepair1 = new Image();
  _coin = new Image();
  _botCar = new Image();
  _upperBackground = this._road1;
  _lowerBackground = this._road1;
  _isSwitchingRoad = false;
  _canvasLeftWidthReducedFactor = 0.36;
  _canvasRightWidthReducedFactor = 0.36;
  _canvasLeftWidthReducedFactorNew;
  _canvasRightWidthReducedFactorNew;

  _car = { width: 0.04, heightWidthRatio: 128 / 53 };

  constructor() {
    this._loadImages();
  }

  _loadImages() {
    // Background Roads
    // 1)
    this._road1.src = new URL(
      "../../img/canvas/roadTest.png?as=png",
      import.meta.url
    );
    // 2)
    this._road2.src = new URL(
      "../../img/canvas/gravelRoadTest.png?as=png",
      import.meta.url
    );
    // Stone1
    this._stone1.src = new URL(
      "../../img/canvas/stone1.png?as=png",
      import.meta.url
    );
    // RoadRepair
    this._roadrepair1.src = new URL(
      "../../img/canvas/roadrepair.jpg?as=jpg",
      import.meta.url
    );
    // Coin
    this._coin.src = new URL(
      "../../img/canvas/coin.png?as=png",
      import.meta.url
    );
    // Car
    this._car1.src = new URL("../../img/cars/car.png?as=png", import.meta.url);
    // BotCar
    this._botCar.src = new URL(
      "../../img/cars/botCar.png?as=png",
      import.meta.url
    );
  }

  initializeCanvas(startCanvasAnimation) {
    this._canvas.width = window.innerWidth > 700 ? 700 : window.innerWidth;
    this._canvas.height = window.innerHeight;

    startCanvasAnimation();
  }

  /**
   * This is called 60 fps to draw the canvas with objects
   * @param {number} parallaxHorizontalOffset
   * @param {number} parallaxVerticalOffset
   * @param {Object} stone
   * @param {Object} roadrepair
   * @param {Object} coin
   * @param {Object[]} botCars
   * @param {number} currentInterval
   */
  drawCanvas(canvas, stone, roadrepair, coin, currentInterval) {
    const { parallaxHorizontalOffset, parallaxVerticalOffset, turnSpeed } =
      canvas;
    // 1) Draw background image
    this._drawBgImage(
      parallaxHorizontalOffset,
      parallaxVerticalOffset,
      this._lowerBackground
    );
    this._drawBgImage(
      parallaxHorizontalOffset,
      parallaxVerticalOffset - this._canvas.height,
      this._upperBackground
    );
    this._adjustCanvasWidth(parallaxVerticalOffset);

    // 2) Draw car
    this._drawCarImage(turnSpeed);
    // 3) Draw stones
    this._drawStones(
      parallaxHorizontalOffset,
      parallaxVerticalOffset,
      stone,
      currentInterval
    );
    // 4) Draw road repairs
    this._drawRoadRepairs(
      parallaxHorizontalOffset,
      parallaxVerticalOffset,
      roadrepair,
      currentInterval
    );
    // 5) Draw coins
    this._drawCoins(
      parallaxHorizontalOffset,
      parallaxVerticalOffset,
      coin,
      currentInterval
    );
  }

  ///////////////////////////////////////////////////////////////////////////
  // Drawing images on canvas

  /**
   * This actually draws the images on the canvas
   * @param {Image} img Image
   * @param {number} dx The horizontal offset inside the canvas
   * @param {number} dy The vertical offset inside the canvas
   * @param {number} width The width of the image
   * @param {number} height The height of the image
   */
  _drawImage(img, dx, dy, width, height, angle) {
    if (angle) {
      this._ctx.save();
      this._ctx.translate(dx + width / 2, dy + height / 2);
      this._ctx.rotate(calcRadian(angle));
      this._ctx.drawImage(img, -width / 2, -height / 2, width, height);
      this._ctx.restore();
    } else {
      this._ctx.drawImage(img, dx, dy, width, height);
    }
  }

  /**
   * A general function to draw objects such as stones and coins on the canvas
   * @param {number} parallaxHorizontalOffset
   * @param {number} parallaxVerticalOffset
   * @param {Object} object
   * @param {Image} img
   * @param {number} currentInterval
   */
  _drawObjects(
    parallaxHorizontalOffset,
    parallaxVerticalOffset,
    object,
    img,
    currentInterval
  ) {
    const objectDx = object.dx * this._canvas.width + parallaxHorizontalOffset;
    this._drawImage(
      img,
      objectDx,
      object.displayInterval === currentInterval
        ? parallaxVerticalOffset
        : parallaxVerticalOffset - this._canvas.height,
      responsive(object.width, this._canvas.width),
      responsive(object.height, this._canvas.width)
    );
  }

  // Background Image (Road Images)
  _drawBgImage(parallaxHorizontalOffset, verticalOffset, image) {
    this._drawImage(
      image,
      parallaxHorizontalOffset,
      verticalOffset,
      this._canvas.width,
      this._canvas.height
    );
  }

  // Player's Car
  _drawCarImage(turnSpeed) {
    const { carWidth, carHeight } = calCarDimensions(
      this._car,
      this._canvas.width
    );
    const angle = -turnSpeed * 2;
    this._drawImage(
      this._car1,
      calCarDx(this._canvas.width, carWidth),
      calCarDy(this._canvas.height, carHeight),
      carWidth,
      carHeight,
      angle
    );
  }

  // Bots' Car (All)
  drawBotCars(
    parallaxHorizontalOffset,
    parallaxVerticalOffset,
    botCars,
    currentInterval
  ) {
    botCars.map((botCar) =>
      this._drawBotCar(
        parallaxHorizontalOffset,
        parallaxVerticalOffset,
        botCar,
        currentInterval
      )
    );
  }

  // Bot's Car (Each)
  _drawBotCar(
    parallaxHorizontalOffset,
    parallaxVerticalOffset,
    botCar,
    currentInterval
  ) {
    if (
      botCar.displayInterval <= currentInterval ||
      botCar.displayInterval - 1 === currentInterval
    ) {
      const botCarDx =
        botCar.dx * this._canvas.width + parallaxHorizontalOffset;
      this._drawImage(
        this._botCar,
        botCarDx,
        botCar.displayInterval <= currentInterval
          ? botCar.dy
          : parallaxVerticalOffset - this._canvas.height,
        responsive(botCar.width, this._canvas.width),
        responsive(botCar.height, this._canvas.width)
      );
    }
  }

  // Stone
  _drawStones(
    parallaxHorizontalOffset,
    parallaxVerticalOffset,
    stone,
    currentInterval
  ) {
    if (
      stone.displayInterval === currentInterval ||
      stone.displayInterval - 1 === currentInterval
    ) {
      let stoneImg = this._stone1;
      switch (stone.type) {
        case 1:
          stoneImg = this._stone1;
          break;
        case 2:
          stoneImg = this._stone1;
          break;
      }
      this._drawObjects(
        parallaxHorizontalOffset,
        parallaxVerticalOffset,
        stone,
        stoneImg,
        currentInterval
      );
    }
  }

  // Road Repaire
  _drawRoadRepairs(
    parallaxHorizontalOffset,
    parallaxVerticalOffset,
    roadrepair,
    currentInterval
  ) {
    if (
      roadrepair.displayInterval === currentInterval ||
      roadrepair.displayInterval - 1 === currentInterval
    ) {
      let roadRepairImg = this._roadrepair1;
      switch (roadrepair.type) {
        case 1:
          roadRepairImg = this._roadrepair1;
          break;
        case 2:
          roadRepairImg = this._roadrepair1;
          break;
      }
      this._drawObjects(
        parallaxHorizontalOffset,
        parallaxVerticalOffset,
        roadrepair,
        roadRepairImg,
        currentInterval
      );
    }
  }

  // Coin
  _drawCoins(
    parallaxHorizontalOffset,
    parallaxVerticalOffset,
    coin,
    currentInterval
  ) {
    if (
      coin.displayInterval === currentInterval ||
      coin.displayInterval - 1 === currentInterval
    ) {
      this._drawObjects(
        parallaxHorizontalOffset,
        parallaxVerticalOffset,
        coin,
        this._coin,
        currentInterval
      );
    }
  }

  ///////////////////////////////////////////////////////////////////////

  /**
   * When the road background image change,
   * the width in which the car can drive should change.
   * This function adjust this canvas width
   * @param {number} parallaxVerticalOffset
   */
  _adjustCanvasWidth(parallaxVerticalOffset) {
    if (
      this._canvasLeftWidthReducedFactorNew ||
      this._canvasRightWidthReducedFactorNew
    ) {
      const { _, carHeight } = calCarDimensions(this._car, this._canvas.width);
      if (parallaxVerticalOffset >= this._canvas.height - carHeight * 2) {
        this._canvasLeftWidthReducedFactor =
          this._canvasLeftWidthReducedFactorNew;
        this._canvasRightWidthReducedFactor =
          this._canvasRightWidthReducedFactorNew;
        this._canvasLeftWidthReducedFactorNew = undefined;
        this._canvasRightWidthReducedFactorNew = undefined;
      }
    }
  }

  /**
   * The moving canvas is just two images running repeatedly (parallax).
   * This checks if one image is fully displayed (end).
   * @param {number} parallaxVerticalOffset
   * @returns {boolean}
   */
  isParallaxEnd(parallaxVerticalOffset) {
    const isEnded =
      parallaxVerticalOffset === this._canvas.height ||
      parallaxVerticalOffset > this._canvas.height;
    return isEnded;
  }

  /**
   * This function is executed for the end of each image
   * @param {Object} road Current road
   */
  resetView(road) {
    if (this._isSwitchingRoad) {
      // If _isSwitchingRoad is true, we need to switch the lower background.
      this.switchRoad(road, false);
      this._isSwitchingRoad = false;
    }
  }

  /**
   * The car should move only in the defined width.
   * This function checks if the car can still move further to the left or right
   * @param {number} parallaxHorizontalOffset
   * @param {number} turnSpeed
   * @param {number} reducedFactorLeft
   * @param {number} reducedFactorRight
   * @returns {boolean}
   */
  canMoveHorizontal(
    parallaxHorizontalOffset,
    turnSpeed,
    reducedFactorLeft,
    reducedFactorRight
  ) {
    // We don't change the width (in which the car can drive) too suddenly
    // We change it once the new background image reach the car
    // We do this in _adjustCanvasWidth
    if (
      this._canvasLeftWidthReducedFactor !== reducedFactorLeft ||
      this._canvasRightWidthReducedFactor !== reducedFactorRight
    ) {
      this._canvasLeftWidthReducedFactorNew = reducedFactorLeft;
      this._canvasRightWidthReducedFactorNew = reducedFactorRight;
    }
    return (
      (parallaxHorizontalOffset <
        (this._canvas.width * this._canvasLeftWidthReducedFactor) / 2 &&
        turnSpeed > 0) ||
      (parallaxHorizontalOffset >
        (this._canvas.width * this._canvasRightWidthReducedFactor) / -2 &&
        turnSpeed < 0)
    );
  }

  /**
   * Change the background image (road image)
   * Set isUpper to true to change the upper image and vice versa
   * @param {Object} road
   * @param {boolean} isUpper
   */
  switchRoad(road, isUpper) {
    // Set _isSwitchingRoad to true to remind for resetting the view
    // which switch the lower background.
    if (isUpper) this._isSwitchingRoad = true;
    switch (road.type) {
      case 1:
        isUpper
          ? (this._upperBackground = this._road1)
          : (this._lowerBackground = this._road1);
        break;
      case 2:
        isUpper
          ? (this._upperBackground = this._road2)
          : (this._lowerBackground = this._road2);
        break;
    }
  }

  /**
   * Detect collision with the player's car and [object]
   * @param {number} parallaxHorizontalOffset
   * @param {number} parallaxVerticalOffset
   * @param {Object} object
   * @param {Function} handler
   */
  detectCollision(
    parallaxHorizontalOffset,
    parallaxVerticalOffset,
    object,
    handler
  ) {
    const { carWidth, carHeight } = calCarDimensions(
      this._car,
      this._canvas.width
    );
    const carDx = calCarDx(this._canvas.width, carWidth);
    const carDy = calCarDy(this._canvas.height, carHeight);
    const objectDx = object.dx * this._canvas.width + parallaxHorizontalOffset;
    const objectDy = object.dy ?? parallaxVerticalOffset;
    // Only detect if the object is closed to the car
    if (
      carDy <= objectDy + responsive(object.height, this._canvas.width) &&
      carDy + carHeight >= objectDy
    ) {
      // 1) Check if car hits the object straight from the middle
      const isCollideMiddle =
        (carDx >= objectDx &&
          carDx + carWidth <
            objectDx + responsive(object.width, this._canvas.width)) ||
        (carDx + carWidth <=
          objectDx + responsive(object.width, this._canvas.width) &&
          carDx > objectDx);
      if (isCollideMiddle) {
        handler(0);
        return;
      }
      // 2) Check if car hits the object from the left side
      const isCollideFromLeft =
        carDx + carWidth >= objectDx && carDx < objectDx;
      if (isCollideFromLeft) {
        handler(-1);
        return;
      }
      // 3) Check if car hits the object from the right side
      const isCollideFromRight =
        carDx <= objectDx + responsive(object.width, this._canvas.width) &&
        carDx + carWidth >
          objectDx + responsive(object.width, this._canvas.width);
      if (isCollideFromRight) {
        handler(1);
        return;
      }
    }
  }
}

export default new CanvasView();
