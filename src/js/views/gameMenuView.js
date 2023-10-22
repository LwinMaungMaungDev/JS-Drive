import View from "./View.js";

class GameMenuView extends View {
  _parentElement = document.querySelector(".game-menu");

  _carImg = new Image();
  _startBtnImg = new Image();

  _errorMessage = "Opps... Error! Please try again.";
  _message = "";

  constructor() {
    super();
    this._loadImages();
  }

  _loadImages() {
    // Car
    this._carImg.src = new URL(
      "../../img/cars/car.png?as=png",
      import.meta.url
    );
    // Start button
    this._startBtnImg.src = new URL(
      "../../img/btn/startBtn.png?as=png",
      import.meta.url
    );
  }

  _generateMarkup() {
    // You can use _data here
    return `
      <div class="game-menu--middle">
        <img
          class="game-menu--car-img"
          src="${this._carImg.src}"
          alt="Selected Car"
        />
        <button class="btn btn-start">
          <img
            class="game-start-img"
            src="${this._startBtnImg.src}"
            alt="Start Button"
          />
        </button>
      </div>
    `;
  }

  addHandlerGameStart(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn");
      if (!btn) return;
      if (btn.classList.contains("btn-start")) {
        handler();
      }
    });
  }
}

export default new GameMenuView();
