// Load json data
d3.json("data/output2.json").then((_data) => {
  let bubbles = new Bubbles(
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
  // let barChart = new Barchart(
  //   {
  //     parentElement: "#barchart",
  //   },
  //   processedData
  // );
  // barChart.updateVis();

  // scatterplot = new Scatterplot(
  //   {
  //     parentElement: "#scatterplot",
  //   },
  //   processedData,
  //   "Global_Sales"
  // );
  // scatterplot.updateVis();
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

// d3.selectAll(".legend-btn").on("click", function () {
//   d3.selectAll(".legend-btn").classed("inactive", true);
//   d3.select(this).classed("inactive", !d3.select(this).classed("inactive"));
//   let selectedGenre = d3.select(this).attr("data-genre");

//   // Update the selected genre in the scatterplot instance
//   scatterplot.selectedGenre = selectedGenre;

//   // Call updateVis to re-render the scatterplot with new color settings
//   scatterplot.updateVis();
// });

d3.selectAll(".legend-btn").on("click", function () {
  d3.selectAll(".legend-btn").classed("inactive", true);
  d3.select(this).classed("inactive", false);
  let selectedGenre = d3.select(this).attr("data-genre");

  // Update the selected genre and re-render each scatterplot
  Object.values(scatterplots).forEach((plot) => {
    plot.selectedGenre = selectedGenre;
    plot.updateVis();
  });
});

// d3.selectAll(".legend-btn").on("click", function () {
//   // Toggle 'inactive' class
//   d3.select(this).classed("inactive", !d3.select(this).classed("inactive"));

//   // Check which categories are active
//   let selectedGenres = [];
//   d3.selectAll(".legend-btn:not(.inactive)").each(function () {
//     selectedGenres.push(d3.select(this).attr("data-genre"));
//   });
//   // Filter data accordingly and update vis
//   scatterplot.data = data.filter((d) => {
//     return selectedGenres.includes(d.Genre);
//   });
//   scatterplot.updateVis();
// });

// Todo: Turn developer into an array!
