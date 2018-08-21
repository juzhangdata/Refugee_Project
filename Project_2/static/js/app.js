function buildCharts(year) {

  // @TODO: Use `d3.json` to fetch the year data for the plots
  d3.json(`/origin/${year}`).then(success1)

  function success1(data){
    var trace1 = {
      x: data["origin"].slice(0,10),
      y: data["refugees"].slice(0,10),
      type: "bar"
    };

    var data = [trace1];

    var layout = {
      title: year + " Refugees: Top Countries of Origin",
      showlegend: false
    };

    Plotly.newPlot("bar1", data, layout);
  }


  // @TODO: Use `d3.json` to fetch the year data for the plots
  d3.json(`/target/${year}`).then(success2)

  function success2(data){
    var trace1 = {
      x: data["target"].slice(0,10),
      y: data["refugees"].slice(0,10),
      type: "bar"
    };

    var data = [trace1];

    var layout = {
      title: year + " Refugees: Top Countries of Target",
      showlegend: false
    };

    Plotly.newPlot("bar2", data, layout);
  }

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of year names to populate the select options
  var yearNames = ["2012", "2013", "2014", "2015", "2016"]

  yearNames.forEach((year) => {
    selector
      .append("option")
      .text(year)
      .property("value", year);
  });

  // Use the first year from the list to build the initial plots
  const firstyear = yearNames[0];
  buildCharts(firstyear)
}

function optionChanged(newyear) {
  // Fetch new data each time a new year is selected
  buildCharts(newyear)
}

// Initialize the dashboard
init();
