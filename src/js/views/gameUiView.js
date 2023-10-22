import icons from "../../img/icons.svg";

import View from "./View.js";

class GameUiView extends View {
  _parentElement = document.querySelector(".game-ui");
  _overlayElement = document.querySelector(".overlay");
  _gamePauseWindow = document.querySelector(".game-pause-window");
  _gameResumeBtn = document.querySelector(".btn-resume");
  _gameQuitBtn = document.querySelector(".btn-quit");
  _healthBlinkTimer;

  _accelerometerFrameImg = new Image();
  _accelerometerLineImg = new Image();
  _brakeImg = new Image();
  _leverImg = new Image();

  constructor() {
    super();
    this._loadImages();
  }

  _loadImages() {
    // Accelerometer Frame
    this._accelerometerFrameImg.src = new URL(
      "../../img/accelerometer/accelerometerFrame.png?as=png",
      import.meta.url
    );
    // Accelerometer Line
    this._accelerometerLineImg.src = new URL(
      "../../img/accelerometer/accelerometerLine.png?as=png",
      import.meta.url
    );
    // Brake
    this._brakeImg.src = new URL(
      "../../img/btn/brake.png?as=png",
      import.meta.url
    );
    // Lever
    this._leverImg.src = new URL(
      "../../img/btn/lever.png?as=png",
      import.meta.url
    );
  }

  _generateMarkup() {
    // You can use _data here
    return `
        <div class="game-left-components">
          <div class="label"><time class="play-time">00:00:00</time></div>
          <div class="accelerometer">
            <img
              class="accel-frame"
              src="${this._accelerometerFrameImg.src}"
              alt="Car Accelerometer Box"
            />
            <img
              class="accel-line"
              src="${this._accelerometerLineImg.src}"
              alt="Car Accelerometer Level Indicator"
            />
            <div class="mph">
              <p class="mph-text">123</p>
            </div>
          </div>
          <div class="turn-btns">
            <button class="btn btn--turn-left">
              <svg class="btn--icon">
                <use
                  href="${icons}#icon-caret-back-circle-outline"
                ></use>
              </svg>
            </button>
            <button class="btn btn--turn-right">
              <svg class="btn--icon">
                <use
                  href="${icons}#icon-caret-forward-circle-outline"
                ></use>
              </svg>
            </button>
          </div>
        </div>
        <div class="game-middle-components">
          <div class="health-bar">
            <div class="health health-background"></div>
            <div class="health health-value"></div>
          </div>
        </div>
        <div class="game-right-components">
          <div class="high-score-pause-container">
            <p class="high-score label">High Score: 0</p>
            <p class="score label">Score: 0</p>
            <button class="btn btn--pause">
              <svg class="btn--icon">
                <use href="${icons}#icon-pause-circle-outline"></use>
              </svg>
            </button>
          </div>
          <div class="speed-btns">
            <button class="btn btn--brake">
              <img
                class="brake"
                src="${this._brakeImg.src}"
                alt="Car Brake Pedal"
              />
            </button>
            <button class="btn btn--lever">
              <img
                class="lever"
                src="${this._leverImg.src}"
                alt="Car Lever Pedal"
              />
            </button>
          </div>
        </div>
    `;
  }

  updateGamePlayTime(gamePlayTime) {
    let hour = 0;
    let min = Math.trunc(gamePlayTime / 60);
    if (min >= 60) {
      hour = Math.trunc(min / 60);
      min = min % 60;
    }
    const sec = gamePlayTime % 60;

    this._parentElement.querySelector(".play-time").innerHTML = `${String(
      hour
    ).padStart(2, "0")}:${String(min).padStart(2, "0")}:${String(sec).padStart(
      2,
      "0"
    )}`;
  }

  setCurrentScore(score) {
    this._parentElement.querySelector(".score").innerHTML = `Score: ${score}`;
  }

  ////////////////////////////////////////////////////////////////////////
  // Accelerometer

