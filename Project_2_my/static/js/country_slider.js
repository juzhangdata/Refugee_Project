Plotly.d3.csv('https://raw.githubusercontent.com/juzhangdata/test_project_2/master/DataSets/influx.csv', function(err, rows){
  function unpack(rows, key) {
    return rows.map(function(row) { return row[key]; });
  }
  
  var randomize = z => z.map(d => Math.pow(Math.random(), 2) * 30000);

  var data = [{
          type: 'choropleth',
          locations: unpack(rows, 'code'),
          z: unpack(rows, '2012').map(Number),
          text: unpack(rows, 'country'),
          colorscale: [
              [0,'rgb(5, 10, 172)'],[0.35,'rgb(40, 60, 190)'],
              [0.5,'rgb(70, 100, 245)'], [0.6,'rgb(90, 120, 245)'],
              [0.7,'rgb(106, 137, 247)'],[1,'rgb(220, 220, 220)']],
          autocolorscale: false,
          reversescale: true,
          marker: {
              line: {
                  color: 'rgb(180,180,180)',
                  width: 0.5
              }
          },
          tick0: 0,
          zmin: 0,
          dtick: 1000,
          colorbar: {
              autotic: false,
              tickprefix: '',
              title: 'Refugees'
          }
  }];

  var frames = [{
    data: [{z: unpack(rows, '2012').map(Number)}],
    traces: [0],
    name: '2012',
    layout: {title: 'Refugees Influx by Country 2012'}
  }, {
    data: [{z: unpack(rows, '2013')}],
    traces: [0],
    name: '2013',
    layout: {title: 'Refugees Influx by Country 2013'}
  }, {
    data: [{z: unpack(rows, '2014')}],
    traces: [0],
    name: '2014',
    layout: {title: 'Refugees Influx by Country 2014'}
  }, {
    data: [{z: unpack(rows, '2015')}],
    traces: [0],
    name: '2015',
    layout: {title: 'Refugees Influx by Country 2015'}
  }, {
    data: [{z: unpack(rows, '2016')}],
    traces: [0],
    name: '2016',
    layout: {title: 'Refugees Influx by Country 2016'}
  }
]

  var layout = {
    title: 'Refugees Influx by Country 2012',
    geo:{
      showframe: false,
      showcoastlines: false,
      projection:{
          type: 'mercator'
      }
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

  Plotly.plot('map', {
    data: data,
    layout: layout,
    frames: frames,
    config: {showLink: false}
  });
  
});