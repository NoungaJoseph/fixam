const fs = require('fs');
const path = require('path');

const easPath = path.join(process.cwd(), 'app', 'eas.json');
if (!fs.existsSync(easPath)) process.exit(0);

const j = JSON.parse(fs.readFileSync(easPath, 'utf8'));
if (j.build && j.build.preview && j.build.preview.env) {
  delete j.build.preview.env.SENTRY_AUTH_TOKEN;
}
fs.writeFileSync(easPath, JSON.stringify(j, null, 2) + '\n');
console.log('Scrubbed SENTRY_AUTH_TOKEN from app/eas.json');
