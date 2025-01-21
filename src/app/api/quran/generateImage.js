import { createCanvas, loadImage } from 'canvas';

export default async function handler(req, res) {
  const { name, imageUrl } = req.query;
  const canvas = createCanvas(800, 600);
  const context = canvas.getContext('2d');

  // Load the image
  const image = await loadImage(imageUrl);

  // Draw the image onto the canvas
  context.drawImage(image, 0, 0, 800, 600);

  // Add the name to the image
  context.font = '30px Arial';
  context.fillStyle = 'white';
  context.fillText(name, 50, 50);

  // Output the image
  res.setHeader('Content-Type', 'image/png');
  canvas.createPNGStream().pipe(res);
}
