class CanvasView {
  _canvas = document.getElementById("canvas");
  _ctx = this._canvas.getContext("2d");
  _bgImg = new Image();
  _brick = new Image();
  _car = new Image();

  constructor() {
    this._loadImages();
  }

  _loadImages() {
    const canvasImgUrl = new URL(
      "../../img/canvas/spacebg.png?as=png&width=100%&height=100%",
      import.meta.url
    );
    this._bgImg.src = canvasImgUrl;
    const brickImgUrl = new URL(
      "../../img/canvas/brick1.png?as=png",
      import.meta.url
    );
    this._brick.src = brickImgUrl;
    const carImgUrl = new URL("../../img/cars/car.png?as=png", import.meta.url);
    this._car.src = carImgUrl;
  }

  initializeCanvas(startCanvasAnimation) {
    this._canvas.width = window.innerWidth;
    this._canvas.height = window.innerHeight;

    startCanvasAnimation();
  }

  _drawImage(img, dx, dy, width, height) {
    this._ctx.drawImage(img, dx, dy, width, height);
  }

  _drawBgImage(bgImgHorizontalOffset, verticalOffset) {
    this._drawImage(
      this._bgImg,
      bgImgHorizontalOffset,
      verticalOffset,
      this._canvas.width,
      this._canvas.height
    );
  }

  _drawCarImage() {
    this._drawImage(
      this._car,
      this._canvas.width / 2 - 35 / 2,
      this._canvas.height / 2 + (35 * 128) / 53,
      35,
      (35 * 128) / 53
    );
  }

  _drawBricks(
    bgImgHorizontalOffset,
    bgImgVerticalOffset,
    brick1,
    currentInterval
  ) {
    const brick1Width = 100;
    const brick1Height = (brick1Width * 50) / 79;
    const brickDx =
      brick1.dx * this._canvas.width - 100 + bgImgHorizontalOffset;
    this._drawImage(
      this._brick,
      brickDx,
      brick1.displayInterval === currentInterval
        ? bgImgVerticalOffset
        : bgImgVerticalOffset - this._canvas.height,
      brick1Width,
      brick1Height
    );
  }

  _detectCollision(bgImgHorizontalOffset, bgImgVerticalOffset, brick1) {
    const brick1Width = 100;
    const brick1Height = (brick1Width * 50) / 79;
    const brickDx =
      brick1.dx * this._canvas.width - 100 + bgImgHorizontalOffset;
    const carWidth = 35;
    const carHeight = (carWidth * 128) / 53;
    const carDx = this._canvas.width / 2 - carWidth / 2;
    const carDy = this._canvas.height / 2 + carHeight;
    const brick1Dy = bgImgVerticalOffset + brick1Height;
    if (carDy < brick1Dy && carDy + brick1Height > brick1Dy) {
      const isCollideMiddle =
        (carDx >= brickDx && carDx + carWidth < brickDx + brick1Width) ||
        (carDx + carWidth <= brickDx + brick1Width && carDx > brickDx);
      if (isCollideMiddle) {
        console.log("Bum Bum from MIDDLE 💥");
        return;
      }
      const isCollideFromLeft = carDx + carWidth >= brickDx && carDx < brickDx;
      if (isCollideFromLeft) {
        console.log("Bum Bum from LEFT 💥");
        return;
      }
      const isCollideFromRight =
        carDx <= brickDx + brick1Width &&
        carDx + carWidth > brickDx + brick1Width;
      if (isCollideFromRight) {
        console.log("Bum Bum from RIGHT 💥");
        return;
      }
    }
  }

  drawCanvas(
    bgImgHorizontalOffset,
    bgImgVerticalOffset,
    brick1,
    currentInterval
  ) {
    // 1) Draw background image
    this._drawBgImage(bgImgHorizontalOffset, bgImgVerticalOffset);
    this._drawBgImage(
      bgImgHorizontalOffset,
      bgImgVerticalOffset - this._canvas.height
    );
    // 2) Draw car
    this._drawCarImage();
    // 3) Draw bricks
    if (
      brick1.displayInterval === currentInterval ||
      brick1.displayInterval - 1 === currentInterval
    )
      this._drawBricks(
        bgImgHorizontalOffset,
        bgImgVerticalOffset,
        brick1,
        currentInterval
      );
    // 4) Detect collision
    if (brick1.displayInterval === currentInterval)
      this._detectCollision(bgImgHorizontalOffset, bgImgVerticalOffset, brick1);
  }

  isBgImgEnd(bgImgVerticalOffset) {
    return (
      bgImgVerticalOffset === this._canvas.height ||
      bgImgVerticalOffset > this._canvas.height
    );
  }

  canMoveHorizontal(bgImgHorizontalOffset, turnSpeed) {
    return (
      (bgImgHorizontalOffset < this._canvas.width / 2 && turnSpeed > 0) ||
      (bgImgHorizontalOffset > this._canvas.width / -2 && turnSpeed < 0)
    );
  }
}

export default new CanvasView();
