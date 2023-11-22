d3.dsv(";", 'data/processed.csv').then(data => {

    // preprocess data
    let processedData = preprocessData(data)

    // initialize Bubbles
    let bubbles = new Bubbles({
        parentElement: '#vis',
    }, processedData)

    // initialize Whisker Chart
    let whiskerChart = new WhiskerChart({
        parentElement: '#vis',
    }, processedData)

    // initialize 
    let radialPlot = new RadialPlot({
        parentElement: '#vis',
    }, processedData)


});
