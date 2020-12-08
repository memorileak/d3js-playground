function drawChart(dataset) {
  console.log(dataset);
  const canvasPaddingTop = 10;
  const canvasPaddingRight = 10;
  const canvasPaddingBottom = 20;
  const canvasPaddingLeft = 20;
  const canvasHeight = 300;
  const canvasWidth = 700;

  const svg = d3.select('#root svg');

  const xScale = d3.scaleLinear().domain([0, 6]).range([0, canvasWidth]);
  const yScale = d3.scaleLinear().domain([0, 10]).range([canvasHeight, 0]);

  if (!document.getElementById('y_axis_g')) {
    const yAxis = d3
      .axisLeft()
      .scale(yScale);
    svg.append('g')
      .attr('id', 'y_axis_g')
      .attr('transform', `translate(${canvasPaddingLeft} ${canvasPaddingTop})`)
      .call(yAxis);
    svg.select('g#y_axis_g').lower();
    // svg.select('#y_axis_g > g:nth-child(2)').style('display', 'none');
  }

  if (!document.getElementById('x_axis_g')) {
    const xAxis = d3.axisBottom()
      .scale(xScale)
      .tickValues([0, 1, 2, 3, 4, 5, 6])
      .tickFormat(d3.format('.0f'));
    svg.append('g')
      .attr('id', 'x_axis_g')
      .attr('transform', `translate(${canvasPaddingLeft} ${canvasPaddingTop + canvasHeight})`)
      .call(xAxis);
    svg.select('g#x_axis_g').lower();
  }

  const allColG = svg.selectAll('g.col').data(dataset);

  // allColG
  //   .attr('transform', (d, i) => `translate(${i * 35 + 50} ${yScale(d)})`)
  //   .each(function(d, i) {
  //     const colG = d3.select(this);
  //     colG.select('rect')
  //       .attr('width', 30)
  //       .attr('height', canvasHeight - yScale(d))
  //       .attr('stroke-width', '0')
  //       .attr('fill', '#0068d1')
  //       .attr('fill-opacity', '1');
  //     colG.select('text')
  //       .attr('text-anchor', 'middle')
  //       .attr('fill', '#0068d1')
  //       .attr('font-size', '13px')
  //       .text(d);
  //   });

  allColG.enter()
    .append('g')
    .attr('class', 'col')
    .attr('transform', (d, i) => `translate(${canvasPaddingLeft + (0.5 * xScale(1) + 1) + xScale(d.x0)} ${canvasPaddingTop + yScale(d.length)})`)
    .each(function(d, i) {
      const colG = d3.select(this);
      colG.append('rect')
        .attr('width', xScale(d.x1) - xScale(d.x0) - 2)
        .attr('height', canvasHeight - yScale(d.length))
        .attr('stroke-width', '0')
        .attr('fill', '#0068d1')
        .attr('fill-opacity', '1');
      colG.append('text')
        .attr('text-anchor', 'middle')
        .attr('dx', (0.5 * xScale(1) + 1))
        .attr('dy', -5)
        .attr('fill', '#0068d1')
        .attr('font-size', '13px')
        .text(d.length);
    });

  // allColG.exit().remove();
}


window.addEventListener('load', function() {
  d3.json('/static/data/tweets.json').then((data) => {
    const tweets = data.tweets;
    const histogramBin = d3.bin()
      .domain([0, 6])
      .thresholds([1, 2, 3, 4, 5])
      .value((d) => d.favorites.length);
    const histogramData = histogramBin(tweets);

    drawChart(histogramData);
  }).catch((err) => {
    console.error(err);
  });
});
