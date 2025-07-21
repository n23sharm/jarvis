const { chromium } = require('playwright');
const path = require('path');

(async () => {
    // Launch browser in headed mode
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 50 // Slow down actions by 50ms for better visibility
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Navigate to the local HTML file
    const filePath = `file://${path.resolve(__dirname, 'index.html')}`;
    await page.goto(filePath);
    
    console.log('Ruminations app is now running in the browser.');
    console.log('Keep this terminal open. Press Ctrl+C to exit.');
    
    // Keep the script running
    await new Promise(() => {});
})();