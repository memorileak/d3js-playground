function randomizeDs() {
  return (new Array(4))
    .fill(null)
    .map(() => 2 + Math.round(Math.random() * 18));
}

let prevsData = [];

function drawChart(dataset) {
  const canvasMarginTop = 10;
  const canvasMarginLeft = 10;
  const canvasWidth = 240;
  const canvasHeight = 240;
  const pieInnerRadius = 90;
  const pieOuterRadius = 120;

  const canvas = d3.select('#root canvas#pie');
  const context = canvas.node().getContext('2d');

  const arcFill = d3.scaleOrdinal()
    .domain([0, 1, 2, 3])
    .range(['#364f6b', '#3fc1c9', '#f5f5f5', '#fc5185']);

  const arcGenerate = d3.arc()
    .innerRadius(pieInnerRadius)
    .outerRadius(pieOuterRadius)
    .cornerRadius(4)
    .padAngle(0.02)
    .context(context);

  const pieData = d3.pie().sort(null)(dataset);

  function drawOneFrame(context, pieData) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(canvasMarginLeft, canvasMarginTop, canvasWidth, canvasHeight);
    // context.save();
    context.translate(canvasMarginLeft + canvasWidth / 2, canvasMarginTop + canvasHeight / 2);
    pieData.forEach((d, i) => {
      context.beginPath();
      context.moveTo(0, 0);
      context.fillStyle = arcFill(i);
      arcGenerate(d);
      // context.stroke();
      context.fill();
    });
    // context.restore();
  }

  function drawPieWithAnimation(prevs, currs) {
    const interpolatePairs = [];
    for (let i = 0; i < currs.length; i += 1) {
      interpolatePairs.push([
        d3.interpolateNumber(prevs[i] ? prevs[i].startAngle : 0, currs[i].startAngle),
        d3.interpolateNumber(prevs[i] ? prevs[i].endAngle : 0, currs[i].endAngle),
      ]);
    }

    const animationDuration = 250;
    const startTime = performance.now();
    const tScale = d3.scaleLinear()
      .domain([startTime, startTime + animationDuration])
      .range([0, 1])
      .clamp(true);

    function renderOnFrameTick(time) {
      const t = tScale(time);
      if (t <= 1) {
        const pieData = currs.map((d, i) => ({
          ...d,
          startAngle: interpolatePairs[i][0](t),
          endAngle: interpolatePairs[i][1](t),
        }));
        drawOneFrame(context, pieData);
        window.requestAnimationFrame(renderOnFrameTick);
      }
    }
    window.requestAnimationFrame(renderOnFrameTick);
  }

  drawPieWithAnimation(prevsData, pieData);
  prevsData = pieData;
}

function handleRandomizeClick() {
  drawChart(randomizeDs());
}

window.addEventListener('load', function() {
  drawChart(randomizeDs());
});
