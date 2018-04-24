const width = 1000,
      height = 500,
      padding = 50;

function createLineGraph(points, xName, yName){
    let svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    let x = d3.scaleLinear().range([padding, width-padding]);
    let y = d3.scaleLinear().range([height-padding, padding]);
    x.domain([d3.min(points, function(d){return d.x;}), d3.max(points, function(d){return d.x;})]);
    y.domain([0, d3.max(points, function (d) {return d.y;})]).nice();

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
        .attr("d", line(points));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)")
        .text(yName);

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (width/2) +","+(height-(padding/3))+")")
        .text(xName);
}

function createBarGraph(points, xName, yName) {
    let svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    let x = d3.scaleBand().rangeRound([padding, width-padding]).padding(0.3);
    let y = d3.scaleLinear().range([height-padding, padding]);
    x.domain(points.map(function(d) {return d.x;}));
    y.domain([0, d3.max(points, function (d) {return d.y;})]).nice();

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
        .data(points)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {return x(d.x);})
        .attr("y", function(d) {return y(d.y);})
        .attr("width", x.bandwidth())
        .attr("height", function(d) {return height - padding - y(d.y);});

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)")
        .text(yName);

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (width/2) +","+(height-(padding/3))+")")
        .text(xName);
}

function createScatterPlot(points){
    let svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    let xValue = function (d) {return d.x;},
        xScale = d3.scaleLinear().range([padding, width-padding]),
        xMap = function (d) {return xScale(xValue(d));},
        xAxis = d3.axisBottom(xScale);

    let yValue = function (d) {return d.y;},
        yScale = d3.scaleLinear().range([height-padding, padding]),
        yMap = function(d) {return yScale(yValue(d));},
        yAxis = d3.axisLeft().scale(yScale);

    xScale.domain([d3.min(points, xValue)-1, d3.max(points, xValue)]);
    yScale.domain([d3.min(points, yValue)-1, d3.max(points, yValue)]);

    let tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height-padding) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    svg.selectAll(".dot")
        .data(points)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", "red")
        .on("mouseover", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 9);
            tooltip.html(d.name + "<br/> (" + xValue(d) + ", " + yValue(d) + ")")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "py")
        })
        .on("mouseout", function () {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}

function appendBottomBuffer(){
    d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", 100);
}

function graphArtistAlbumsXFollowers() {
    jQuery.getJSON("http://api.soundtrackdb.me/artist?limit=60").then(results => {onResult(results)});
}

function onResult(data){
    points = [];
    for (i = 0; i < data.count; i++){
        point = {name: data.items[i].name, x: data.items[i].num_albums, y: data.items[i].followers};
        points.push(point);
    }
    points.sort(function(x, y){
        return d3.ascending(x.x, y.x);
    });
    // console.log(points);
    createScatterPlot(points);
    appendBottomBuffer();
}

function init(){
    const theData = [{x:1, y:10}, {x:2, y:11}, {x:3, y:15}, {x:4, y:22}, {x:5, y:5}];
    createLineGraph(theData, "Index", "Value");
    createBarGraph(theData, "Index", "Value");
    graphArtistAlbumsXFollowers();
}

window.onload = init;