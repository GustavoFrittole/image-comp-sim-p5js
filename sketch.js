const s =
{
  img : null,
  predImg : null,
  canvas : null,
  counter : new Map(),
  value : null,
  paragraph : null
}

function countValues(x)
{
  if (s.counter.has(s.predImg.pixels[x + 0])) {
    s.counter.set(s.predImg.pixels[x + 0], s.counter.get(s.predImg.pixels[x + 0]) + 1);
  } else {
    s.counter.set(s.predImg.pixels[x + 0], 1);
  }
}

function predictorDraw()
{
  s.counter.clear();

  resizeCanvas(s.img.width*2, s.img.height)
  s.predImg = createImage(s.img.width, s.img.height)
  background(10);
  s.img.loadPixels();
  s.predImg.loadPixels();

  s.predImg.pixels[0] = 
    (abs(s.img.pixels[0] - 128)*2)%255;
  s.predImg.pixels[1] = 
    (abs(s.img.pixels[1] - 128)*2)%255;
  s.predImg.pixels[2] = 
    (abs(s.img.pixels[2] - 128)*2)%255;
  s.predImg.pixels[3] = 255;

  countValues(0)

  for(let x=4; x<s.img.width * 4; x += 4)
  {
    s.predImg.pixels[x + 0] = 
      (abs(s.img.pixels[x - 4]
        - s.img.pixels[x + 0])
        + abs(128
        - s.img.pixels[x + 0]))%255;
    s.predImg.pixels[x + 1] = 
      (abs(s.img.pixels[x - 3]
        - s.img.pixels[x + 1])
        + abs(128
        - s.img.pixels[x + 1]))%255;
    s.predImg.pixels[x + 2] = 
      (abs(s.img.pixels[x - 2]
        - s.img.pixels[x + 2])
        + abs(128
        - s.img.pixels[x + 2]))%255;
    s.predImg.pixels[x + 3] = 255;

    countValues(x)
  }
  
  for(let x=s.img.width*4; x < s.img.height*s.img.width*4; x+=4)
  {
    s.predImg.pixels[x + 0] = 
    (abs(s.img.pixels[x - 4]
      - s.img.pixels[x + 0])
      + abs(s.img.pixels[x - s.img.width*4 + 0]
      - s.img.pixels[x + 0]))%255;
    s.predImg.pixels[x + 1] = 
      (abs(s.img.pixels[x - 3]
        - s.img.pixels[x + 1])
        + abs(s.img.pixels[x - s.img.width*4 + 1]
        - s.img.pixels[x + 1]))%255;
    s.predImg.pixels[x + 2] = 
      (abs(s.img.pixels[x - 2]
        - s.img.pixels[x + 2])
        + abs(s.img.pixels[x - s.img.width*4 + 2]
        - s.img.pixels[x + 2]))%255;
    s.predImg.pixels[x + 3] = 255;

    countValues(x)
  }
  s.img.updatePixels();
  s.predImg.updatePixels();
  image(s.img, 0, 0);
  image(s.predImg, s.img.width, 0);

  s.value = 0;
  for(let c = 0; c < 10 ; c++)
    s.value += s.counter.get(c)/(s.img.width*s.img.height);
  s.paragraph.html("Valore interessante: " + s.value*100);
}

function handleFile(file) 
{
  s.img = loadImage(file.data, 
    (newImg) =>
    {
    s.img = newImg;
    predictorDraw();
    }, 
    () => console.log("Questa non è un'immagine\n")
  );
}

function preload()
{
  s.img = loadImage('resources/cute_image.jpg');
}

function setup() 
{
  s.canvas = createCanvas(s.img.width*2, s.img.height);
  s.canvas.drop(handleFile);
  
  s.paragraph = createP(" ");
  s.paragraph.style('text-align', 'center');

  predictorDraw();

  let downloadButton = createButton('Download canvas');
  downloadButton.style('width', '150px')
    .style('height', '50px')
    .style('text-align', 'center');
  downloadButton.mousePressed(() => {save();});
}