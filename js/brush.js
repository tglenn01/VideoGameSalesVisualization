class Brush {
  constructor(_config, _data, bubbles, scatterplots) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 500,
      containerHeight: 60,
      contextHeight: 60,
      margin: { top: 30, right: 10, bottom: 10, left: 10 },
      contextMargin: { top: 200, right: 20, bottom: 10, left: 10 },
    };
    this.data = _data;
    this.bubbles = bubbles;
    this.scatterplots = scatterplots;
    this.initVis();
  }

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

    vis.xScaleFocus = d3.scaleTime().range([vis.config.margin.left, vis.width]);
    vis.xScaleContext = d3
      .scaleTime()
      .range([vis.config.margin.left, vis.width]);
    vis.yScaleContext = d3
      .scaleLinear()
      .range([vis.config.contextHeight, 0])
      .nice();

    vis.xScaleFocus.domain([new Date("1985-01-01"), new Date("2016-01-02")]);
    vis.xScaleContext.domain(vis.xScaleFocus.domain());

    // Initialize axes
    vis.xAxisFocus = d3.axisBottom(vis.xScaleFocus).ticks(0);
    vis.xAxisContext = d3.axisBottom(vis.xScaleContext).ticks(5);
    vis.yAxisFocus = d3.axisLeft(vis.yScaleFocus).ticks(0);

        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // Define and add brush and add listener if brushed
        vis.brush = d3.brushX()
            .extent([[vis.config.margin.left, 0], [vis.config.containerWidth - vis.config.margin.right, vis.config.containerHeight - vis.config.margin.bottom]])
            //.extent([[vis.config.margin.left, 0], [vis.width, vis.config.contextHeight]])
            .on("end", brushed);

    vis.svg
      .append("g")
      .call(vis.brush)
      .call(
        vis.brush.move,
        [new Date("2000-01-01"), new Date("2016-01-02")].map(this.xScaleContext)
      );

    vis.svg.append("g").call(vis.xAxisContext);

    function brushed({ selection }) {
      d3.select(this).call(brushHandle, selection);
    }

        vis.arc = d3.arc()
            .innerRadius(0)
            .outerRadius((vis.config.contextHeight - vis.config.margin.top - vis.config.margin.bottom) / 2)
            .startAngle(0)
            .endAngle((d, i) => i ? Math.PI : -Math.PI)

        // Adds brush handle and its listeners.
        function brushHandle(g, selection) {
            g.selectAll(".handle--custom")
                .data([{type: "w"}, {type: "e"}])
                .join(
                    enter => enter.append("path")
                        .attr("class", "handle--custom")
                        .attr("fill", "#666")
                        .attr("fill-opacity", 0.8)
                        .attr("stroke", "#000")
                        .attr("stroke-width", 1.5)
                        .attr("cursor", "ew-resize")
                        .attr("d", vis.arc)
                )
                .attr("display", selection === null ? "none" : null)
                .attr("transform", selection === null ? null : (d, i) => `translate(${selection[i]},${(vis.config.contextHeight + vis.config.margin.top - vis.config.margin.bottom) / 2})`);

      vis.updateSelection(selection.map(vis.xScaleContext.invert));
    }

    vis.updateVis();
  }

  updateVis() {
    let vis = this;

    vis.renderVis();
  }

  renderVis() {
    let vis = this;

    // Update the brush and define a default position
    const defaultBrushSelection = [
      vis.xScaleFocus(new Date("2019-01-01")),
      vis.xScaleContext.range()[1],
    ];
  }

  updateSelection(selection) {
    let vis = this;
    vis.bubbles.updateSelection(selection);

    const salesMetrics = [
      "Global_Sales",
      "NA_Sales",
      "EU_Sales",
      "JP_Sales",
      "Other_Sales",
    ]
    salesMetrics.forEach((metric) => {
      vis.scatterplots[metric].updateSelection(selection);
    });
  }
}
