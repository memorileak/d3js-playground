function randomizeDs() {
  const randNormal = d3.randomNormal(0.5, 0.2);
  return (new Array(200))
    .fill(null)
    .map(() => Math.round(Math.abs(randNormal()) * 700));
}

function drawBubbles(dataset) {
  const nodes = dataset.map((v) => ({value: v}));
  const canvasPaddingLeft = 10;
  const canvasPaddingTop = 10;
  const canvasWidth = 700;
  const canvasHeight = 700;

  const svg = d3.select('svg#bubbles');

  const circleFill = d3.scaleOrdinal().range(['#1b262c', '#0f4c75', '#3282b8', '#bbe1fa']);

  // const manyBody = d3.forceManyBody().strength(10);
  // const center = d3.forceCenter()
  //   .x(canvasPaddingLeft + canvasWidth / 2)
  //   .y(canvasPaddingTop + canvasHeight / 2);

  const force = d3.forceSimulation(nodes)
    // .force('center', center)
    // .force('charge', manyBody)
    .force('x', d3.forceX().x((d) => canvasPaddingLeft + d.value).strength(2))
    .force('y', d3.forceY().y(canvasPaddingTop + canvasHeight / 2).strength(1))
    .force('collision', d3.forceCollide().radius((d) => 5));

  force.on('tick', update);

  svg.selectAll('circle').data(nodes).enter()
    .append('circle')
    .attr('cx', (d) => d.x)
    .attr('cy', (d) => d.y)
    .attr('fill', (d) => circleFill(d.value))
    .attr('r', 5);

  function update() {
    svg.selectAll('circle')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);
  }
}

window.addEventListener('load', function() {
  const sampleData = randomizeDs();
  drawBubbles(sampleData);
});
