class Brush {

    // TODO set borders/margins
    constructor(_config, data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: 700,
            containerHeight: 700,
            margin: {
                top: 30,
                right: 30,
                bottom: 30,
                left: 30
            },
            tooltipPadding: _config.tooltipPadding || 15

        }
        this.data = data;
        this.initVis();
    }


    initVis() {
        let vis = this;
        // Calculate inner chart size. Margin specifies the space around the actual chart.
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // Initialize scales
        vis.colorScale = d3.scaleLinear()
            .domain([0, 5])
            .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
            .interpolate(d3.interpolateHcl);

        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement).append('svg')
            .attr("viewBox", `-${vis.config.containerWidth / 2} -${vis.config.containerHeight / 2}
            ${vis.config.containerWidth} ${vis.config.containerHeight}`)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight)
            .attr('id', "bubbles");

        // Todo: Append Axis title

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.renderVis();
    }


    renderVis() {
        const brush = d3.brushX()
            .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
            .on("start brush end", brushed);
    }

}
