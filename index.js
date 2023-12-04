import express from 'express';
import qr from 'qr-image';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const _dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// Use express.static to serve static files
app.use(express.static(_dirname));

app.get('/', (req, res) => {
  res.sendFile(_dirname + '/index.html');
});

app.post('/submit', express.urlencoded({ extended: true }), (req, res) => {
  const url = req.body.URL;
  const qr_svg = qr.image(url, { type: 'png' });
  const qrPath = _dirname + '/qr-img.png';
  qr_svg.pipe(fs.createWriteStream(qrPath));

  fs.writeFile(_dirname + '/saved-URLs.txt', url, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });

  res.sendFile(_dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
