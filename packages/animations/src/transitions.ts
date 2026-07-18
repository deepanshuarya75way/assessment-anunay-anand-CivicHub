import { timing } from './timing';
import { curves } from './curves';

export const transitions = {
  hover: {
    duration: timing.fast / 1000,
    ease: curves.default,
  },
  press: {
    duration: 100 / 1000,
    ease: curves.default,
  },
  dialog: {
    duration: timing.normal / 1000,
    ease: curves.default,
  },
  page: {
    duration: timing.page / 1000,
    ease: curves.inOut,
  }
};
