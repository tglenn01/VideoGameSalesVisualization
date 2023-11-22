// Load json data
d3.json("data/output2.json").then((data) => {
  let bubbles = new Bubbles(
    {
      parentElement: "#vis",
    },
    data
  );
  let brush = new Brush(
    {
      parentElement: "#vis",
    },
    data
  );
});

let scatterplot, data;
d3.dsv(";", "data/processed.csv").then((data) => {
  let processedData = preprocessData(data);

  data = processedData;

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
