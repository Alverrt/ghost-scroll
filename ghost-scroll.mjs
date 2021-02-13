/* eslint-disable import/prefer-default-export */

import { Bezier } from 'bezier-js';

const randomInteger = async (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const humanScroll = async (page) => {
  const PIXELPERWHEEL = 100;

  const scroller = async (pixel) => {
    // eslint-disable-next-line no-shadow
    await page.evaluate((pixel) => {
      window.scrollBy(0, pixel);
    }, pixel);
  };

  const decideScrollLength = (wheelCount) => {
    const minLength = 3 * wheelCount + 7;

    const scrollLength = randomInteger(minLength, minLength + 2); // 3n+7
    return scrollLength;
  };

  const fixFirstThreeScrolls = (lut) => {
    const coords = lut;

    const firstThreeScrolls = [1, 5, 7];

    const middleOfArray = Math.floor(lut.length / 2);

    coords[middleOfArray - 2].x -= firstThreeScrolls[0];
    coords[middleOfArray].x -= firstThreeScrolls[1];
    coords[middleOfArray + 2].x -= firstThreeScrolls[2];

    coords.forEach((element) => {
      // eslint-disable-next-line no-param-reassign
      element.x = Math.floor(element.x);
    });

    // eslint-disable-next-line prefer-destructuring
    coords[1].x = firstThreeScrolls[0];
    // eslint-disable-next-line prefer-destructuring
    coords[2].x = firstThreeScrolls[1];
    // eslint-disable-next-line prefer-destructuring
    coords[3].x = firstThreeScrolls[2];

    return coords;
  };

  let counter = 2;
  let total = 0;
  let scrollPixel = 0;
  const midScrollsLoop = async (fixedLut, scrollLength) => {
    const fixedFixedLut = fixedLut;
    // eslint-disable-next-line consistent-return
    setTimeout(() => {
      if (counter === fixedFixedLut.length - 1) {
        return total;
      }
      scrollPixel = Math.floor(fixedFixedLut[counter + 1].x) - Math.floor(fixedFixedLut[counter].x);
      scroller(scrollPixel);
      total += scrollPixel;
      if (counter === scrollLength - 2) {
        counter = 2;
        return total;
      }
      counter += 1;
      midScrollsLoop(fixedFixedLut, scrollLength);
    }, await randomInteger(30, 45));
  };

  const midScrolls = async (wheelCount) => {
    const endScroll = PIXELPERWHEEL * wheelCount;

    const curve = await new Bezier(0, 0, 0, endScroll, endScroll, 0, endScroll, endScroll);
    const scrollLength = await decideScrollLength(wheelCount);
    const lut = await curve.getLUT(scrollLength);

    const fixedLut = await fixFirstThreeScrolls(lut);
    counter = 2;
    return midScrollsLoop(fixedLut, scrollLength);
  };

  const oneWheelScroller = async () => {
    await page.evaluate(
      () => {
        const oneWheelSmoothScrolls = [1, 5, 7, 11, 13, 14, 14, 13, 10, 7, 4, 1];
        let i = 0;
        setInterval(() => {
          window.scrollBy(0, oneWheelSmoothScrolls[i]);
          i += 1;
          if (i === (oneWheelSmoothScrolls.length - 1)) {
            clearInterval();
          }
        }, 50);
      },
    );
  };

  const actions = {
    scroll: async (wheelCount) => {
      if (wheelCount === 1) {
        await oneWheelScroller();
        return;
      }

      const middleScrollCount = await midScrolls(wheelCount);
    },
  };
  return actions;
};
