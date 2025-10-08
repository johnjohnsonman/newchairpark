// 강제 재빌드를 위한 스크립트
const fs = require('fs');
const path = require('path');

// 현재 타임스탬프로 빈 파일 생성
const timestamp = Date.now();
const filePath = path.join(__dirname, '..', 'public', `rebuild-${timestamp}.txt`);

fs.writeFileSync(filePath, `Rebuild triggered at: ${new Date().toISOString()}`);

console.log(`Force rebuild file created: ${filePath}`);
console.log('This will force Vercel to invalidate all caches');
