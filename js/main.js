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
  let bubbles = new Bubbles(
    {
      parentElement: "#vis",
    },
    processedData
  );

  let whiskerChart = new WhiskerChart(
    {
      parentElement: "#vis",
    },
    processedData
  );

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
  let selectedDifficulty = [];
  d3.selectAll(".legend-btn:not(.inactive)").each(function () {
    selectedDifficulty.push(d3.select(this).attr("data-genre"));
  });
  // Filter data accordingly and update vis
  scatterplot.data = data.filter((d) => {
    return selectedDifficulty.includes(d.Genre);
  });
  scatterplot.updateVis();
});

// Todo: Turn developer into an array!
