class Scatterplot {
  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data, _salesMetric) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 600,
      containerHeight: _config.containerHeight || 400,
      margin: _config.margin || { top: 25, right: 20, bottom: 20, left: 35 },
      tooltipPadding: _config.tooltipPadding || 15,
    };
    this.data = _data.map((d) => {
      // Ensure Critic_Score and User_Score are numbers
      let criticScore = +d.Critic_Score;
      let userScore = +d.User_Score * 10;

      // Calculate the average; handle potential division by zero or undefined scores
      let averageScore = (criticScore + userScore) / 2;
      if (isNaN(averageScore)) {
        averageScore = criticScore || userScore || 0; // Default to one score or zero if both are unavailable
      }

      return { ...d, Average_Score: averageScore };
    });
    this.selectedGenre = null;
    this.salesMetric = _salesMetric;
    this.initVis();
  }

  /**
   * We initialize scales/axes and append static elements, such as axis titles.
   */
  initVis() {
    let vis = this;

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width =
      vis.config.containerWidth -
      vis.config.margin.left -
      vis.config.margin.right;
    vis.height =
      vis.config.containerHeight -
      vis.config.margin.top -
      vis.config.margin.bottom;

    // Initialize scales
    vis.colorScale = d3
      .scaleOrdinal()
      .range([
        "#ff0000", // red for Puzzle
        "#2f4f4f", // darkslategray for Action
        "#00ffff", // aqua for Shooter
        "#ffff00", // yellow for Racing
        "#eee8aa", // palegoldenrod for Strategy
        "#ff69b4", // hotpink for Misc
        "#000080", // navy for Platformer
        "#00ff00", // lime for Role-Playing
        "#1e90ff", // dodgerblue for Sports
        "#008000", // green for Fighting
        "#8b4513", // saddlebrown for Adventure
        "#ff00ff", // fuchsia for Simulation
      ])
      .domain([
        "Puzzle",
        "Action",
        "Shooter",
        "Racing",
        "Strategy",
        "Misc",
        "Platformer",
        "Role-Playing",
        "Sports",
        "Fighting",
        "Adventure",
        "Simulation",
      ]);

    vis.xScale = d3.scaleLinear().range([0, vis.width]);

    vis.yScale = d3.scaleLog().range([vis.height, 0]).clamp(true);

    // Initialize axes
    vis.xAxis = d3
      .axisBottom(vis.xScale)
      .ticks(10)
      .tickSize(-vis.height - 10)
      .tickPadding(10);

    vis.yAxis = d3
      .axisLeft(vis.yScale)
      .ticks(6)
      .tickSize(-vis.width - 10)
      .tickPadding(10);

    // Define size of SVG drawing area
    vis.svg = d3
      .select(vis.config.parentElement)
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

    // Append group element that will contain our actual chart
    // and position it according to the given margin config
    vis.chart = vis.svg
      .append("g")
      .attr(
        "transform",
        `translate(${vis.config.margin.left},${vis.config.margin.top})`
      );

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart
      .append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0,${vis.height})`);

    // Append y-axis group
    vis.yAxisG = vis.chart.append("g").attr("class", "axis y-axis");

    // Append both axis titles
    vis.chart
      .append("text")
      .attr("class", "axis-title")
      .attr("y", vis.height + 8)
      .attr("x", vis.width + 20)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Average Score");

    vis.svg
      .append("text")
      .attr("class", "axis-title")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", ".71em")
      .text(vis.salesMetric);
  }

  /**
   * Prepare the data and scales before we render it.
   */
  updateVis() {
    let vis = this;

    // Specificy accessor functions
    vis.colorValue = (d) => d.Genre;
    vis.xValue = (d) => d.Average_Score;
    vis.yValue = (d) => d[vis.salesMetric];

    // Set the scale input domains
    vis.xScale.domain([0, d3.max(vis.data, vis.xValue)]);
    const minYValue =
      d3.min(vis.data, vis.yValue) > 0 ? d3.min(vis.data, vis.yValue) : 1;
    vis.yScale.domain([minYValue, d3.max(vis.data, vis.yValue)]);

    vis.renderVis();
  }

  /**
   * Bind data to visual elements.
   */
  renderVis() {
    let vis = this;

    // Add or update circles
    const circles = vis.chart
      .selectAll(".point")
      .data(vis.data, (d) => d.Name)
      .join("circle")
      .attr("class", "point")
      .attr("r", 4)
      .attr("cy", (d) => vis.yScale(vis.yValue(d)))
      .attr("cx", (d) => vis.xScale(vis.xValue(d)))
      .attr("fill", (d) => {
        return vis.selectedGenre !== null && d.Genre === vis.selectedGenre
          ? vis.colorScale(d.Genre)
          : "#d3d3d3";
      })
      .style("opacity", 0.3);
    // .attr("fill", (d) => vis.colorScale(vis.colorValue(d)));

    // Tooltip event listeners
    circles
      .on("mouseover", (event, d) => {
        d3
          .select("#tooltip")
          .style("opacity", 1)
          .style("left", event.pageX + vis.config.tooltipPadding + "px")
          .style("top", event.pageY + vis.config.tooltipPadding + "px").html(`
                <div class="tooltip-title">${d.Genre}</div>
                <div><i>${d.Name}</i></div>
                <ul>
                  <li>User Score: ${d.User_Score}</li>
                  <li>Critic Score: ${d.Critic_Score}</li>
                  <li>Global Sales: ${d.Global_Sales} Million</li>
                  <li>North America Sales: ${d.NA_Sales} Million</li>
                  <li>European Union Sales: ${d.EU_Sales} Million</li>
                  <li>Japan Sales: ${d.JP_Sales} Million</li>
                  <li>Other Sales: ${d.Other_Sales} Million</li>
                </ul>
              `);
      })
      .on("mouseleave", () => {
        d3.select("#tooltip").style("opacity", 0);
      });

    // Update the axes/gridlines
    // We use the second .call() to remove the axis and just show gridlines
    vis.xAxisG.call(vis.xAxis).call((g) => g.select(".domain").remove());

    vis.yAxisG.call(vis.yAxis).call((g) => g.select(".domain").remove());

  }
}
