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

  _carWidth = 35;
  _carHeight = (this._carWidth * 128) / 53;

  constructor() {
    this._loadImages();
  }

  _loadImages() {
    // Background Roads
    // 1)
    const road1ImgUrl = new URL(
      "../../img/canvas/roadTest.png?as=png",
      import.meta.url
    );
    this._road1.src = road1ImgUrl;
    // 2)
    const road2ImgUrl = new URL(
      "../../img/canvas/gravelRoadTest.png?as=png",
      import.meta.url
    );
    this._road2.src = road2ImgUrl;
    // Stone1
    const stone1ImgUrl = new URL(
      "../../img/canvas/stone1.png?as=png",
      import.meta.url
    );
    this._stone1.src = stone1ImgUrl;
    // RoadRepair
    const roadRepairImgUrl = new URL(
      "../../img/canvas/roadrepair.jpg?as=jpg",
      import.meta.url
    );
    this._roadrepair1.src = roadRepairImgUrl;
    // Coin
    const coinImgUrl = new URL(
      "../../img/canvas/coin.png?as=png",
      import.meta.url
    );
    this._coin.src = coinImgUrl;
    // Car
    const carImgUrl = new URL("../../img/cars/car.png?as=png", import.meta.url);
    this._car1.src = carImgUrl;
    // BotCar
    const botCarImgUrl = new URL(
      "../../img/cars/botCar.png?as=png",
      import.meta.url
    );
    this._botCar.src = botCarImgUrl;
  }

  initializeCanvas(startCanvasAnimation) {
    this._canvas.width = window.innerWidth;
    this._canvas.height = window.innerHeight;

    startCanvasAnimation();
  }

  _drawImage(img, dx, dy, width, height) {
    this._ctx.drawImage(img, dx, dy, width, height);
  }

  _drawBgImage(parallaxHorizontalOffset, verticalOffset, image) {
    this._drawImage(
      image,
      parallaxHorizontalOffset,
      verticalOffset,
      this._canvas.width,
      this._canvas.height
    );
  }

  _drawCarImage() {
    const carWidth = 35;
    const carHeight = (carWidth * 128) / 53;
    this._drawImage(
      this._car1,
      this._canvas.width / 2 - carWidth / 2,
      this._canvas.height / 2 + carHeight * 2,
      carWidth,
      carHeight
    );
  }

  /**
   * A general function to draw objects such as stones and coins on the canvas
   * @param {*} parallaxHorizontalOffset
   * @param {*} parallaxVerticalOffset
   * @param {*} object
   * @param {*} img
   * @param {*} currentInterval
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
      object.width,
      object.height
    );
  }

  detectCollision(
    parallaxHorizontalOffset,
    parallaxVerticalOffset,
    object,
    handler
  ) {
    const carDx = this._canvas.width / 2 - this._carWidth / 2;
    const carDy = this._canvas.height / 2 + this._carHeight * 2;
    const objectDx = object.dx * this._canvas.width + parallaxHorizontalOffset;
    const objectDy = object.dy ?? parallaxVerticalOffset;
    // Only detect if the object is closed to the car
    if (
      carDy <= objectDy + object.height &&
      carDy + this._carHeight >= objectDy
    ) {
      // 1) Check if car hits the object straight from the middle
      const isCollideMiddle =
        (carDx >= objectDx &&
          carDx + this._carWidth < objectDx + object.width) ||
        (carDx + this._carWidth <= objectDx + object.width && carDx > objectDx);
      if (isCollideMiddle) {
        handler(0);
        return;
      }
      // 2) Check if car hits the object from the left side
      const isCollideFromLeft =
        carDx + this._carWidth >= objectDx && carDx < objectDx;
      if (isCollideFromLeft) {
        handler(-1);
        return;
      }
      // 3) Check if car hits the object from the right side
      const isCollideFromRight =
        carDx <= objectDx + object.width &&
        carDx + this._carWidth > objectDx + object.width;
      if (isCollideFromRight) {
        handler(1);
        return;
      }
    }
  }

  /**
   * This is called 60 fps to draw the canvas with objects
   * @param {*} parallaxHorizontalOffset
   * @param {*} parallaxVerticalOffset
   * @param {*} stone
   * @param {*} roadrepair
   * @param {*} coin
   * @param {*} botCars
   * @param {*} currentInterval
   */
  drawCanvas(
    parallaxHorizontalOffset,
    parallaxVerticalOffset,
    stone,
    roadrepair,
    coin,
    currentInterval
  ) {
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
    this._drawCarImage();
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

  _adjustCanvasWidth(parallaxVerticalOffset) {
    if (
      this._canvasLeftWidthReducedFactorNew ||
      this._canvasRightWidthReducedFactorNew
    ) {
      if (
        parallaxVerticalOffset >=
        this._canvas.height / 2 + this._carHeight * 2
      ) {
        this._canvasLeftWidthReducedFactor =
          this._canvasLeftWidthReducedFactorNew;
        this._canvasRightWidthReducedFactor =
          this._canvasRightWidthReducedFactorNew;
        this._canvasLeftWidthReducedFactorNew = undefined;
        this._canvasRightWidthReducedFactorNew = undefined;
      }
    }
  }

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
        botCar.width,
        botCar.height
      );
    }
  }

  isParallaxEnd(parallaxVerticalOffset) {
    const isEnded =
      parallaxVerticalOffset === this._canvas.height ||
      parallaxVerticalOffset > this._canvas.height;
    return isEnded;
  }

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
}

export default new CanvasView();
