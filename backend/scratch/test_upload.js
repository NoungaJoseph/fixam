const dotenv = require('dotenv');
dotenv.config();

const { uploadFile } = require('../src/services/storage.service');

async function test() {
  const mockFile = {
    originalname: 'test_avatar.jpg',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('mock image data content')
  };

  try {
    console.log('Testing uploadFile for profile-images bucket...');
    const url = await uploadFile(mockFile, 'profile-images', { requireCloud: false });
    console.log('Upload successful! Returned URL:', url);
  } catch (err) {
    console.error('Upload failed with error:', err);
  }
}
test();
