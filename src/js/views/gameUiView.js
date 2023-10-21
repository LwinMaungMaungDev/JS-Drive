class GameUiView {
  _speedBtns = document.querySelector(".speed-btns");
  _turnBtns = document.querySelector(".turn-btns");
  _playTime = document.querySelector(".play-time");
  _score = document.querySelector(".score");
  _accelerometer = document.querySelector(".mph-text");
  _accelerometerLine = document.querySelector(".accel-line");
  _healthBarBackground = document.querySelector(".health-background");
  _healthBarValue = document.querySelector(".health-value");
  _gamePlayTimer;
  _gamePlayTime = 0;
  _healthBlinkTimer;

  increaseGamePlayTime() {
    this._gamePlayTime++;
    let hour = 0;
    let min = Math.trunc(this._gamePlayTime / 60);
    if (min >= 60) {
      hour = Math.trunc(min / 60);
      min = min % 60;
    }
    const sec = this._gamePlayTime % 60;

    this._playTime.innerHTML = `${String(hour).padStart(2, "0")}:${String(
      min
    ).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  setCurrentScore(score) {
    this._score.innerHTML = `Score: ${score}`;
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
    this._accelerometer.innerHTML = Math.round(currentSpeed * 5);
    // Indicator
    const level = Math.round((200 / maxSpeed) * currentSpeed);
    const { transform } = window.getComputedStyle(this._accelerometerLine);
    const matrixValues = transform.match(/matrix.*\((.+)\)/)[1].split(", ");
    this._accelerometerLine.style.transform = `translate(0, ${
      matrixValues[5]
    }px) rotate(${level - 100}deg)`;
  }

  ////////////////////////////////////////////////////////////////////////
  // Health Bar
  updateHealthBar(healthPercent) {
    const backgroundWidth = Number.parseInt(
      window.getComputedStyle(this._healthBarBackground).width
    );
    this._healthBarValue.style.width = `${backgroundWidth * healthPercent}px`;
    // Change color if health is low
    if (healthPercent < 0.2) {
      this._healthBarValue.style.backgroundColor = "#f00000";
      if (!this._healthBlinkTimer) {
        this._healthBlinkTimer = setInterval(() => {
          const bgColor = this._healthBarValue.style.backgroundColor;
          if (bgColor) this._healthBarValue.style.backgroundColor = "";
          else this._healthBarValue.style.backgroundColor = "#f00000";
        }, 1000);
      }
      if (healthPercent <= 0 && this._healthBlinkTimer) {
        clearInterval(this._healthBlinkTimer);
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////
  // Handlers

  addHandlerStartCountPlayTime() {
    this._gamePlayTimer = setInterval(
      this.increaseGamePlayTime.bind(this),
      1000
    );
  }

  addHandlerControlSpeed(speedUp, stopSpeedingUp, slowDown, stopSlowDown) {
    ["mousedown", "mouseup", "mouseout"].map((event) =>
      this._speedBtns.addEventListener(event, function (e) {
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
      this._turnBtns.addEventListener(event, function (e) {
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
}

export default new GameUiView();
