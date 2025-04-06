const s =
{
  img : null,
  predImg : null,
  canvas : null,
  counter : [],
  paragraph : null,
  info : null,
  mode : true
}

function countValues(x)
{
  if (s.counter[s.predImg.pixels[x + 0]]) {
    ++s.counter[s.predImg.pixels[x + 0]];
  } else {
    s.counter[s.predImg.pixels[x + 0]] = 1;
  }
  if (s.counter[s.img.pixels[x + 0] + 256]) {
    ++s.counter[s.img.pixels[x + 0] + 256];
  } else {
    s.counter[s.img.pixels[x + 0] + 256] = 1;
  }
}

function predictorDraw()
{
  s.counter = [];

  resizeCanvas(s.img.width*2, s.img.height)
  s.predImg = createImage(s.img.width, s.img.height)
  background(10);
  s.img.loadPixels();
  s.predImg.loadPixels();

  if(s.mode)
  {
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

      countValues(x);
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

    s.paragraph.html("Edge detector mode.");
  }else
  {
    s.predImg.pixels[0] = 
      (s.img.pixels[0]);
    s.predImg.pixels[1] = 
      (s.img.pixels[1]);
    s.predImg.pixels[2] = 
      (s.img.pixels[2]);
    s.predImg.pixels[3] = 255;

    countValues(0)

    for(let x=4; x < s.img.height*s.img.width*4; x+=4)
    {
      s.predImg.pixels[x + 0] = 
        (s.img.pixels[x - 4]
          - s.img.pixels[x + 0]) + 128;
      s.predImg.pixels[x + 1] = 
        (s.img.pixels[x - 3]
          - s.img.pixels[x + 1]) + 128;
      s.predImg.pixels[x + 2] = 
        (s.img.pixels[x - 2]
          - s.img.pixels[x + 2]) + 128;
      s.predImg.pixels[x + 3] = 255;

      countValues(x)
    }

    ppm = 0;
    for(let x=0, y=0; x<256; ++x)
    {
      if(s.counter[x])
      {
        let prob = s.counter[x]/(s.img.width*s.img.height);
        y+=prob;
        ppm += prob*Math.log2(1/prob);
      }
      console.log(x +" "+s.counter[x]+ " " + y);
    }
    s.paragraph.html("Vertical predictor mode: Red channel bpp: " + (ppm).toFixed(3));
    ppm = 0;
    for(let x=256, y=0; x<256+256; ++x)
    {
      if(s.counter[x])
      {
        let prob = s.counter[x]/(s.img.width*s.img.height);
        y+=prob;
        ppm += prob*Math.log2(1/prob);
      }
      console.log(x +" "+s.counter[x]+ " " + y);
    }
    s.paragraph.html(s.paragraph.html() + ", original: " + (ppm).toFixed(3));
  }
  s.img.updatePixels();
  s.predImg.updatePixels();
  image(s.img, 0, 0);
  image(s.predImg, s.img.width, 0);
}

function handleFile(file) 
{
  s.img = loadImage(file.data, 
    (newImg) =>
    {
    s.img = newImg;
    predictorDraw();
    s.info.html("Change the image by dropping a new one on the canvas.");
    }, 
    () => s.info.html("Chosen file is not a valid image.")
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
  
  s.paragraph = createP("");

  predictorDraw();

  let downloadButton = createButton('Download canvas');
  downloadButton.style('width', '150px')
    .style('height', '50px');
  downloadButton.mousePressed(() => {save();});

  let switchButton = createButton('Download canvas');
  switchButton.style('width', '150px')
    .style('height', '50px')
    .html("Vertical predictor mod");
  switchButton.mousePressed(() => { 
    s.mode = !s.mode; 
    if(s.mode) switchButton.html("Vertical predictor mod");
    else switchButton.html("Edge mode");
    predictorDraw();
  });
  s.info = createP("Change the image by dropping a new one on the canvas.");
}