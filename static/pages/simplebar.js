function randomizeDs() {
  return (new Array(10))
    .fill(null)
    .map(() => Math.round(Math.random() * 900));
}

function drawChart(dataset) {
  const barHeight = 300;
  const svg = d3.select('#root svg');
  const ramp = d3.scaleLinear().domain([0, 1250]).range([barHeight, 0]);

  if (!document.getElementById('y_axis_g')) {
    const yAxis = d3.axisRight().scale(ramp);
    svg.append('g').attr('id', 'y_axis_g').call(yAxis);
    svg.select('g#y_axis_g').lower();
  }

  const allColG = svg.selectAll('g.col').data(dataset);

  allColG
    .attr('transform', (d, i) => `translate(${i * 35 + 50} ${ramp(d)})`)
    .each(function(d, i) {
      const colG = d3.select(this);
      colG.select('rect')
        .attr('width', 30)
        .attr('height', barHeight - ramp(d))
        .attr('stroke-width', '0')
        .attr('fill', '#0068d1')
        .attr('fill-opacity', '1');
      colG.select('text')
        .attr('text-anchor', 'middle')
        .attr('fill', '#0068d1')
        .attr('font-size', '13px')
        .text(d);
    });

  allColG.enter()
    .append('g')
    .attr('class', 'col')
    .attr('transform', (d, i) => `translate(${i * 35 + 50} ${ramp(d)})`)
    .each(function(d, i) {
      const colG = d3.select(this);
      colG.append('rect')
        .attr('width', 30)
        .attr('height', barHeight - ramp(d))
        .attr('stroke-width', '0')
        .attr('fill', '#0068d1')
        .attr('fill-opacity', '1');
      colG.append('text')
        .attr('text-anchor', 'middle')
        .attr('dx', 14)
        .attr('dy', -5)
        .attr('fill', '#0068d1')
        .attr('font-size', '13px')
        .text(d);
    });

  allColG.exit().remove();

  // const allRectBoundData = svg.selectAll('rect').data(dataset);
  
  // allRectBoundData
  //   .attr('x', (d, i) => i * 35)
  //   .attr('width', '30')
  //   .attr('stroke-width', '0')
  //   .attr('fill', '#0068d1')
  //   .attr('fill-opacity', '1')
  //   .transition()
  //     .delay((d, i) => i * 100)
  //     .attr('height', (d) => ramp(d))
  //     .attr('y', (d) => barHeight - ramp(d));

  // allRectBoundData.enter().append('rect').attr('y', barHeight).merge(allRectBoundData)
  //   .attr('x', (d, i) => i * 35 + 10)
  //   .attr('width', '30')
  //   .attr('stroke-width', '0')
  //   .attr('fill', '#0068d1')
  //   .attr('fill-opacity', '1')
  //   // .on('mouseover', function(d, i) {
  //   //   d3.select(this).transition().attr('fill', 'red');
  //   // }) 
  //   // .on('mouseout', function(d, i) {
  //   //   d3.select(this).transition().attr('fill', '#0068d1');
  //   // }) 
  //   .transition()
  //     .delay((d, i) => i * 100)
  //     .attr('height', (d) => ramp(d))
  //     .attr('y', (d) => barHeight - ramp(d));

  // allRectBoundData.exit().remove();

  // const allTextBoundData = svg.selectAll('text').data(dataset);

  // allTextBoundData
  //   .attr('text-anchor', 'middle')
  //   .attr('x', (d, i) => i * 35 + 14)
  //   .attr('fill', '#0068d1')
  //   .attr('font-size', '12px')
  //   .text((d) => d)
  //   .transition()
  //     .delay((d, i) => i * 100)
  //     .attr('y', (d) => barHeight - ramp(d) - 5);

  // allTextBoundData.enter()
  //   .append('text')
  //   .attr('text-anchor', 'middle')
  //   .attr('x', (d, i) => i * 35 + 24)
  //   .attr('y', barHeight)
  //   .attr('fill', '#0068d1')
  //   .attr('font-size', '12px')
  //   .text((d) => d)
  //   .transition()
  //     .delay((d, i) => i * 100)
  //     .attr('y', (d) => barHeight - ramp(d) - 5);

  // allTextBoundData.exit().remove();
}

function handleRandomDataset() {
  drawChart(randomizeDs());
}

window.addEventListener('load', function() {
  drawChart(randomizeDs());
});
