// Load output_genre_platform.json
let output_genre_platform, output_genre_publisher, output_platform_genre
let bubbles;
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
    bubbles
  );
});
d3.json("data/output_genre_platform.json").then((_data) => {
  output_genre_platform = _data;
})
d3.json("data/output_genre_publisher.json").then((_data) => {
  output_genre_publisher = _data;
})

d3.dsv(";", "data/processed.csv").then((_data) => {
  let processedData = preprocessData(_data);

  let whiskerChart = new WhiskerChart(
    {
      parentElement: "#whisker",
    },
    processedData
  );
  whiskerChart.initVis();
});

let scatterplot, data;
d3.csv("data/processed2.csv").then((_data) => {
  // Convert columns to numerical values
  data = _data;
  data.forEach((d) => {
    Object.keys(d).forEach((attr) => {
      if (
        attr != "Name" &&
        attr != "Platform" &&
        attr != "Genre" &&
        attr != "Publisher" &&
        attr != "Developer" &&
        attr != "Rating"
      ) {
        d[attr] = +d[attr];
      }
    });
  });

  let processedData = data;
  let barChart = new Barchart(
    {
      parentElement: "#barchart",
    },
    processedData
  );
  barChart.updateVis();
  scatterplot = new Scatterplot(
    {
      parentElement: "#scatterplot",
    },
    processedData
  );
  scatterplot.updateVis();
});

d3.selectAll(".legend-btn").on("click", function () {
  // Toggle 'inactive' class
  d3.select(this).classed("inactive", !d3.select(this).classed("inactive"));

  // Check which categories are active
  let selectedGenres = [];
  d3.selectAll(".legend-btn:not(.inactive)").each(function () {
    selectedGenres.push(d3.select(this).attr("data-genre"));
  });
  // Filter data accordingly and update vis
  scatterplot.data = data.filter((d) => {
    return selectedGenres.includes(d.Genre);
  });
  scatterplot.updateVis();
});

// Select Button for bubbles dataset
d3.select('#bubbles-input').on('change', function() {
  // Get selected dataset
  const selection = d3.select(this).property('value');

  // Get correct dataset
  switch(selection) {
    case "genrePlatform":
      bubbles.data = output_genre_platform;
      break;
    case "genrePublisher":
      bubbles.data = output_genre_publisher;
      break;
    case "platformGenre":
      bubbles.data = output_platform_genre;
      break;
  }
  bubbles.updateVis();
})
