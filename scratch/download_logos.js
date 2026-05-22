const fs = require('fs');
const https = require('https');
const path = require('path');

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(filepath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Successfully downloaded to ${filepath}`);
        resolve();
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

const assetsDir = path.join(__dirname, '..', 'app', 'assets');
const mtnUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/MTN_Logo.svg/320px-MTN_Logo.svg.png';
const orangeUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/320px-Orange_logo.svg.png';

async function main() {
  try {
    await download(mtnUrl, path.join(assetsDir, 'mtn_momo.png'));
    await download(orangeUrl, path.join(assetsDir, 'orange_money.png'));
    console.log('All downloads completed successfully!');
  } catch (err) {
    console.error('Error downloading files:', err);
  }
}

main();
