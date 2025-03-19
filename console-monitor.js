import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'D:\\portableApps\\GoogleChromePortable\\App\\Chrome-bin\\chrome.exe',
    args: ['--remote-debugging-port=9222']
  });

  const pages = await browser.pages();
  const page = pages[0];
  
  // Capture all console messages
  const cdp = await page.target().createCDPSession();
  await cdp.send('Runtime.enable');
  
  cdp.on('Runtime.consoleAPICalled', (event) => {
    const args = event.args.map(arg => arg.value);
    console.log(`[Console] ${event.type}:`, ...args);
  });

  // Capture exceptions
  cdp.on('Runtime.exceptionThrown', (event) => {
    console.error('[Exception]', event.exceptionDetails.exception.description);
  });

  await page.goto('http://localhost:3025/3d_portfolio/#/');
})();
