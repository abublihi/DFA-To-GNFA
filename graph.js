  // Set up zoom support
  var svg = d3.select("#svg1"),
      inner = d3.select("#svg1 g"),
      zoom = d3.zoom().on("zoom", function() {
        inner.attr("transform", d3.event.transform);
      });
  svg.call(zoom);

  // Set up zoom support
  var svg = d3.select("#svg2"),
      inner = d3.select("#svg2 g"),
      zoom = d3.zoom().on("zoom", function() {
        inner.attr("transform", d3.event.transform);
      });
  svg.call(zoom);
  
  // Create and configure the renderer
  var render = dagreD3.render();
  
    var g;
  function tryDraw(svgId, value) {
      g = graphlibDot.read(value);
  
      // Set margins, if not present
      if (!g.graph().hasOwnProperty("marginx") &&
          !g.graph().hasOwnProperty("marginy")) {
        g.graph().marginx = 20;
        g.graph().marginy = 20;
      }
  
      g.graph().transition = function(selection) {
        return selection.transition().duration(500);
      };
  
      // Render the graph into svg g
      d3.select("#"+svgId+" g").call(render, g);
  }
