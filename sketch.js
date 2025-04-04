img = null

function preload()
{
  img = loadImage('resources/cute_image.jpg');
}

function setup() 
{
  createCanvas(img.width, img.height);
}

function draw()
{
  background(10);
  img.loadPixels();
  for(y=0; y<img.height; ++y)
    for(x=0; x<img.width * 4; x += 4)
    {
      img.pixels[x + img.width * y * 4] = (++img.pixels[x + img.width * y * 4]) % 255;
    }
  console.log(frameCount);
  img.updatePixels();
  image(img, 0, 0);
}