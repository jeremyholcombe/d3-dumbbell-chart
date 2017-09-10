var svg = d3.select("svg"),
    margin = {top: 20, right: 30, bottom: 30, left: 150},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

// add scales
var x = d3.scaleLinear().rangeRound([10, width - 10]),
    y = d3.scalePoint().rangeRound([height, 10]).padding(0.4);

var chart = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// import data from csv
d3.csv("dumbbell.csv", function(d) {
  d.num_vehicles_t0 = +d.num_vehicles_t0; // coerce to number
  return d;
}, function(error, data) {

  if (error) throw error;

  // sort vehicles from highest to lowest inventory
  data.sort(function(a, b) {
    // range is flipped, so it ascends from bottom of chart
    return d3.ascending(+a.num_vehicles_t0, +b.num_vehicles_t0);
  });

  x.domain([0, d3.max(data, function(d) { return d.num_vehicles_t0; })]);
  y.domain(data.map(function(d) { return d.make_model; }));

  // x-axis
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    .append("text")
      .attr("text-anchor", "end")
      .text("# of Vehicles");

  // y-axis
  chart.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y));

  var dumbbellGroup = chart.append("g")
      .attr("id", "dumbbellGroup");

  var dumbbell = dumbbellGroup.selectAll(".dumbbell")
      .data(data)
    .enter().append("g")
      .attr("class", "dumbbell")
      .attr("transform", function(d) { return "translate(0," + y(d.make_model) + ")"; });

  // lines: between dots
  dumbbell.append("line")
      .attr("class", "line between")
      .attr("x1", function(d) { return x(d.num_vehicles_t); })
      .attr("x2", function(d) { return x(d.num_vehicles_t0); })
      .attr("y1", 0)
      .attr("y2", 0);

  // lines: before dots
  dumbbell.append("line")
      .attr("class", "line before")
      .attr("x1", 0)
      .attr("x2", function(d) { return x(d.num_vehicles_t); })
      .attr("y1", 0)
      .attr("y2", 0);

  // dots: current inventory
  dumbbell.append("circle")
      .attr("class", "circle current")
      .attr("cx", function(d) { return x(d.num_vehicles_t0); })
      .attr("cy", 0)
      .attr("r", 6);

  // data labels: current
  dumbbell.append("text")
      .attr("class", "text current")
      .attr("x", function(d) { return x(d.num_vehicles_t0); })
      .attr("y", 0)
      .attr("dy", ".35em")
      .attr("dx", 10)
      .text(function(d) { return d.num_vehicles_t0; });

  // data labels: future
  dumbbell.append("text")
      .attr("class", "text future")
      .attr("x", function(d) { return x(d.num_vehicles_t); })
      .attr("y", 0)
      .attr("dy", ".35em")
      .attr("dx", -10)
      .attr("text-anchor", "end")
      .text(function(d) { return d.num_vehicles_t; });

  d3.select(".dumbbell:last-child")
    .append("text")
      .attr("class", "label current")
      .attr("x", function(d) { return x(d.num_vehicles_t0); })
      .attr("y", 0)
      .attr("dy", -20)
      .attr("text-anchor", "middle")
      .text("Current");
  d3.select(".dumbbell:last-child")
    .append("text")
      .attr("class", "label future")
      .attr("x", function(d) { return x(d.num_vehicles_t); })
      .attr("y", 0)
      .attr("dy", -20)
      .attr("text-anchor", "middle")
      .text(function(d) { return d.time + " Days"; });

  // dots: future inventory
  dumbbell.append("circle")
      .attr("class", "circle future")
      .attr("cx", function(d) { return x(d.num_vehicles_t); })
      .attr("cy", 0)
      .attr("r", 6);

});
