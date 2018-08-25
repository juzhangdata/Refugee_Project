var units = "Refugees";
const url = "https://raw.githubusercontent.com/ArunaNaripeddy/project2-test/master/raw_data/sankey_data.csv";

// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// format variables
var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d) { return formatNumber(d) + " " + units; },
    color = d3.scaleOrdinal(d3.schemeCategory20b);

// append the svg object to the body of the page
var svg = d3.select("#sankey-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          `translate(${margin.left}, ${margin.top})`);

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(80)
    .nodePadding(12)
    .size([width, height]);

var path = sankey.link();

function filterData(response, year) {
    //Filter by year selected
    const euList = ["germany", "france", "italy", "greece", 
                    "austria", "united kingdom", "spain",
                    "sweden", "belgium", "switzerland",
                    "portugal", "netherlands", "denmark"];
    var data = response
                .filter(d => {
                    var target = d.target.toLowerCase();
                    return ((d.year === year) && (euList.indexOf(target) >= 0));
                    
                })
                .sort(function(obj1, obj2){
                        return obj2.refugees - obj1.refugees; 
                    })
                .slice(0,30);
    console.log("filered data: ", data);
    return data;
}

// load the data
d3.csv(url, function(error, response) {
    if (error){
        return console.log("Couldn't read file: ", error);
    }

    d3.select("#year")
      .on("change", function() {
        var selectedYear = d3.select(this).node();
        var year = selectedYear.options[selectedYear.selectedIndex].value

        buildSankeyChart(response, year);
    });

    // generate initial graph
    var year = "2016";
	buildSankeyChart(response, year);
});

function buildSankeyChart(response, year){
    var data = filterData(response, year);
    var totalRefugees = d3.sum(data, function(d){
        return (+d.refugees);
   });

    // Set up graph with nodes and links array
    var graph = {"nodes" : [], "links" : []},
        refugeePercent = 0;

    data.forEach(function (d) {
        refugeePercent = formatNumber(100 * d.refugees/totalRefugees);
        graph.nodes.push({ "name": d.origin });
        graph.nodes.push({ "name": d.target });
        graph.links.push({ "source": d.origin,
                            "target": d.target,
                            "value": refugeePercent,
                            "refugeeCount": +d.refugees });
                
    });
  
    // Return only the distinct/unique nodes
    graph.nodes = d3.keys(d3.nest()
        .key(function (d) { return d.name; })
        .object(graph.nodes));
    
    // Loop through each link replacing the text with its index from node
    graph.links.forEach(function (d, i) {
        graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
        graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
    });
    
    // now loop through each nodes to make nodes an array of objects
    // rather than an array of strings
    graph.nodes.forEach(function (d, i) {
        graph.nodes[i] = { "name": d };
    });

    // Initializing sankey constructor
    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);

    // Add in the links
    var link = svg.append("g").selectAll(".link")
        .data(graph.links)
    .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
        .sort(function(a, b) { return b.dy - a.dy; });

    // Add the link titles
    link.append("title")
        .text(function(d) {
            return d.source.name + " → " + 
                d.target.name + "\n" + format(d.refugeeCount); });

    // Add in the nodes
    var node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
    .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { 
            return "translate(" + d.x + "," + d.y + ")"; })
        .call(d3.drag()
        .subject(function(d) {
            return d;
        })
        .on("start", function() {
            this.parentNode.appendChild(this);
        })
        .on("drag", dragmove));
        
    // Add the rectangles for the nodes
    node.append("rect")
        .attr("height", function(d) { return d.dy; })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d) { 
            return d.color = color(d.name.replace(/ .*/, "")); })
        .style("stroke", function(d) { 
            return d3.rgb(d.color).darker(2); })
    .append("title")
        .text(function(d) { 
            // Adding hover text to describe the flow of refugees
            // from each node/country 
            var sourceLinks = d.sourceLinks,
                targetLinks = d.targetLinks,
                refugees = 0;

            if(sourceLinks.length > 0){
                sourceLinks.forEach(function(_){
                    refugees += _.refugeeCount;
                });
            }
            else if(targetLinks.length > 0){
                targetLinks.forEach(function(_){
                    refugees += _.refugeeCount;
                });
            }
            return d.name + "\n" + format(refugees); 
        });

    // Add in the title for the nodes
    node.append("text")
        .attr("x", -6)
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

    // the function for moving the nodes
    function dragmove(d) {
        d3.select(this)
            .attr("transform", 
                "translate(" 
                    + d.x + "," 
                    + (d.y = Math.max(
                        0, Math.min(height - d.dy, d3.event.y))
                        ) + ")");
        sankey.relayout();
        link.attr("d", path);
    }
}


