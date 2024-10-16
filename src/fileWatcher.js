const chokidar = require('chokidar');
const path = require('path');

const filePath = path.join(__dirname, 'watchedFile.txt');

const watcher = chokidar.watch(filePath);

watcher.on('change', (path) => {
  console.log(`File ${path} has been changed.`);
  // Add your file reading logic here
});