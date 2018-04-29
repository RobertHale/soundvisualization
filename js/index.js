const width = 1100,
      height = 600,
      padding = 100;
//functions below are the templates for certain graphs
function createLineGraph(points, xName, yName, title){
    let svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    let x = d3.scaleLinear().range([padding, width-padding]);
    let y = d3.scaleLinear().range([height-padding, padding]);
    x.domain([d3.min(points, function(d){return d.x;}), d3.max(points, function(d){return d.x;})]);
    y.domain([d3.min(points, function(d){return d.x;}), d3.max(points, function (d) {return d.y;})]).nice();

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
        .attr("x", width/2 )
        .attr("y", padding)
        .style("color", "yellow")
        .style("text-anchor", "middle")
        .text(title);

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)")
        .text(yName);

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (width/2) +","+(height-(padding/3))+")")
        .text(xName);
}

function createBarGraph(points, xName, yName, title) {
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
        .attr("x", width/2 )
        .attr("y", padding)
        .style("text-anchor", "middle")
        .text(title);

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)")
        .text(yName);

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (width/2) +","+(height-(padding/3))+")")
        .text(xName);
}

function createScatterPlot(points, xName, yName, title){
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

    svg.append("text")
        .attr("x", width/2 )
        .attr("y", padding)
        .style("text-anchor", "middle")
        .text(title);

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)")
        .text(yName);

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (width/2) +","+(height-(padding/3))+")")
        .text(xName);
}

function createPieChart(data){
    let height = 800;
    let radius = Math.min(width, height) / 2;
    let donutWidth = radius / 3;
    let legendRectSize = 18;
    let legendSpacing = 4;
    let color = d3.scaleOrdinal(d3.schemeCategory10);

    let svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

    let arc = d3.arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius);

    let pie = d3.pie()
        .value(function(d) {return d.count;})
        .sort(null);

    let path = svg.selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", function(d, i) {return color(d.data.label);});

    let legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            let height = legendRectSize + legendSpacing;
            let offset = height * color.domain().length / 2;
            let horz = -2 * legendRectSize;
            let vert = i * height - offset;
            return "translate(" + horz + "," + vert + ")";
        });

    legend.append("rect")
        .attr("width", legendRectSize)
        .attr("height", legendRectSize)
        .style("fill", color)
        .style("stroke", color);

    legend.append("text")
        .attr("x", legendRectSize + legendSpacing)
        .attr("y", legendRectSize - legendSpacing)
        .text(function(d) {return d;});
}

//only really useful for piechart atm
function createTitleSVG(title){
    let svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", 150);

    svg.append("text")
        .attr("x", width/2 )
        .attr("y", padding)
        .style("text-anchor", "middle")
        .text(title);
}

function appendBottomBuffer(){
    d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", 100);
}

//functions below grab data
function graphArtistAlbumsXFollowers() {
    jQuery.getJSON("http://api.soundtrackdb.me/artist?limit=60").then(results => {onResult(results);});
}

function graphMediaGenreCount(){
    jQuery.getJSON("http://api.soundtrackdb.me/media?limit=1065").then(results => {onResultGenre(results);});
}

function graphMediaPopularityRating(){
    jQuery.getJSON("http://api.soundtrackdb.me/media?limit=1065").then(results => {onResultMedia(results)});
}

function graphTVSeasonPopularity(){
  jQuery.getJSON("http://api.soundtrackdb.me/media?type=tv_show&limit=59").then(results => {onSeason(results)});
}

function graphMediaRuntimePopularity(){
    jQuery.getJSON("http://api.soundtrackdb.me/media?limit=1065").then(results => {onResultRuntime(results)});
}

function onResultMedia(data){
    points = [];
    // console.log(data.items[0].seasons);
    for (i = 0; i < data.count; i++){
        // console.log(data.items[i].seasons);
        point = {y: data.items[i].popularity, x: data.items[i].average_rating, name: data.items[i].name};
        points.push(point);
    }
    points.sort(function(x, y){
        return d3.ascending(x.x, y.x);
    });
    createScatterPlot(points, "average rating", "popularity", "Media average rating to popularity");
    appendBottomBuffer();
}

function onResultGenre(data){
    mapCounts = {};
    //console.log(data);
    data.items.forEach(function (e) {
        e.genres.forEach(function (g) {
            if (g.name in mapCounts) {
                mapCounts[g.name] += 1;
            } else {
                mapCounts[g.name] = 1;
            }
        });
    });
    //console.log(mapCounts);
    points = [];
    for (let genre in mapCounts){
        points.push({label: genre, count: mapCounts[genre]});
    }
    createTitleSVG("Occurences of genres in TV show and movies");
    createPieChart(points);
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
    //console.log(points);
    createScatterPlot(points,
        "Number of albums",
        "number of Followers",
        "Per artist comparison of number of albums compared to followers");
    appendBottomBuffer();
}

function onSeason(data){
    var seasons = {};
    var popularity = {};
    var averagePopularity = [];
    points = [];
    for (a = 0; a < data.count; a++){
      if (data.items[a].seasons in seasons) {
        seasons[data.items[a].seasons] += 1;
      }
      else{
        seasons[data.items[a].seasons] = 1;
      }
      if (data.items[a].seasons in popularity) {
        popularity[data.items[a].seasons].push(data.items[a].popularity);
      }
      else{
        popularity[data.items[a].seasons] = [];
        popularity[data.items[a].seasons].push(data.items[a].popularity);
      }
    }
    for (var key in popularity) {
      var value = popularity[key]
      let sum = value.reduce((total, val) => {
        return total + val;
      });
      var averagePop = sum/seasons[key];
      averagePopularity[key] = averagePop;
    }
    for (i = 0; i < data.count; i++){
       point = {y: averagePopularity[data.items[i].seasons], x: data.items[i].seasons, name: data.items[i].name};
       points.push(point);
    }
    points.sort(function(x, y){
        return d3.ascending(x.x, y.x);
    });
    createBarGraph(points, "Number of seasons per TV show", "Average popularity per # of seasons", "TV show seasons to popularity");
    appendBottomBuffer();
}

function onResultRuntime(data){
  points = [];
  for (i = 0; i < data.count; i++){
      point = {y: data.items[i].popularity, x: data.items[i].runtime, name: data.items[i].name};
      points.push(point);
  }
  points.sort(function(x, y){
      return d3.ascending(x.x, y.x);
  });
  createScatterPlot(points, "runtime", "popularity", "Media runtime to popularity");
  appendBottomBuffer();
}


function init(){
    // const theData = [{x:1, y:10}, {x:2, y:11}, {x:3, y:15}, {x:4, y:22}, {x:5, y:5}];
    // const pieData = [{label: "hello", count: 10}, {label: "pie", count: 22}, {label: "chart", count: 10}];
    // createLineGraph(theData, "Index", "Value", "Title");
    // createBarGraph(theData, "Index", "Value", "Title");
    // createPieChart(pieData);
    // graphArtistAlbumsXFollowers();
    // graphMediaPopularityRating();
    // graphTVSeasonPopularity();
    // graphMediaRuntimePopularity();
    graphMediaGenreCount();
}

window.onload = init;
