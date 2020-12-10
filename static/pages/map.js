function drawMap(geojson) {
  const canvasWidth = 1280;
  const canvasHeight = 720;

  const projection = d3.geoOrthographic()
    .translate([canvasWidth / 2, canvasHeight / 2])
    .scale(256); 
  const geoPath = d3.geoPath().projection(projection);

  const svg = d3.select('svg#theworld');

  svg.selectAll('path.country').data(geojson.features).enter()
    .append('path')
    .attr('class', 'country')
    .attr('fill', '#2D3D3B')
    .attr('d', geoPath);

  // Graticule
  const graticule = d3.geoGraticule();

  svg.insert('path', 'path.country')
    .datum(graticule())
    .attr('class', 'graticule-line')
    .attr('fill', 'none')
    .attr('stroke', '#93A897')
    .attr('stroke-opacity', 0.25)
    .attr('d', geoPath);

  svg.insert('path', 'path.country')
    .datum(graticule.outline())
    .attr('class', 'graticule-outline')
    .attr('fill', 'none')
    .attr('stroke', '#93A897')
    .attr('d', geoPath);

  // Rotate the globe
  const rotateScale = d3.scaleLinear()
    .domain([-canvasWidth / 2, 0, canvasWidth / 2])
    .range([-180, 0, 180]);

  // Zoom
  const zoom = d3.zoom().on('zoom', handleZoom);
  const initZoomSetting = d3.zoomIdentity
    .translate(canvasWidth / 2, canvasHeight / 2);
    // .scale(256); 

  svg.call(zoom).call(zoom.transform, initZoomSetting);

  svg.selectAll('path.country').on('mouseover', handleMouseOverCountry);
  svg.selectAll('path.country').on('mouseout', handleMouseOutCountry);

  function handleMouseOverCountry(e, d) {
    d3.select(this)
      .transition()
      .attr('fill', '#F2E8C8');
  }

  function handleMouseOutCountry(e, d) {
    d3.select(this)
      .transition()
      .attr('fill', '#2D3D3B');
  }

  function handleZoom(zoomE) {
    const {transform} = zoomE;
    const lambda = rotateScale(transform.x - canvasWidth / 2) % 360;
    const phi = -rotateScale(transform.y - canvasHeight / 2) % 360;
    projection
      // .translate([transform.x, transform.y])
      .rotate([lambda, phi, 0]);
      // .scale(transform.k);
    d3.selectAll('path.country').attr('d', geoPath);
    d3.selectAll('path.graticule-line').attr('d', geoPath);
    d3.selectAll('path.graticule-outline').attr('d', geoPath);
  }
}

window.addEventListener('load', function() {
  d3.json('/static/data/world.geojson').then((geojson) => {
    drawMap(geojson);
  }, (err) => {
    console.error(err);
  });
});
