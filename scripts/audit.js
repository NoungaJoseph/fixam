const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

// Helpers
const getDirSize = (dir) => {
  if (!fs.existsSync(dir)) return 0;
  let size = 0;
  const walk = (currentDir) => {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else {
        size += stat.size;
      }
    }
  };
  walk(dir);
  return size;
};

const formatSize = (bytes) => (bytes / 1024 / 1024).toFixed(2) + ' MB';

// 1. Find all images and their sizes
const imageExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
const allImages = [];

const walkImages = (dir) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!['node_modules', '.expo', 'build', '.git', 'android', 'ios'].includes(file)) {
        walkImages(fullPath);
      }
    } else if (imageExts.includes(path.extname(file).toLowerCase())) {
      allImages.push({ path: fullPath, size: stat.size });
    }
  }
};

walkImages(path.join(projectRoot, 'assets'));
walkImages(path.join(projectRoot, 'app', 'assets'));
walkImages(path.join(projectRoot, 'app', 'src', 'assets'));

allImages.sort((a, b) => b.size - a.size);
console.log('--- TOP 50 LARGEST IMAGES ---');
allImages.slice(0, 50).forEach(img => {
  console.log(`${(img.size / 1024).toFixed(2).padStart(8)} KB : ${path.relative(projectRoot, img.path)}`);
});

// 2. Assets folder size
console.log('\n--- ASSETS FOLDER SIZES ---');
console.log('assets/:', formatSize(getDirSize(path.join(projectRoot, 'assets'))));
console.log('app/assets/:', formatSize(getDirSize(path.join(projectRoot, 'app', 'assets'))));
console.log('app/src/assets/:', formatSize(getDirSize(path.join(projectRoot, 'app', 'src', 'assets'))));

// 3. Unused images (will use exact task script later, skipping for now to just show size)
// 4. Large dependencies
console.log('\n--- LARGE DEPENDENCIES ---');
const pkgPath = path.join(projectRoot, 'app', 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  ['moment', 'lodash', 'lottie-react-native'].forEach(d => {
    if (deps[d]) console.log(`FOUND: ${d} @ ${deps[d]}`);
  });
} else {
  console.log('No app/package.json found');
}

// 5. Video files
console.log('\n--- VIDEO FILES ---');
const vidExts = ['.mp4', '.mov', '.avi'];
const walkVideos = (dir) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!['node_modules', '.expo', 'build', '.git'].includes(file)) walkVideos(fullPath);
    } else if (vidExts.includes(path.extname(file).toLowerCase())) {
      console.log(`${formatSize(stat.size).padStart(10)} : ${path.relative(projectRoot, fullPath)}`);
    }
  }
};
walkVideos(projectRoot);

// 6. node_modules size
console.log('\n--- NODE_MODULES SIZE ---');
console.log('app/node_modules/:', formatSize(getDirSize(path.join(projectRoot, 'app', 'node_modules'))));

