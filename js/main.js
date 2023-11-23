// Load json data
d3.json("data/output2.json").then((data) => {
  let bubbles = new Bubbles(
    {
      parentElement: "#bubbles",
    },
    data
  );
  let brush = new Brush(
    {
      parentElement: "#brush",
    },
    data, bubbles
  );
});

d3.dsv(";", "data/processed.csv").then((_data) => {
  let processedData = preprocessData(_data);

  data = processedData;

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

// Todo: Turn developer into an array!
