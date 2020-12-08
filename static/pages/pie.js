function randomizeDs() {
  return (new Array(4))
    .fill(null)
    .map(() => 2 + Math.round(Math.random() * 18));
}

function drawChart(dataset) {
  const canvasPaddingTop = 10;
  const canvasPaddingRight = 10;
  const canvasPaddingBottom = 10;
  const canvasPaddingLeft = 10;
  const pieInnerRadius = 90;
  const pieOuterRadius = 120;

  const svg = d3.select('#root svg');

  const pieG = svg
    .select('g#pie')
    .attr('transform', `translate(${canvasPaddingLeft + pieOuterRadius} ${canvasPaddingTop + pieOuterRadius})`);

  const arcFill = d3.scaleOrdinal()
    .domain([0, 1, 2, 3])
    .range(['#364f6b', '#3fc1c9', '#f5f5f5', '#fc5185']);

  const arcGenerate = d3.arc()
    .innerRadius(pieInnerRadius)
    .outerRadius(pieOuterRadius)
    .cornerRadius(4)
    .padAngle(0.02);

  const pieData = d3.pie().sort(null)(dataset);
  pieData.forEach((d, i) => {
    const oldPieData = pieG.node().__oldPieData || [];
    d.oldStartAngle = (oldPieData[i] && typeof oldPieData[i].startAngle === 'number')
      ? oldPieData[i].startAngle 
      : d.startAngle;
    d.newStartAngle = d.startAngle;
    d.oldEndAngle = (oldPieData[i] && typeof oldPieData[i].endAngle === 'number')
      ? oldPieData[i].endAngle 
      : d.endAngle;
    d.newEndAngle = d.endAngle;
  });
  pieG.node().__oldPieData = pieData;
  console.log(pieData);

  const allArcG = pieG.selectAll('g.piearc').data(pieData);

  allArcG.enter()
    .append('g')
    .attr('class', 'piearc')
    .each(function(d, i) {
      const path = d3.select(this).append('path');
      path
        .attr('fill', arcFill(i))
        .attr('d', arcGenerate(d));
      const label = d3.select(this).append('text');
      const labelCoord = arcGenerate.centroid(d); 
      label
        .attr('text-anchor', 'middle')
        .attr('x', labelCoord[0])
        .attr('y', labelCoord[1])
        .attr('fill', 'black')
        .attr('font-size', '13px')
        .text(d.data);
    });

  allArcG.each(function(d, i) {
    const path = d3.select(this).select('path');
    path
      .attr('fill', arcFill(i))
      .transition()
      .attrTween('d', function(d, i) {
        return function(t) {
          const startAngleInterpolate = d3.interpolate(d.oldStartAngle, d.newStartAngle);
          const endAngleInterpolate = d3.interpolate(d.oldEndAngle, d.newEndAngle);
          d.startAngle = startAngleInterpolate(t);
          d.endAngle = endAngleInterpolate(t);
          return arcGenerate(d);
        }
      });
      // .attr('d', arcGenerate(d));
    const label = d3.select(this).select('text');
    const labelCoord = arcGenerate.centroid(d); 
    label
      .attr('text-anchor', 'middle')
      .attr('x', labelCoord[0])
      .attr('y', labelCoord[1])
      .attr('fill', 'black')
      .attr('font-size', '13px')
      .text(d.data);
  });

  allArcG.exit().remove();
}

function handleRandomizeClick() {
  drawChart(randomizeDs());
}

window.addEventListener('load', function() {
  drawChart(randomizeDs());
});
