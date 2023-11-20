d3.csv('data/video_game_sales.csv').then(data => {
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


    let bubbles = new Bubbles({
        parentElement: '#vis',
    }, processedData)

    let whiskerChart = new WhiskerChart({
        parentElement: '#vis',
    }, processedData)

    let radialPlot = new RadialPlot({
        parentElement: '#vis',
    }, processedData)


});

// Todo: Turn developer into an array!
