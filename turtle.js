let turtle = (function namespace() {
   let PIXEL_RATIO = window.devicePixelRatio.PixelRatio || 1;
   let canvasPlaceholder = document.querySelector('.canvas-placeholder');
   let canvas = document.querySelector('.canvas');
   let script = document.querySelector('.script');
   let ctx = canvas.getContext('2d');
   let WIDTH, HEIGHT, position, direction, visible, pen, color;

   function onResize(evt){
		WIDTH = canvasPlaceholder.getBoundingClientRect().width * PIXEL_RATIO;
		HEIGHT = canvasPlaceholder.getBoundingClientRect().height * PIXEL_RATIO;
		canvas.setAttribute('width', WIDTH);
		canvas.setAttribute('height', HEIGHT);
		canvas.style.top = canvasPlaceholder.getBoundingClientRect().top + "px";
		canvas.style.left = canvasPlaceholder.getBoundingClientRect().left + "px";
		canvas.style.width = (WIDTH / PIXEL_RATIO) + "px"
		canvas.style.height = (HEIGHT / PIXEL_RATIO) + "px"
		if (evt){ 
			interpreter.runSoon(); 
		}
	}

   function clear() {
      ctx.save();
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.restore();
      reset();
      ctx.moveTo(position.x, position.y);
   }

   function reset() {
      recenter();
      direction = _deg2rad(90); // facing up
      visible = true;
      pen = true;
      color = 'black';
   }

   let RADIAN_PER_DEGREE = Math.PI / 180;
   function _deg2rad(degrees) {
      return degrees * RADIAN_PER_DEGREE;
   }

   function drawTurtle() {
      let userPen = pen;
      if (visible) {
         penUp(); _moveForward(5); penDown();
         _turn(-150); _moveForward(12);
         _turn(-120); _moveForward(12);
         _turn(-120); _moveForward(12);
         _turn(30);
         penUp(); _moveForward(-5);
         if (userPen) {
            penDown();
         }
      }
   }

   function _moveForward(distance) {
      let start = position;

      position = {
         x: start.x + Math.cos(direction) * distance * PIXEL_RATIO,
         y: start.y - Math.sin(direction) * distance * PIXEL_RATIO
      };
      if (pen) {
         ctx.lineStyle = color;
         ctx.beginPath();
         ctx.moveTo(start.x, start.y);
         ctx.lineTo(position.x, position.y);
         ctx.stroke();
      }
   }

   function penUp() { pen = false; }
   function penDown() { pen = true; }
   function hideTurtle() { visible = false; }
   function showTurtle() { visible = true; }
   function forward(block) { _moveForward(blocks.value(block)); }
   function back(block) { _moveForward(-blocks.value(block)); }
   function _turn(degrees) { direction += _deg2rad(degrees); }
   function left(block) { _turn(blocks.value(block)); }
   function right(block) { _turn(-blocks.value(block)); }
   function recenter() { position = {x: WIDTH/2, y: HEIGHT/2}; }

   onResize(null);
   clear();
   drawTurtle();

   interpreter.menuItem('Left', left, 5, 'degrees');
   interpreter.menuItem('Right', right, 5, 'degrees');
   interpreter.menuItem('Forward', forward, 10, 'steps');
   interpreter.menuItem('Back', back, 10, 'steps');
   interpreter.menuItem('Pen up', penUp);
   interpreter.menuItem('Pen down', penDown);
   interpreter.menuItem('Back to center', recenter);
   interpreter.menuItem('Hide turtle', hideTurtle);
   interpreter.menuItem('Show turtle', showTurtle);

   script.addEventListener('beforeRun', clear, false);
   script.addEventListener('afterRun', drawTurtle, false);
   window.addEventListener('resize', onResize, false);
})();