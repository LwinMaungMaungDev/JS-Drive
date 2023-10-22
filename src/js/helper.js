/**
 * Calculate the horizontal offset inside the canvas where the player's car is currently at.
 * @param {number} canvasWidth The width of the canvas
 * @param {number} carWidth The width of the player's car
 * @returns {number}
 */
export const calCarDx = function (canvasWidth, carWidth) {
  return canvasWidth / 2 - carWidth / 2;
};

/**
 * Calculate the vertical offset inside the canvas where the player's car is currently at.
 * @param {number} canvasHeight The height of the canvas
 * @param {number} carHeight The height of the player's car
 * @returns {number}
 */
export const calCarDy = function (canvasHeight, carHeight) {
  return canvasHeight - carHeight * 2;
};

/**
 * Calculate the player's car dimensions: width and height
 * @param {Object} car
 * @returns {Object}
 */
export const calCarDimensions = function (car, canvasWidth) {
  const carWidth = responsive(car.width, canvasWidth);
  const carHeight = carWidth * car.heightWidthRatio;
  return { carWidth, carHeight };
};

/**
 * Calculate dimensions with respect to the current canvas width
 * @param {number} value
 * @returns {number}
 */
export const responsive = function (value, canvasWidth) {
  return value * canvasWidth;
};

/**
 * Get angle in radian by passing angle in degree
 * @param {number} deg
 */
export const calcRadian = function (deg) {
  return (deg * Math.PI) / 180;
};
