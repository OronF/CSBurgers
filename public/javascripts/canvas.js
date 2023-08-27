var Height = 10;
let i= 0;
  function canvasApp(Height) {
    function  drawScreen () {
    context.fillRect(0, 0, theCanvas.width, theCanvas.height);

    Height += speed;
    for(let x = 0; x < 1700; x += 50)
    {
      context.beginPath();
      context.drawImage(img,x,Height,50,50);
      context.closePath();
      context.fill();
    }
  }


  theCanvas = document.getElementById('canvasOne');
  context = theCanvas.getContext('2d');
  img = document.getElementById("BurgerPicture");

  var speed = 3;

  function gameLoop() {
      if(Height > 900)
      {
         clearTimeout(timer)
         return;
      }
      var timer = window.setTimeout(gameLoop, 2);
      drawScreen()
  }
  gameLoop();
}
canvasApp(Height);