const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'app', 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const results = [];

walkDir(srcDir, (filePath) => {
  if (!filePath.endsWith('.js')) return;
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let inUseEffect = false;
  let useEffectStart = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Simple push check
    if (line.includes('navigation.push(')) {
      results.push(`push() call | ${filePath.replace(srcDir, '')} | ${i + 1} | ${line.trim()}`);
    }
    
    // Navigation inside render (heuristic: look for navigation.navigate outside functions)
    // Too complex for simple script, but we can look for useEffect navs
    if (line.includes('useEffect(') || line.includes('useFocusEffect(')) {
      inUseEffect = true;
      useEffectStart = i;
    }
    
    if (inUseEffect && (line.includes('navigation.navigate(') || line.includes('navigation.goBack(') || line.includes('navigation.reset('))) {
      results.push(`useEffect nav | ${filePath.replace(srcDir, '')} | ${i + 1} | ${line.trim()}`);
    }
    
    // Very rudimentary block tracking
    if (inUseEffect && line.includes('}, [')) {
      inUseEffect = false;
    }
  }
});

fs.writeFileSync('nav_report.txt', results.join('\n'));
console.log('Report generated at nav_report.txt');
