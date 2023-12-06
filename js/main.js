let scatterplot, data, bubbles, whiskers;
let output_genre_platform, output_genre_publisher, output_platform_genre;

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

  whiskers = new WhiskerChart(
    {
      parentElement: "#whisker",
    },
    processedData
  );
  whiskers.initVis();
});

let scatterplots = {};
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
});

d3.selectAll(".legend-btn").on("click", function () {
  d3.selectAll(".legend-btn").classed("inactive", true);
  d3.select(this).classed("inactive", false);
  let selectedGenre = d3.select(this).attr("data-genre");

  // Update the selected genre and re-render each scatterplot
  Object.values(scatterplots).forEach((plot) => {
    plot.selectedGenre = selectedGenre;
    plot.updateVis();
  });

  bubbles.toggleGenre(selectedGenre);
  whiskers.toggleGenre(selectedGenre);
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

d3.selectAll('.reset-filter-btn').on("click", function () {
    toggleGenresOn();
})


function toggleGenresOn() {
  console.log('Resetting All Genres');
  genresToggleData.forEach((isOn, genre) => {
    if (!isOn) {
      bubbles.toggleGenre(genre)
      whiskers.toggleGenre(genre)
      scatterplot.toggleGenre(genre)
    }
    genresToggleData.set(genre, true)
  })
}
