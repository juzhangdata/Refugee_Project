Plotly.d3.csv('https://raw.githubusercontent.com/ArunaNaripeddy/project2-test/master/raw_data/total.csv', function(err, rows){
  function unpack(rows, key) {
    return rows.map(function(row) { return row[key]; });
  }
  
  // var randomize = z => z.map(d => Math.pow(Math.random(), 2) * 30000);
  // var data = unpack(rows, 'total exports');
  var frames = [{
    data: [{z: unpack(rows, '2012')}],
    traces: [0],
    name: '2012',
    layout: {title: '1990 US Agriculture Exports by State'}
  }, {
    data: [{z: unpack(rows, '2013')}],
    traces: [0],
    name: '2013',
    layout: {title: '1995 US Agriculture Exports by State'}
  }, {
    data: [{z: unpack(rows, '2014')}],
    traces: [0],
    name: '2014',
    layout: {title: '2000 US Agriculture Exports by State'}
  }, {
    data: [{z: unpack(rows, '2015')}],
    traces: [0],
    name: '2015',
    layout: {title: '2005 US Agriculture Exports by State'}
  }]

  var data = [{
    type: 'choropleth',
    locationmode: 'country names',
    locations: unpack(rows, 'Country Code'),
    // z: unpack(rows, 'total exports'),
    text: unpack(rows, 'Country Name'),
    // zmin: 0,
    // zmax: 17000,
    // colorscale: [
    //   [0, 'rgb(242,240,247)'], [0.2, 'rgb(218,218,235)'],
    //   [0.4, 'rgb(188,189,220)'], [0.6, 'rgb(158,154,200)'],
    //   [0.8, 'rgb(117,107,177)'], [1, 'rgb(84,39,143)']
    // ],
    // colorbar: {
    //   title: 'Millions USD',
    //   // thickness: 0.2
    // },
   marker: {
      line:{
        color: 'rgb(255,255,255)',
        width: 2
      }
    } 
  }];


  var layout = {
    title: '1990 US Agriculture Exports by State',
    geo:{
      scope: 'europe',
      showlakes: true,
      lakecolor: 'rgb(255,255,255)'
    },
    xaxis: {autorange: false},
    yaxis: {autorange: false},
    sliders: [{
      currentvalue: {
        prefix: 'Year: ',
      },
      steps: frames.map(f => ({
        label: f.name,
        method: 'animate',
        args: [[f.name], {frame: {duration: 0}}]
      }))
    }]
  };

  Plotly.plot('graph', {
    data: data,
    layout: layout,
    frames: frames,
    config: {showLink: false}
  });
});