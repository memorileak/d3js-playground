function randomizeDs() {
  const randNormal = d3.randomNormal(0.5, 0.2);
  return (new Array(200))
    .fill(null)
    .map(() => Math.round(Math.abs(randNormal()) * 700));
}

function drawBubbles(dataset) {
  const canvasPaddingLeft = 10;
  const canvasPaddingTop = 10;
  const canvasWidth = 700;
  const canvasHeight = 700;
  const nodes = dataset.map((v) => ({value: v}));

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

function drawNetwork(dataset) {
  const canvasPaddingLeft = 10;
  const canvasPaddingTop = 10;
  const canvasWidth = 700;
  const canvasHeight = 700;
  const nodeRadius = 15;

  const {nodes, edges} = dataset;

  const nodeRef = {};
  for (let i = 0; i < nodes.length; i += 1) {
    nodeRef[nodes[i].name] = nodes[i];
  }
  const links = edges.map((ed) => ({...ed, source: nodeRef[ed.from], target: nodeRef[ed.to]}));

  const svg = d3.select('svg#network');

  const manyBodyForce = d3.forceManyBody().strength(-50);
  const centerForce = d3.forceCenter()
    .x(canvasPaddingLeft + canvasWidth / 2)
    .y(canvasPaddingTop + canvasHeight / 2);
  const collideForce = d3.forceCollide().radius(nodeRadius);
  const linkForce = d3.forceLink().links(links).distance(75);

  const force = d3.forceSimulation()
    .nodes(nodes)
    .force('center', centerForce)
    .force('charge', manyBodyForce)
    .force('collision', collideForce)
    .force('link', linkForce);

  force.on('tick', update);

  svg.selectAll('line.link').data(links, (d) => `${d.from}-${d.to}`).enter()
    .append('line')
    .attr('class', 'link')
    .attr('x1', (d) => d.source.x)
    .attr('y1', (d) => d.source.y)
    .attr('x2', (d) => d.target.x)
    .attr('y2', (d) => d.target.y)
    .attr('stroke-width', (d) => d.weight)
    .attr('stroke', '#bbe1fa')
    .attr('marker-end', 'url(#arrow)');

  svg.selectAll('g.node').data(nodes, (d) => d.name).enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', (d) => `translate(${d.x} ${d.y})`)
    .each(function(d, i) {
      d3.select(this)
        .append('circle')
        .attr('r', nodeRadius)
        .attr('fill', '#0f4c75');
      d3.select(this)
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', 5)
        .attr('font-size', '13px')
        .attr('fill', '#fff')
        .text(d.name);
    });

  function update() {
    svg.selectAll('line.link')
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)
      .attr('marker-end', 'url(#arrow)');
    svg.selectAll('g.node')
      .attr('transform', (d) => `translate(${d.x} ${d.y})`);
  }
}

window.addEventListener('load', function() {
  // const sampleData = randomizeDs();
  // drawBubbles(sampleData);
  d3.json('/static/data/network.json').then((data) => {
    drawNetwork(data);
  }, (err) => {
    console.log(err);
  });
});
