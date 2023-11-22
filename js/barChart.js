class Barchart {
  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
    // Configuration object with defaults
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 710,
      containerHeight: _config.containerHeight || 200,
      margin: _config.margin || { top: 10, right: 5, bottom: 25, left: 30 },
      reverseOrder: _config.reverseOrder || false,
      tooltipPadding: _config.tooltipPadding || 15,
    };
    this.data = _data;
    this.initVis();
  }

  /**
   * Initialize scales/axes and append static elements, such as axis titles
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

    // Initialize scales and axes
    // Important: we flip array elements in the y output range to position the rectangles correctly
    vis.yScale = d3.scaleLinear().range([vis.height, 0]);

    vis.xScale = d3.scaleBand().range([0, vis.width]).paddingInner(0.2);

    vis.xAxis = d3.axisBottom(vis.xScale).tickSizeOuter(0);

    vis.yAxis = d3.axisLeft(vis.yScale).ticks(6).tickSizeOuter(0); // Format y-axis ticks as millions

    // Define size of SVG drawing area
    vis.svg = d3
      .select(vis.config.parentElement)
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

    // SVG Group containing the actual chart; D3 margin convention
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
  }

  /**
   * Prepare data and scales before we render it
   */
  updateVis() {
    let vis = this;

    // Reverse column order depending on user selection
    // Group data by genre and find the maximum critic score for each genre
    vis.maxScoresPerGenre = Array.from(
      d3.group(vis.data, (d) => d.Genre),
      ([key, values]) => ({
        Genre: key,
        Max_Critic_Score: d3.max(values, (v) => v.Critic_Score),
        Max_User_Score: d3.max(values, (v) => v.User_Score),
      })
    );

    // Check for reverse order flag
    if (vis.config.reverseOrder) {
      vis.maxScoresPerGenre.reverse();
    }

    // Specificy x- and y-accessor functions
    vis.xValue = (d) => d.Genre;
    vis.yValueCritic = (d) => d.Max_Critic_Score;
    vis.yValueUser = (d) => d.Max_User_Score * 10;

    // Set the scale input domains
    vis.xScale.domain(vis.maxScoresPerGenre.map(vis.xValue));
    vis.yScale.domain([
      0,
      d3.max(vis.maxScoresPerGenre, (d) =>
        Math.max(d.Max_Critic_Score, d.Max_User_Score)
      ),
    ]);

    vis.subGroupScale = d3
      .scaleBand()
      .domain(["Critic", "User"])
      .rangeRound([0, vis.xScale.bandwidth()])
      .padding(0.05);

    vis.renderVis();
  }

  /**
   * Bind data to visual elements
   */
  renderVis() {
    let vis = this;

    vis.groups = vis.chart
      .selectAll(".group")
      .data(vis.maxScoresPerGenre)
      .join("g")
      .attr("class", "group")
      .attr("transform", (d) => `translate(${vis.xScale(vis.xValue(d))},0)`);

    // Add critic score bars
    let criticBars = vis.groups
      .selectAll(".bar.critic")
      .data((d) => [d])
      .join("rect")
      .attr("class", "bar critic")
      .style("fill", "steelblue")
      .attr("x", (d) => vis.subGroupScale("Critic"))
      .attr("y", (d) => vis.yScale(vis.yValueCritic(d)))
      .attr("width", vis.subGroupScale.bandwidth())
      .attr("height", (d) => vis.height - vis.yScale(vis.yValueCritic(d)));

    // Add user score bars
    let userBars = vis.groups
      .selectAll(".bar.user")
      .data((d) => [d])
      .join("rect")
      .attr("class", "bar user")
      .style("fill", "orange")
      .attr("x", (d) => vis.subGroupScale("User"))
      .attr("y", (d) => vis.yScale(vis.yValueUser(d)))
      .attr("width", vis.subGroupScale.bandwidth())
      .attr("height", (d) => vis.height - vis.yScale(vis.yValueUser(d)));

    // Add rectangles
    // let bars = vis.chart
    //   .selectAll(".bar")
    //   .data(vis.maxScoresPerGenre, vis.xValue)
    //   .join("rect");

    // bars
    //   .style("opacity", 0.5)
    //   .transition()
    //   .duration(1000)
    //   .style("opacity", 1)
    //   .attr("class", "bar critic")
    //   .attr("x", (d) => vis.xScale(vis.xValue(d)))
    //   .attr("width", vis.xScale.bandwidth())
    //   .attr("height", (d) => vis.height - vis.yScale(vis.yValueCritic(d)))
    //   .attr("y", (d) => vis.yScale(vis.yValueCritic(d)));

    // Tooltip event listeners
    criticBars
      .on("mouseover", (event, d) => {
        d3.select("#tooltip")
          .style("opacity", 1)
          // Format number with million and thousand separator
          .html(
            `<div class="tooltip-label">Critic Score</div>${d3.format(",")(
              d.Max_Critic_Score
            )}`
          );
      })
      .on("mousemove", (event) => {
        d3.select("#tooltip")
          .style("left", event.pageX + vis.config.tooltipPadding + "px")
          .style("top", event.pageY + vis.config.tooltipPadding + "px");
      })
      .on("mouseleave", () => {
        d3.select("#tooltip").style("opacity", 0);
      });

    userBars
      .on("mouseover", (event, d) => {
        d3.select("#tooltip")
          .style("opacity", 1)
          // Format number with million and thousand separator
          .html(
            `<div class="tooltip-label">User Score</div>${d3.format(",")(
              d.Max_User_Score * 10
            )}`
          );
      })
      .on("mousemove", (event) => {
        d3.select("#tooltip")
          .style("left", event.pageX + vis.config.tooltipPadding + "px")
          .style("top", event.pageY + vis.config.tooltipPadding + "px");
      })
      .on("mouseleave", () => {
        d3.select("#tooltip").style("opacity", 0);
      });

    // Update axes
    vis.xAxisG.transition().duration(1000).call(vis.xAxis);

    vis.yAxisG.call(vis.yAxis);
  }
}
