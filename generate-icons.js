const { createCanvas } = require('canvas');
const fs = require('fs');

// Create icon with quote mark design
function createIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#1e3a5f');
    gradient.addColorStop(1, '#0a0f1b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Quote mark
    ctx.fillStyle = '#64a5f5';
    ctx.font = `${size * 0.4}px Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('"', size / 2, size / 2);
    
    // Save to file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`icon-${size}.png`, buffer);
    console.log(`Created icon-${size}.png`);
}

// Generate required sizes
createIcon(192);
createIcon(512);

console.log('Icon generation complete!');
console.log('Note: If you don\'t have the canvas package installed, you can:');
console.log('1. Use any image editor to create simple icons');
console.log('2. Use online icon generators');
console.log('3. Skip icons - the app will still work without them');