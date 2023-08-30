
function canvasApp() {
    let Height = 10;
    let i = 0;

    function drawScreen () {
      context.fillStyle = "white"
      context.fillRect(0, 0, theCanvas.width, theCanvas.height);

      Height += speed;
      for(let x = 0; x < 590; x += 50)
      {
        context.beginPath();
        context.drawImage(img,x,Height,50,50);
        context.closePath();
        context.fill();
      }
    }


  theCanvas = document.getElementById('Canvas');
  context = theCanvas.getContext('2d');
  img = document.getElementById("BurgerPicture");

  let speed = 2;

  function gameLoop() {
      if(Height > 490)
      {
         clearTimeout(timer)
         return;
      }
      var timer = window.setTimeout(gameLoop, 2);
      drawScreen();
  }
  gameLoop();
}

window.canvasApp = canvasApp;