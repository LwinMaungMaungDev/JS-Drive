export const state = {
  canvas: {
    forwardSpeed: 0,
    turnSpeed: 0,
    bgImgVerticalOffset: 0,
    bgImgHorizontalOffset: 0,
    speedUpTimer,
    slowDownTimer,
  },
};

export const setForwardSpeed = function (speed) {
  state.canvas.forwardSpeed = speed;
};
