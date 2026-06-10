const fs = require('fs')
const path = require('path')

const ASSETS_DIRS = [
  path.join(__dirname, '../app/assets'),
  path.join(__dirname, '../app/src/assets'),
].filter(dir => fs.existsSync(dir))

const SRC_DIR = path.join(__dirname, '../app/src')

function getAllImageFiles() {
  const images = []
  
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return
    for (const file of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, file)
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath)
      } else if (/\.(png|jpg|jpeg|gif|webp)$/i
        .test(file)) {
        images.push(fullPath)
      }
    }
  }
  
  ASSETS_DIRS.forEach(walk)
  return images
}

function getAllSourceContent() {
  let content = ''
  
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return
    for (const file of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, file)
      if (fs.statSync(fullPath).isDirectory()) {
        if (!['node_modules', '.expo', 'build']
          .includes(file)) {
          walk(fullPath)
        }
      } else if (/\.(js|jsx|ts|tsx|json)$/
        .test(file)) {
        content += fs.readFileSync(fullPath, 'utf8')
      }
    }
  }
  
  walk(SRC_DIR)
  // Also check root files
  ;['App.js', 'app.json', 'eas.json'].forEach(f => {
    const fullPath = path.join(__dirname, '../app', f)
    if (fs.existsSync(fullPath)) {
      content += fs.readFileSync(fullPath, 'utf8')
    }
  })
  
  return content
}

const images = getAllImageFiles()
const sourceContent = getAllSourceContent()
const unused = []
let unusedSize = 0

for (const imagePath of images) {
  const fileName = path.basename(imagePath)
  const nameWithoutExt = fileName.replace(
    /\.(png|jpg|jpeg|gif|webp)$/i, ''
  )
  
  // Check if referenced in source
  const isUsed = sourceContent.includes(fileName) || 
    sourceContent.includes(nameWithoutExt)
  
  if (!isUsed) {
    const size = fs.statSync(imagePath).size
    unusedSize += size
    unused.push({ 
      path: imagePath, 
      size: (size/1024).toFixed(0) + 'KB' 
    })
  }
}

console.log(`\nUNUSED IMAGES (${unused.length} files)`)
console.log('='.repeat(50))
unused.forEach(img => {
  console.log(`${img.size.padEnd(10)} ${img.path}`)
})
console.log(
  `\nTotal unused: `
  + `${(unusedSize/1024/1024).toFixed(2)}MB`
)
console.log('\nReview this list carefully before deleting!')
