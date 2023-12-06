let data, bubbles, whiskers;
let output_genre_platform, output_genre_publisher, output_platform_genre;
let scatterplots = {};

// Load json data
d3.json("data/output_platform_genre.json").then((_data) => {
    output_platform_genre = _data;
  bubbles = new Bubbles(
    {
      parentElement: "#bubbles",
    },
    _data
  );
  let brush = new Brush(
    {
      parentElement: "#brush",
    },
    _data,
    bubbles,
    scatterplots
  );
});
d3.json("data/output_genre_platform.json").then((_data) => {
  output_genre_platform = _data;
})
d3.json("data/output_genre_publisher.json").then((_data) => {
  output_genre_publisher = _data;
})


// Load csv and initiate the Sales charts and Whisker Chart
d3.csv("data/video_game_data.csv").then((_data) => {
  let processedData = preprocessData(_data);

  whiskers = new WhiskerChart(
    {
      parentElement: "#whisker",
    },
    processedData
  );


  const salesMetrics = [
    "Global_Sales",
    "NA_Sales",
    "EU_Sales",
    "JP_Sales",
    "Other_Sales",
  ];

  // Create multiple scatterplot instances
  salesMetrics.forEach((metric) => {
    scatterplots[metric] = new Scatterplot(
        {
          parentElement: `#scatterplot-${metric}`,
        },
        processedData,
        metric
    );
    scatterplots[metric].updateVis();
  });


  whiskers.initVis();
});

// initialize the Legend
initLegend();

// Select Button for bubbles dataset
d3.select('#bubbles-input').on('change', function() {
  // Get selected dataset
  const selection = d3.select(this).property('value');

  // Get correct dataset
  switch(selection) {
    case "genrePlatform":
      bubbles.data = output_genre_platform;
      bubbles.genrePlatformDatasetSelected = true;
      break;
    case "genrePublisher":
      bubbles.data = output_genre_publisher;
      bubbles.genrePlatformDatasetSelected = false;
      break;
    case "platformGenre":
      bubbles.data = output_platform_genre;
      bubbles.genrePlatformDatasetSelected = false;
      break;
  }
  bubbles.updateVis();
})

d3.selectAll('.reset-filter-btn').on("click", function () {
    toggleGenresOff();
})


function toggleGenresOff() {
  console.log('Resetting All Genres');

  resetLegend();

  bubbles.toggleAllGenresOn();
  whiskers.toggleAllGenresOn();

  resetScatterPlots()
}
