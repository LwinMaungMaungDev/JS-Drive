import icons from "../../img/icons.svg";

import View from "./View.js";

class GameMenuView extends View {
  _parentElement = document.querySelector(".game-menu");

  _bgImg = new Image();
  _car1 = new Image();
  _car1_webp = new Image();
  _car2 = new Image();
  _car2_webp = new Image();
  _car3 = new Image();
  _car3_webp = new Image();
  _car4 = new Image();
  _car4_webp = new Image();
  _startBtnImg = new Image();

  _errorMessage = "Opps... Error! Please try again.";
  _message = "";

  constructor() {
    super();
    this._loadImages();
  }

  _loadImages() {
    // Cars
    this._car1.src = new URL(
      "../../img/cars/red-car1.png?as=png",
      import.meta.url
    );
    this._car2.src = new URL(
      "../../img/cars/yellow-car1.png?as=png",
      import.meta.url
    );
    this._car3.src = new URL(
      "../../img/cars/truck.png?as=png",
      import.meta.url
    );
    this._car4.src = new URL(
      "../../img/cars/white-car1.png?as=png",
      import.meta.url
    );
    // Start button
    this._startBtnImg.src = new URL(
      "../../img/btn/startBtn.png?as=png",
      import.meta.url
    );
  }

  _generateMarkup() {
    return `
      <div class="game-menu--middle">
        <h1 class="heading-primary game-menu-heading">JS Drive</h1>
        <div class="btns--change-car">
          <button class="btn btn--prev-car">
            <svg class="btn--icon">
              <use href="${icons}#icon-caret-up-outline"></use>
            </svg>
          </button>
          <button class="btn btn--next-car">
            <svg class="btn--icon">
              <use href="${icons}#icon-caret-down-outline"></use>
            </svg>
          </button>
        </div>
        <div class="slider-cars">
          <img
            class="slide-car-img slide--1"
            src="${this._car1.src}"
            alt="White Car Image"
          />
          <img
            class="slide-car-img slide--2"
            src="${this._car2.src}"
            alt="White Car Image"
          />
          <img
            class="slide-car-img slide--3"
            src="${this._car3.src}"
            alt="White Car Image"
          />
          <img
            class="slide-car-img slide--4"
            src="${this._car4.src}"
            alt="White Car Image"
          />
        </div>
        <div class="car-specs">
          <h2 class="car-specs-heading">Car Specs</h2>
          <ul class="car-specs-list">
            <li>Maximum Speed: ${this._data.maxSpeed * 5}</li>
            <li>Acceleration: ${this._data.speedUpRate * 5}</li>
            <li>Deceleration: ${this._data.slowDownRate * 5}</li>
            <li>Cornering Speed: ${this._data.turnSpeed * 5}</li>
          </ul>
        </div>
        <div class="start-button">
          <button class="btn btn-start">
            <img
              class="game-start-img"
              src="${this._startBtnImg.src}"
              alt="Start Button"
            />
          </button>
        </div>
      </div>
    `;
  }

  ///////////////////////////////////////////////////////////////
  // Handlers

  addHandler(gameStartHandler, nextCarHandler, prevCarHandler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn");
      if (!btn) return;
      if (btn.classList.contains("btn-start")) {
        gameStartHandler();
      }
      if (btn.classList.contains("btn--next-car")) {
        nextCarHandler();
      }
      if (btn.classList.contains("btn--prev-car")) {
        prevCarHandler();
      }
    });
  }

  ///////////////////////////////////////////////////////////////
  // Slider

  goToSlide = function (slide) {
    const slides = this._parentElement.querySelectorAll(".slide-car-img");
    slides.forEach(
      (s, i) => (s.style.transform = `translateY(${150 * (i - slide)}%)`)
    );
  };
}

export default new GameMenuView();
