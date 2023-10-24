// For first road in city => dx = (0.31) (0.375) (0.44) <<<< >>>> (0.51) (0.575) (0.64)

export const botCars = [
  {
    displayInterval: 11,
    type: 1,
    direction: -1,
    dx: 0.31, // 0 means left-most and 1 means right-most
    dy: 0,
    width: 0.05,
    height: (0.05 * 337) / 178,
    speed: 4,
  },
  {
    displayInterval: 11,
    type: 1,
    direction: -1,
    dx: 0.44, // 0 means left-most and 1 means right-most
    dy: 0,
    width: 0.05,
    height: (0.05 * 337) / 178,
    speed: 2,
  },
  {
    displayInterval: 9,
    type: 1,
    direction: 1,
    dx: 0.64, // 0 means left-most and 1 means right-most
    dy: 0,
    width: 0.05,
    height: (0.05 * 337) / 178,
    speed: 0.5,
  },
  {
    displayInterval: 9,
    type: 1,
    direction: 1,
    dx: 0.575, // 0 means left-most and 1 means right-most
    dy: 0,
    width: 0.05,
    height: (0.05 * 337) / 178,
    speed: 1,
  },
  {
    displayInterval: 9,
    type: 1,
    direction: -1,
    dx: 0.375, // 0 means left-most and 1 means right-most
    dy: 0,
    width: 0.05,
    height: (0.05 * 337) / 178,
    speed: 2,
  },
  {
    displayInterval: 7,
    type: 1,
    direction: 1,
    dx: 0.575, // 0 means left-most and 1 means right-most
    dy: 0,
    width: 0.05,
    height: (0.05 * 337) / 178,
    speed: 1,
  },
  {
    displayInterval: 7,
    type: 1,
    direction: -1,
    dx: 0.44, // 0 means left-most and 1 means right-most
    dy: 0,
    width: 0.05,
    height: (0.05 * 337) / 178,
    speed: 4,
  },
  {
    displayInterval: 5,
    type: 1,
    direction: -1,
    dx: 0.44, // 0 means left-most and 1 means right-most
    dy: 0,
    width: 0.05,
    height: (0.05 * 337) / 178,
    speed: 3,
  },
  {
    displayInterval: 3,
    type: 1,
    direction: 1,
    dx: 0.51, // 0 means left-most and 1 means right-most
    dy: 0,
    width: 0.05,
    height: (0.05 * 337) / 178,
    speed: 1.5,
  },
  {
    displayInterval: 3,
    type: 1,
    direction: -1,
    dx: 0.44, // 0 means left-most and 1 means right-most
    dy: 0,
    width: 0.05,
    height: (0.05 * 337) / 178,
    speed: 1.5,
  },
];
