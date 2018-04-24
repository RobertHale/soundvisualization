const theData = [{x:1, y:10}, {x:2, y:11}, {x:3, y:15}, {x:4, y:22}, {x:5, y:5}];

function createAxis(){
    let margin = {top: 20, bottom: 20, left: 20, right: 20},
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    let data = [3, 6, 2, 7, 5, 2, 0, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7];

    let svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let x = d3.scaleLinear().range([0, width]);
    let y = d3.scaleLinear().range([height,0]);
    x.domain([0, 6]);
    y.domain([0, d3.max(theData, function (d) {return d.y})]);

    let xAxis = d3.axisBottom().scale(x).ticks(5).tickSize(-height);
    let yAxis = d3.axisLeft().scale(y).ticks(4);

    let line = d3.line()
        .x(function (d) {return x(d.x);})
        .y(function (d) {return y(d.y);});

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("path")
        .attr("class", "line")
        .attr("d", line(theData));
}

function init(){
    createAxis();
}

window.onload = init;