const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

// Directories to compress
const TARGET_DIRS = [
  path.join(__dirname, '../assets'),
  path.join(__dirname, '../app/assets'),
  path.join(__dirname, '../app/src/assets'),
].filter(dir => fs.existsSync(dir))

// Settings per image type
const SETTINGS = {
  // Large background/banner images
  large: { maxWidth: 1200, quality: 75 },
  // Regular UI images  
  normal: { maxWidth: 800, quality: 80 },
  // Small icons and thumbnails
  small: { maxWidth: 400, quality: 85 },
  // App icons — must stay crisp
  icon: { maxWidth: null, quality: 90 }
}

// Files to NEVER compress — keep original quality
const SKIP_FILES = [
  'icon.png',
  'adaptive-icon.png', 
  'splash.png',
  'fixam.png',
  'favicon.png',
  'google-services.json'
]

// Determine settings based on filename/folder
const getSettings = (filePath, stats) => {
  const name = path.basename(filePath).toLowerCase()
  const sizeKB = stats.size / 1024
  
  // Never compress app icons
  if (SKIP_FILES.some(skip => name.includes(
    skip.replace('.png', '').replace('.jpg', '')
  ))) {
    return null // skip
  }
  
  // Classify by size
  if (sizeKB > 1000) return SETTINGS.large
  if (sizeKB > 200) return SETTINGS.normal
  if (sizeKB > 50) return SETTINGS.small
  
  // Under 50KB — not worth compressing
  return null
}

async function getAllImages(dir) {
  const images = []
  
  const walk = (currentDir) => {
    if (!fs.existsSync(currentDir)) return
    const files = fs.readdirSync(currentDir)
    for (const file of files) {
      const fullPath = path.join(currentDir, file)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        // Skip node_modules and build folders
        if (!['node_modules', '.gradle', 'build', 
              '.expo', 'ios', 'android']
              .includes(file)) {
          walk(fullPath)
        }
      } else if (/\.(png|jpg|jpeg)$/i.test(file)) {
        images.push({ path: fullPath, stats: stat })
      }
    }
  }
  
  walk(dir)
  return images
}

async function compressImages() {
  console.log('🔍 Scanning for images...\n')
  
  let allImages = []
  for (const dir of TARGET_DIRS) {
    const imgs = await getAllImages(dir)
    allImages = allImages.concat(imgs)
  }
  
  console.log(`Found ${allImages.length} image files\n`)
  
  let totalBefore = 0
  let totalAfter = 0
  let compressed = 0
  let skipped = 0
  
  for (const { path: filePath, stats } of allImages) {
    const settings = getSettings(filePath, stats)
    
    if (!settings) {
      skipped++
      continue
    }
    
    const sizeBefore = stats.size
    totalBefore += sizeBefore
    
    try {
      const tempPath = filePath + '.tmp'
      
      let pipeline = sharp(filePath)
      
      // Resize if needed
      if (settings.maxWidth) {
        pipeline = pipeline.resize({
          width: settings.maxWidth,
          withoutEnlargement: true,
          fit: 'inside'
        })
      }
      
      // Convert PNG to optimized PNG or JPEG
      const ext = path.extname(filePath).toLowerCase()
      
      if (ext === '.png') {
        // Keep as PNG but optimize
        await pipeline
          .png({ 
            quality: settings.quality,
            compressionLevel: 9,
            palette: true  // reduces colors for smaller size
          })
          .toFile(tempPath)
      } else {
        // JPEG compression
        await pipeline
          .jpeg({ 
            quality: settings.quality,
            progressive: true,
            mozjpeg: true  // better compression
          })
          .toFile(tempPath)
      }
      
      const sizeAfter = fs.statSync(tempPath).size
      
      // Only replace if actually smaller
      if (sizeAfter < sizeBefore) {
        fs.unlinkSync(filePath)
        fs.renameSync(tempPath, filePath)
        totalAfter += sizeAfter
        compressed++
        
        const saving = ((1 - sizeAfter/sizeBefore) * 100)
          .toFixed(0)
        const beforeKB = (sizeBefore/1024).toFixed(0)
        const afterKB = (sizeAfter/1024).toFixed(0)
        
        console.log(
          `✅ ${path.relative(process.cwd(), filePath)}`
          + `\n   ${beforeKB}KB → ${afterKB}KB `
          + `(-${saving}%)`
        )
      } else {
        // Compressed is larger — keep original
        fs.unlinkSync(tempPath)
        totalAfter += sizeBefore
        skipped++
        console.log(
          `⏭️  Skipped (already optimized): `
          + path.relative(process.cwd(), filePath)
        )
      }
    } catch (error) {
      console.error(
        `❌ Failed: ${filePath} — ${error.message}`
      )
      totalAfter += sizeBefore
    }
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('COMPRESSION COMPLETE')
  console.log('='.repeat(50))
  console.log(`Files compressed: ${compressed}`)
  console.log(`Files skipped: ${skipped}`)
  console.log(
    `Size before: ${(totalBefore/1024/1024).toFixed(2)}MB`
  )
  console.log(
    `Size after:  ${(totalAfter/1024/1024).toFixed(2)}MB`
  )
  console.log(
    `Total saved: `
    + `${((totalBefore-totalAfter)/1024/1024).toFixed(2)}MB`
  )
  console.log(
    `Reduction:   `
    + `${((1-totalAfter/totalBefore)*100).toFixed(0)}%`
  )
}

compressImages().catch(console.error)