  /**
   * Update the accelerometer kM/h and indicator level
   * @param {number} speed Max speed should be 60 which is displayed as (60 * 5 = 300). 300 is common speed for very fast sport cars in real world.
   * @param {number} level From 0 to 200
   */
  updateAccelerometer(speed, maxSpeed) {
    const currentSpeed = speed < 0 ? 0 : speed;
    // Speed
    this._parentElement.querySelector(".mph-text").innerHTML = Math.round(
      currentSpeed * 5
    );
    // Indicator
    const level = Math.round((200 / maxSpeed) * currentSpeed);
    const accelerometerLine = this._parentElement.querySelector(".accel-line");
    const { transform } = window.getComputedStyle(accelerometerLine);
    const matrixValues = transform.match(/matrix.*\((.+)\)/)[1].split(", ");
    accelerometerLine.style.transform = `translate(0, ${
      matrixValues[5]
    }px) rotate(${level - 100}deg)`;
  }

  ////////////////////////////////////////////////////////////////////////
  // Health Bar
  updateHealthBar(healthPercent) {
    const healthBarValue = this._parentElement.querySelector(".health-value");
    const backgroundWidth = Number.parseInt(
      window.getComputedStyle(
        this._parentElement.querySelector(".health-background")
      ).width
    );
    healthBarValue.style.width = `${backgroundWidth * healthPercent}px`;
    // Change color if health is low
    if (healthPercent < 0.2) {
      healthBarValue.style.backgroundColor = "#f00000";
      if (!this._healthBlinkTimer) {
        this._healthBlinkTimer = setInterval(() => {
          const bgColor = healthBarValue.style.backgroundColor;
          if (bgColor) healthBarValue.style.backgroundColor = "";
          else healthBarValue.style.backgroundColor = "#f00000";
        }, 1000);
      }
      if (healthPercent <= 0 && this._healthBlinkTimer) {
        clearInterval(this._healthBlinkTimer);
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////
  // Handlers

  addHandlerControlSpeed(speedUp, stopSpeedingUp, slowDown, stopSlowDown) {
    ["mousedown", "mouseup", "mouseout"].map((event) =>
      this._parentElement.addEventListener(event, function (e) {
        const el = e.target.closest(".btn");
        if (!el) return;
        if (el.classList.contains("btn--lever")) {
          if (event === "mousedown") speedUp();
          else stopSpeedingUp();
        } else if (el.classList.contains("btn--brake")) {
          if (event === "mousedown") slowDown();
          else stopSlowDown();
        }
      })
    );
  }

  addHandlerControlTurn(handler) {
    ["mousedown", "mouseup", "mouseout"].map((event) =>
      this._parentElement.addEventListener(event, function (e) {
        const el = e.target.closest(".btn");
        if (!el) return;
        if (el.classList.contains("btn--turn-left")) {
          if (event === "mousedown") handler(1);
          else handler(0);
        } else if (el.classList.contains("btn--turn-right")) {
          if (event === "mousedown") handler(-1);
          else handler(0);
        }
      })
    );
  }

  _toggleHiddenGamePauseWindow() {
    this._overlayElement.classList.toggle("hidden");
    this._gamePauseWindow.classList.toggle("hidden");
  }

  // *** Pause ***

  addHandlerGamePause(handler) {
    this._parentElement.addEventListener(
      "click",
      this._pauseGame.bind(this, handler)
    );
  }

  _pauseGame(handler, e) {
    const el = e.target.closest(".btn");
    if (!el) return;
    if (el.classList.contains("btn--pause")) {
      this._toggleHiddenGamePauseWindow();
      handler();
    }
  }

  // *** Resume ***

  addHandlerGameResume(handler) {
    this._gameResumeBtn.addEventListener(
      "click",
      this._resumeGame.bind(this, handler)
    );
  }

  _resumeGame(handler) {
    this._toggleHiddenGamePauseWindow();
    handler();
  }

  // *** Quit ***

  addHandlerGameQuit(handler) {
    this._gameQuitBtn.addEventListener(
      "click",
      this._quitGame.bind(this, handler)
    );
  }

  _quitGame(handler) {
    this._toggleHiddenGamePauseWindow();
    handler();
  }
}

export default new GameUiView();
