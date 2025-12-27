const fs = require('fs');
const path = require('path');

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, 'assets', 'sounds');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Create dummy sound files (you can replace with real MP3s later)
const sounds = [
  { name: 'click', content: 'Dummy sound file - replace with real MP3' },
  { name: 'success', content: 'Dummy sound file - replace with real MP3' },
  { name: 'money', content: 'Dummy sound file - replace with real MP3' },
  { name: 'error', content: 'Dummy sound file - replace with real MP3' },
  { name: 'background', content: 'Dummy sound file - replace with real MP3' }
];

sounds.forEach(sound => {
  const filePath = path.join(assetsDir, `${sound.name}.mp3`);
  fs.writeFileSync(filePath, sound.content);
  console.log(`Created ${filePath}`);
});

console.log('Sound files created! Replace with real MP3 files for better experience.');
