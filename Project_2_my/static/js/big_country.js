Plotly.d3.csv('https://raw.githubusercontent.com/juzhangdata/test_project_2/master/DataSets/map_data.csv', function(err, rows){
    function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
    }

    var data = [{
        type: 'choropleth',
        locationmode: 'country names',
        locations: unpack(rows, 'country'),
        z: unpack(rows, '2012').map(Number),
        text: unpack(rows, 'country'),
        autocolorscale: false
    }];

    var layout = {
    title: '2012 Refugees',
    geo: {
        projection: {
            type: 'robinson'
        }
    }
    };

    Plotly.plot("map", data, layout, {showLink: false});
    console.log(unpack(rows, '2012'))

});