// Load json data
d3.json('data/output2.json').then(data => {
    let bubbles = new Bubbles({
        parentElement: '#vis',
    }, data)
    let brush = new Brush({
        parentElement: '#vis',
    }, data)
})


d3.csv('data/processed1.csv').then(data => {
    // Convert columns to numerical values
    data.forEach(d => {
        Object.keys(d).forEach((attr => {
            if (attr != 'Name' && attr != 'Platform' && attr != 'Genre' && attr != 'Publisher'
                && attr != 'Developer' && attr != 'Rating') {
                d[attr] = +d[attr];
            }
        }))
    });

    let processedData = preprocessData(data)

    let whiskerChart = new WhiskerChart({
        parentElement: '#vis',
    }, processedData)

    let radialPlot = new RadialPlot({
        parentElement: '#vis',
    }, processedData)

});
