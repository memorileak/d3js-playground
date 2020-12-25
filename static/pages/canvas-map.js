function drawMap(geojson) {
  const canvasWidth = 512;
  const canvasHeight = 512;

  const canvas = d3.select('canvas#theworld');
  const context = canvas.node().getContext('2d');

  const projection = d3.geoOrthographic()
    .translate([canvasWidth / 2, canvasHeight / 2])
    .scale(256); 

  // projection.rotate([0, -30, 0]);

  const geoPath = d3
    .geoPath()
    .projection(projection)
    .context(context);

  // const graticule = d3.geoGraticule();

  function drawOneFrame() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    geojson.features.forEach((d) => {
      context.beginPath();
      context.fillStyle = '#1d3557';
      geoPath(d);
      context.fill();

      // context.beginPath();
      // context.strokeStyle = '#a8dadc';
      // context.lineWidth = 0.25;
      // geoPath(graticule());
      // context.stroke();
      // context.closePath();
    });
  }

  drawOneFrame();

  const rotateQueue = [];
  let inRotateMode = false;
  let originClientX = 0;
  let originClientY = 0;
  let originRotate = [];

  const rotateXScale = d3.scaleLinear()
    .domain([-canvasWidth / 2, 0, canvasWidth / 2])
    .range([-180, 0, 180]);

  const rotateYScale = d3.scaleLinear()
    .domain([-canvasHeight / 2, 0, canvasHeight / 2])
    .range([180, 0, -180]);

  document.addEventListener('mousedown', function(e) {
    inRotateMode = true;
    originClientX = e.clientX;
    originClientY = e.clientY;
    originRotate = projection.rotate();
  });

  document.addEventListener('mouseup', function() {
    inRotateMode = false;
  });

  canvas.on('mousemove', function(e) {
    if (inRotateMode) {
      const movementX = e.clientX - originClientX;
      const movementY = e.clientY - originClientY;
      const [lambda, phi,] = originRotate;
      rotateQueue.push([
        lambda + rotateXScale(movementX), 
        phi + rotateYScale(movementY), 
        0
      ]); 
    }
  });

  function renderOnFrameTick() {
    const [nextRotate] = rotateQueue.splice(0, 1);
    if (nextRotate) {
      projection.rotate(nextRotate);
      drawOneFrame();
    }
    window.requestAnimationFrame(renderOnFrameTick);
  }

  window.requestAnimationFrame(renderOnFrameTick);

  // d3.timer(function() {
  //   const [nextRotate] = rotateQueue.splice(0, 1);
  //   if (nextRotate) {
  //     projection.rotate(nextRotate);
  //     drawOneFrame();
  //   }
  // });
}

window.addEventListener('load', function() {
  d3.json('/static/data/land-110m.json').then((landTopo) => {
    const featureCollection = topojson.feature(landTopo, landTopo.objects.land);
    drawMap(featureCollection);
  }, (err) => {
    console.error(err);
  });
});
