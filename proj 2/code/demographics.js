var dataHost;
var dataOrig;
var forma = d3.format("s");
var format = d3.format(",d");
var barHeight = 30;
function initDemographics(){
	d3.csv("../data/demographics.csv.csv", function(error, data){
		dataOrig = d3.nest()
			.key(function(d){ return d.country})
			.map(data);
        var container = d3.select(".l-box.demographics:not(.full)");
        var typeOfCountry = "origin";
		initPyramid(dataOrig, container, typeOfCountry);
	})

    d3.csv("../data/demographics_host.csv", function(error, data){
        dataHost = d3.nest()
            .key(function(d){ return d.country})
            .map(data);
        var container = d3.select(".l-box.demographics:not(.full)");
        var typeOfCountry = "host";
        initPyramid(dataHost, container, typeOfCountry);
    })

	function initPyramid(data, container, typeOfCountry){
		var bisectDate = d3.bisector(function(d) { return d.age; }).left;
        var margin = {top: 20, right: 10, bottom: 20, left: 10},
            width = $(".l-box.demographics:not(.full)").width() - margin.left - margin.right,
            height = 305 - margin.top - margin.bottom;

        container.append("div").attr("class", "titleYel").html(function(){ return typeOfCountry == "origin" ? "Demographics of asylum seekers in the host country, 2016" : "Host country demographics 2016";}).style("margin-top", "0");
        
       	//------------ COUNTRIES LIST SELECTION --------------//
        if(typeOfCountry == "host"){
            container.append("select").attr("id", "country").attr("class", "select-ctrl").attr("name", "country");
            populateCountries("country");
            var e = document.getElementById("country");
            
            $( "select" )
              .change(function () {
                var selectedCountry = e.options[e.selectedIndex].text;
                updateArea(selectedCountry);
              });
        }

		var country = "Austria";

        var svg = container.classed("full", true)
          .append("svg")
            .attr("id", typeOfCountry)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var yLeft = d3.scale.ordinal()
            .domain(data[country].map(function(d) { return d.age; }))
            .rangeRoundBands([height, 0], .5);

        var yLeftAxis = d3.svg.axis()
            .scale(yLeft)
            .orient("right");

        svg.append("g")
            .attr("class", "y axis demographics")
            .attr("transform", "translate(" + width/2 + ", 0)")
            .style("text-anchor", "middle")
            .call(yLeftAxis);

        svg.append("text")
            .attr("x", 0)
            .attr("y", 10)
            .style("font-family", "zona_probold")
            .style("fill", "#666")
            .text("Males");

        svg.append("text")
            .attr("x", width-50)
            .attr("y", 10)
            .style("font-family", "zona_probold")
            .style("fill", "#666")
            .text("Females");

        svg.append("text")
            .attr("x", width/1.9)
            .attr("y", 10)
            .style("font-family", "zona_probold")
            .style("fill", "#666")
            .text("Age")
            .style("text-anchor", "middle");

        var yRight = d3.scale.ordinal()
            .domain(data[country].map(function(d) { return d.age; }))
            .rangeRoundBands([height, 0], .5);

        var yRightAxis = d3.svg.axis()
            .scale(yRight)
            .orient("right")
            .tickFormat("");

        var gAxis = d3.select(".y.axis.demographics").node().getBBox();

        var xLeft = d3.scale.linear()
            .domain([0, d3.max(data[country], function(d) { return +d.male; })])
            .range([(width/2)-(gAxis.width/2), 0]);

        var xLeftAxis = d3.svg.axis()
            .scale(xLeft)
            .ticks(2)
            .orient("bottom")
            .tickFormat(function(d) { return forma(d).replace(/G/, 'bn'); })
            .outerTickSize(0);

        var xRight = d3.scale.linear()
            .domain([0, d3.max(data[country], function(d) { return +d.male; })])
            .range([(width/2)+(gAxis.width), width]);

        var xRightAxis = d3.svg.axis()
            .scale(xRight)
            .ticks(2)
            .orient("bottom")
            .tickFormat(function(d) { return forma(d).replace(/G/, 'bn'); })
            .outerTickSize(0);


        svg.selectAll("demBarLeft")
            .data(data[country])
            .enter().append("rect")
            .attr("class", function(d){ return "left demBar" + d.age.substring(1);})
            .attr("x", function(d){ return xLeft(d.male); })
            .attr("y", function(d){ return yLeft(d.age); })
            .attr("width", function(d){ return xLeft(0) - xLeft(d.male);})
            .attr("height", barHeight);

        svg.selectAll("demBarRight")
            .data(data[country])
            .enter().append("rect")
            .attr("class", function(d){ return "right demBar" + d.age.substring(1);})
            .attr("x", function(d){ return xRight(0); })
            .attr("y", function(d){ return yRight(d.age); })
            .attr("width", function(d){ return xRight(d.female) - xRight(0);})
            .attr("height", barHeight);


        svg.selectAll("texts")
            .data(data[country])
          .enter().append("text")
            .attr("class", "num")
            .text(function(d){ return format(d.male); })
            .attr("x", function(d){ return xLeft(d.male) == 0 ? xLeft(d.male) + 12 : xLeft(d.male) - 6; })
            .attr("text-anchor", function(d){ return xLeft(d.male) == 0 ? "start" : "end"; })
            .attr("y", function(d){ return yLeft(d.age) + barHeight/2 + 2; });

        svg.selectAll("textsF")
            .data(data[country])
          .enter().append("text")
            .attr("class", "numFem")
            .text(function(d){ return format(d.female); })
            .attr("y", function(d){ return yLeft(d.age) + barHeight/2 + 2; })
            .attr("x", function(d){ return xRight(d.female) > width -30 ? xRight(d.female) - 12 : xRight(d.female) + 6; })
            .attr("text-anchor", function(d){ return xRight(d.female) > width -30 ? "end" : "start";});

        svg.append("g")
            .attr("class", "x axis demoL")
            .attr("transform", "translate(0," + height + ")")
            .call(xLeftAxis);

        svg.append("g")
            .attr("class", "x axis demoR")
            .attr("transform", "translate(0," + height + ")")
            .call(xRightAxis);

		function updateArea(cntry){
	        //ORIGIN
            yLeft.domain(dataOrig[cntry].map(function(d) { return d.age; }));
            yRight.domain(dataOrig[cntry].map(function(d) { return d.age; }));
            xLeft.domain([0, d3.max(dataOrig[cntry], function(d) { return +d.male; })]);
            xRight.domain([0, d3.max(dataOrig[cntry], function(d) { return +d.male; })]);

            d3.select("#origin").select("g.y.axis.demographics").call(yLeftAxis);
            d3.select("#origin").selectAll(".left")
                .data(dataOrig[cntry])
                .transition().duration(300)
                .attr("x", function(d){ return xLeft(d.male); })
                .attr("width", function(d){ return xLeft(0) - xLeft(d.male);});

            d3.select("#origin").selectAll(".right")
                .data(dataOrig[cntry])
                .transition().duration(300)
                .attr("width", function(d){ return xRight(d.female) - xRight(0);});

            d3.select("#origin").select(".x.axis.demoL").call(xLeftAxis);
            d3.select("#origin").select(".x.axis.demoR").call(xRightAxis);
            d3.select("#origin").selectAll(".num")
                .data(dataOrig[cntry])
                .text(function(d){ return format(d.male); })
                .attr("text-anchor", function(d){ return xLeft(d.male) == 0 ? "start" : "end"; })
                .transition().duration(300)
                .attr("x", function(d){ return xLeft(d.male) == 0 ? xLeft(d.male) + 12 : xLeft(d.male) - 6; });
                

            d3.select("#origin").selectAll(".numFem")
                .data(dataOrig[cntry])
                .text(function(d){ return format(d.female); })
                .transition().duration(300)
                .attr("x", function(d){ return xRight(d.female) > width -30 ? xRight(d.female) - 12 : xRight(d.female) + 6; })
                .attr("text-anchor", function(d){ return xRight(d.female) > width -30 ? "end" : "start";});

            //HOST
            yLeft.domain(dataHost[cntry].map(function(d) { return d.age; }));
            yRight.domain(dataHost[cntry].map(function(d) { return d.age; }));
            xLeft.domain([0, d3.max(dataHost[cntry], function(d) { return +d.male > +d.female ? +d.male : +d.female; })]);
            xRight.domain([0, d3.max(dataHost[cntry], function(d) { return +d.male > +d.female ? +d.male : +d.female; })]);

	        d3.select("#host").select("g.y.axis.demographics").call(yLeftAxis);

            d3.select("#host").selectAll(".left")
                .data(dataHost[cntry])
                .transition().duration(300)
                .attr("x", function(d){ return xLeft(d.male); })
                .attr("width", function(d){ return xLeft(0) - xLeft(d.male);});

            d3.select("#host").selectAll(".right")
                .data(dataHost[cntry])
                .transition().duration(300)
                .attr("width", function(d){ return xRight(d.female) - xRight(0);});

	        d3.select("#host").select(".x.axis.demoL").call(xLeftAxis);
	        d3.select("#host").select(".x.axis.demoR").call(xRightAxis);
            d3.select("#host").selectAll(".num")
                .data(dataHost[cntry])
                .text(function(d){ return format(d.male); })
                .transition().duration(300)
                .attr("x", function(d){ return xLeft(d.male) <= 30 ? xLeft(d.male) + 12 : xLeft(d.male) - 6; })
                .attr("text-anchor", function(d){ return xLeft(d.male) <= 30 ? "start" : "end"; });

            d3.select("#host").selectAll(".numFem")
                .data(dataHost[cntry])
                .text(function(d){ return format(d.female); })
                .transition().duration(300)
                .attr("x", function(d){ return xRight(d.female) > width -30 ? xRight(d.female) - 12 : xRight(d.female) + 6; })
                .attr("text-anchor", function(d){ return xRight(d.female) > width -30 ? "end" : "start";});
            country = cntry;
	   }

	      // console.log("infobox");
	      svg.append("rect")
	          .attr("class", "overlay")
	          .attr("width", width)
	          .attr("height", height)
	          .on("mouseout", function() { 
                d3.selectAll(".left").style("opacity", 1);
                d3.selectAll(".right").style("opacity", 1);
            })
	          .on("mousemove", mousemove)
	          .on("click", mousemove);


	      //focus.attr("transform", "translate(" + 1.5 + "," + y(3800000) + ")");
	      function mousemove() {
            country = $( "select#country" ).val();
            d3.selectAll(".left").style("opacity", 1);
            d3.selectAll(".right").style("opacity", 1);
            
            var xPos = d3.mouse(this)[1];
            var points = yLeft.range();
            var space = points[1]-points[0];
            var j;
            for(j=0; xPos < (points[j] + space/4); j++) {

            }

            var y0 = yLeft.domain()[j],
                i = bisectDate(data[country], y0, 1),
	            d0 = data[country][j],
	            d1 = data[country][j],
	            d = y0 - d0.age > d1.age - y0 ? d1 : d0;

            d3.selectAll(".demBar" + d.age.substring(1)).style("opacity", 0.5);

	      }
			
		}
}