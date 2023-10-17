class CanvasView {
  _canvas = document.getElementById("canvas");
  _ctx = this._canvas.getContext("2d");
  _img = new Image();

  constructor() {
    this._loadCanvasImage();
  }

  _loadCanvasImage() {
    const imageUrl = new URL(
      "../../img/canvas/spacebg.png?as=png&width=100%&height=100%",
      import.meta.url
    );
    this._img.src = imageUrl;
  }

  initializeCanvas(startCanvasAnimation) {
    this._canvas.width = window.innerWidth;
    this._canvas.height = window.innerHeight;

    this._drawImage(this._img, 0, 0);

    startCanvasAnimation();
  }

  _drawImage(img, dx, dy) {
    this._ctx.drawImage(img, dx, dy, this._canvas.width, this._canvas.height);
  }

  drawCanvas(bgImgHorizontalOffset, bgImgVerticalOffset) {
    this._drawImage(this._img, bgImgHorizontalOffset, bgImgVerticalOffset);
    this._drawImage(
      this._img,
      bgImgHorizontalOffset,
      bgImgVerticalOffset - this._canvas.height
    );
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
