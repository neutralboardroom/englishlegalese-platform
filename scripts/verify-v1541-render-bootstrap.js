const fs = require('fs');
const app = fs.readFileSync('app.js','utf8');
if (!app.includes('EnglishLegalese v1.54.1')) {
  console.error('Missing v1.54.1 launch frontend marker.');
  process.exit(1);
}
if (!app.includes('app-legacy-v1.54.0.js')) {
  console.error('Missing preservation note for the original v1.54.0 frontend.');
  process.exit(1);
}
if (!app.includes('document.addEventListener') && !app.includes('route();')) {
  console.error('Missing stable initial route bootstrap.');
  process.exit(1);
}
console.log('v1.54.1 Render bootstrap verifier passed.');
