const theData = [{x:1, y:10}, {x:2, y:11}, {x:3, y:15}, {x:4, y:22}, {x:5, y:5}];
const width = 1000,
      height = 500,
      padding = 50;

function createLineGraph(){
    let svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    let x = d3.scaleLinear().range([padding, width-padding]);
    let y = d3.scaleLinear().range([height-padding, padding]);
    x.domain([1, 5]);
    y.domain([0, d3.max(theData, function (d) {return d.y;})]).nice();

    let xAxis = d3.axisBottom().scale(x).ticks(5);
    let yAxis = d3.axisLeft().scale(y).ticks(4);

    let line = d3.line()
        .x(function (d) {return x(d.x);})
        .y(function (d) {return y(d.y);});

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height-padding) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    svg.append("path")
        .attr("class", "line")
        .attr("d", line(theData));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)")
        .text("Value (in terms of y)");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (width/2) +","+(height-(padding/3))+")")
        .text("index");
}

function createBarGraph() {
    let svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    let x = d3.scaleBand().rangeRound([padding, width-padding]).padding(0.3);
    let y = d3.scaleLinear().range([height-padding, padding]);
    x.domain(theData.map(function(d) {return d.x;}));
    y.domain([0, d3.max(theData, function (d) {return d.y;})]).nice();

    let xAxis = d3.axisBottom().scale(x).ticks(5);
    let yAxis = d3.axisLeft().scale(y).ticks(4);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height-padding) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    svg.selectAll(".bar")
        .data(theData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {return x(d.x);})
        .attr("y", function(d) {return y(d.y);})
        .attr("width", x.bandwidth())
        .attr("height", function(d) {return height - padding - y(d.y);});
}

function init(){
    createLineGraph();
    createBarGraph();
}

window.onload = init;