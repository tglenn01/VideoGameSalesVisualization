d3.csv('data/video_game_sales.csv').then(data => {

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