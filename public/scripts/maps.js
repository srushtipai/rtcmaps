/*global $ Meny d3 */

$(document).ready(function() {
  $('#floor').select2();
  customStyles();

  var meny = Meny.create({
  	menuElement: document.querySelector( '.meny' ),
  	contentsElement: document.querySelector( '.contents' ),
  	position: 'left',
  	height: 100,
  	width: 260,
  	angle: 30,
  	threshold: 40,
  	overlap: 6,
  	transitionDuration: '0.5s',
  	transitionEasing: 'ease',
  	gradient: 'rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.65) 100%)',
  	mouse: true,
  	touch: true,
  });

  const mobile = $(window).width() <= 500;
  renderSVG(mobile, $('#floor').select2('data')[0].text, true);

  $('.sw').change(function () {
    if ($(this).is(':checked')) {
      renderMockBeacons();
    } else {
      d3.selectAll('circle').remove();
    }
  });

  $('#floor').on('select2:select', function (e) {
    var data = e.params.data;
    renderSVG(mobile, data.text, false);
  });
});

// Should figure out a way to do this in css
function customStyles() {
  // Custom styles for stuart maps
  if (window.location.pathname === '/stuart') {
    $('body').height('100vh');
  }
}

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function returnRGBColor(temp) {
  let max = 50;
  let avg = temp/max;
  let red = Math.round(avg*255);
  let green = avg >= 0.5 ? 1 : 0;
  let blue = Math.round((1 - avg) * 255);
  return `rgb(${red}, ${green}, ${blue})`;
}

function renderMockBeacons() {
  const viewBox = d3.select('svg').attr('viewBox').split(" ");
  const width = parseInt(viewBox[2], 10) - 200;
  const height = parseInt(viewBox[3], 10) - 200;
  let i;
  for (i = 0; i < 10; i++) {
    renderBeacon(getRandomNumber(200, width), getRandomNumber(100, height), Math.floor(getRandomNumber(0, 50)));
  }
}

function renderBeacon (x, y, temp) {
  d3.select('svg').append('circle')
                  .attr("cx", x)
                  .attr("cy", y)
                  .attr("r", 15);

  d3.select('svg').append('circle')
                  .attr("cx", x)
                  .attr("cy", y)
                  .attr("r", 0)
                  .attr("data-toggle", "tooltip")
                  .attr("title", `Temperature: ${temp}°C`)
                  .on('mouseover', function() {
                    d3.select(this).transition()
                                   .duration(300)
                                   .attr("r", "100");
                    $(this).tooltip();
                    $(this).tooltip('show');
                  })
                  .on('mouseout', function () {
                    d3.select(this).transition()
                                   .duration(300)
                                   .attr("r", "50");
                  })
                  .style("fill", returnRGBColor(temp))
                  .style("fill-opacity", "0.6")
                  .style("stroke", "black")
                  .style("stroke-dasharray", "80, 50")
                  .style("stroke-width", "8")
                  .transition()
                  .duration(300)
                  .attr("r", 50)
                  .attr("transform", "rotate(180deg)");
  }

function renderSVG (mobile, svgName, initialRender) {
  const currentPath = window.location.pathname;
  const svgPath = !mobile ? `/svg/${svgName}-R.svg` : `/svg/${svgName}.svg`;

  d3.xml(svgPath, function(xml) {
    $('[data-toggle="tooltip"]').tooltip('hide');
    try {
      $('.svgContainer').empty();
      $('.svgContainer').append(xml.documentElement);
      const svg = d3.select('svg');
      svg.on("click", function() {
        let coordinates = d3.mouse(this);
        console.log(`x: ${coordinates[0]}\n y: ${coordinates[1]}`);
      });
      svg.attr('width', '100%');
      svg.attr('height', !mobile ? '87vh' : '100%');
      
      if (!initialRender) {
        $('.alert').remove();
      }
    } catch (e) {
      $('.alert').remove();
      $('nav').after(`<div class="alert alert-danger container" style="margin-top: 25px;" role="alert">
        Sorry the map for this floor doesn't exist.
      </div>`);
    }
  });
}

// Functions for mapping real life becons on Map
function setLocation(x, y, radius) {
    d3.select('svg').append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r", 15);

    d3.select('svg').append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .style("fill", "#5e8fd1")
                    .style("fill-opacity", "0.59")
                    .attr("r", 10)
                    .transition()
                    .duration(750)
                    .attr("r", radius);
}

// Gets aspect ratio for SVG Map. Should be same as real aspect ration of building floor.
function getAspectRatio() {
  const origin = d3.select('.origin').filter('path').node().getBBox();
  const originTop = d3.select('.originTop').filter('path').node().getBBox();
  return ((origin.y + origin.height) - originTop.y)/((originTop.x + originTop.width)- origin.x)
}

// Gets aspect ratio for real building floor from meta-data embedded in SVG maps
function getRealAspectRatio() {
  return parseFloat(d3.select('svg').attr('data-height'), 10)/parseFloat(d3.select('svg').attr('data-width'), 10)
}

function mapX (x) {
  const origin = d3.select('.origin').filter('path').node().getBBox();
  const originTop = d3.select('.originTop').filter('path').node().getBBox();
  const in_min = 0;
  const in_max = parseFloat(d3.select('svg').attr('data-width'), 10);
  const out_min = origin.x;
  const out_max = originTop.x + originTop.width;
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function inverseMapX(svgX) {
  const origin = d3.select('.origin').filter('path').node().getBBox();
  const originTop = d3.select('.originTop').filter('path').node().getBBox();
  const in_min = origin.x;
  const in_max = originTop.x + originTop.width;
  const out_min = 0;
  const out_max = parseFloat(d3.select('svg').attr('data-width'), 10);
  return (svgX - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}


function mapY (y) {
  const origin = d3.select('.origin').filter('path').node().getBBox();
  const originTop = d3.select('.originTop').filter('path').node().getBBox();
  const in_min = 0;
  const in_max = parseFloat(d3.select('svg').attr('data-height'), 10);
  const out_min = origin.y + origin.height;
  const out_max = originTop.y;
  return (y - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function inverseMapY(svgY) {
  const origin = d3.select('.origin').filter('path').node().getBBox();
  const originTop = d3.select('.originTop').filter('path').node().getBBox();
  const in_min = origin.y + origin.height;
  const in_max = originTop.y;
  const out_min = 0;
  const out_max = parseFloat(d3.select('svg').attr('data-height'), 10);
  return (svgY - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function setBeacon(x,y, mobile) {
  if (mobile) {
    setLocation(mapX(x), mapY(y), 100);
  } else {
    const newX = mapX(parseFloat(d3.select('svg').attr('data-width'), 10)) - mapX(x);
    setLocation(mapY(y), newX, 100);
  }
}