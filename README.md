# humanScroll Function Documentation

The `humanScroll` function is designed to simulate human-like scrolling behavior on a web page using puppeteer. It includes a combination of smooth and random scrolling movements to mimic natural user behavior.

## Prerequisites

- This function is intended to be used with [puppeteer](https://github.com/puppeteer/puppeteer) for browser automation.

## Usage

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Example usage
  const scrollActions = await humanScroll(page);
  await scrollActions.scroll(3, 'down');

  await browser.close();
})();