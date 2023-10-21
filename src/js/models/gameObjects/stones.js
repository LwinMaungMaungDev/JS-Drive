export const stones = [
  // Do not add until interval 3
  // Be careful about ordering - Start from bottom (For pop())
  {
    type: 1,
    displayInterval: 8,
    dx: 0.2, // 0 means left-most and 1 means right-most
    width: 0.07,
    height: (0.07 * 50) / 79,
  },
  {
    type: 1,
    displayInterval: 5,
    dx: 0.7,
    width: 0.07,
    height: (0.07 * 50) / 79,
  },
  {
    type: 1,
    displayInterval: 3,
    dx: 0.5,
    width: 0.07,
    height: (0.07 * 50) / 79,
  },
];
