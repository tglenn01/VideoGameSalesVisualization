// Load json data
d3.json('data/output2.json').then(data => {
    let bubbles = new Bubbles({
        parentElement: '#vis',
    }, data)
    let brush = new Brush({
        parentElement: '#vis',
    }, data)
})

d3.dsv(";", 'data/processed.csv').then(data => {

    // preprocess data
    let processedData = preprocessData(data)

    let whiskerChart = new WhiskerChart({
        parentElement: '#vis',
    }, processedData)

    // initialize
    let radialPlot = new RadialPlot({
        parentElement: '#vis',
    }, processedData)


});

// Todo: Turn developer into an array!
