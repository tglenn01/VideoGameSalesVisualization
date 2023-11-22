class Brush {

    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            width:  800,
            height: 240,
            contextHeight: 50,
            margin: {top: 10, right: 10, bottom: 100, left: 45},
            contextMargin: {top: 280, right: 10, bottom: 20, left: 45}
        }
        this.data = _data;
        this.initVis();
    }

    initVis() {
        let vis = this;
        // Calculate inner chart size. Margin specifies the space around the actual chart.
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.xScaleFocus = d3.scaleTime()
            .range([0, vis.config.width]);

        vis.xScaleContext = d3.scaleTime()
            .range([0, vis.config.width]);

        vis.yScaleContext = d3.scaleLinear()
            .range([vis.config.contextHeight, 0])
            .nice();

        vis.xScaleFocus.domain([new Date('1985-01-01'), new Date('2016-01-01')]);
        vis.xScaleContext.domain(vis.xScaleFocus.domain());

        // Initialize axes
        vis.xAxisFocus = d3.axisBottom(vis.xScaleFocus).ticks(0);
        vis.xAxisContext = d3.axisBottom(vis.xScaleContext).ticks(5);
        vis.yAxisFocus = d3.axisLeft(vis.yScaleFocus).ticks(0);

        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement).append("svg")
            .attr('width', vis.width)
            .attr('height', vis.height);

        vis.brush = d3.brushX()
            .extent([[vis.config.margin.left, vis.config.margin.top], [vis.width, vis.config.contextHeight]])
            .on("start brush end", brushed);

        vis.svg.append("g")
            .call(vis.xAxisContext);

        vis.svg.append("g")
            .call(vis.brush)
            .call(vis.brush.move, [new Date('2000-01-01'), new Date('2016-01-01')].map(this.xScaleContext));

        function brushed({selection}) {
            d3.select(this).call(brushHandle, selection);
        }

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
                )
                .attr("display", selection === null ? "none" : null)
                .attr("transform", selection === null ? null : (d, i) => `translate(${selection[i]},${(vis.height + vis.config.margin.top - vis.config.margin.bottom) / 2})`)
        }

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.xValue = d => d.date;
        vis.yValue = d => d.close;

        // Initialize area generators

        vis.area = d3.area()
            .x(20)
            .y1(0)
            .y0(vis.config.contextHeight);

        vis.renderVis();
    }


    renderVis() {
        let vis = this;

        // Update the brush and define a default position
        const defaultBrushSelection = [vis.xScaleFocus(new Date('2019-01-01')), vis.xScaleContext.range()[1]];

    }

}