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

        // Initialize axes
        vis.xAxisFocus = d3.axisBottom(vis.xScaleFocus).tickSizeOuter(0);
        vis.xAxisContext = d3.axisBottom(vis.xScaleContext).tickSizeOuter(0);
        vis.yAxisFocus = d3.axisLeft(vis.yScaleFocus);

        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.width)
            .attr('height', vis.height);

        // Append focus group with x- and y-axes
        vis.focus = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        vis.focus.append('defs').append('clipPath')
            .attr('id', 'clip')
            .append('rect')
            .attr('width', vis.config.width)
            .attr('height', vis.config.height);

        vis.xAxisFocusG = vis.focus.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.config.height})`);

        vis.yAxisFocusG = vis.focus.append('g')
            .attr('class', 'axis y-axis');

        // Append context group with x- and y-axes
        vis.context = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.contextMargin.left},${vis.config.contextMargin.top})`);

        vis.contextAreaPath = vis.context.append('path')
            .attr('class', 'chart-area');

        vis.xAxisContextG = vis.context.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.config.contextHeight})`);

        vis.brushG = vis.context.append('g')
            .attr('class', 'brush x-brush');


        // Initialize brush component
        vis.brush = d3.brushX()
            .extent([[0, 0], [vis.config.width, vis.config.contextHeight]])
            .on('brush', function({selection}) {
                if (selection) vis.brushed(selection);
            })
            .on('end', function({selection}) {
                if (!selection) vis.brushed(null);
            });

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.xValue = d => d.date;
        vis.yValue = d => d.close;

        // Initialize area generators

        vis.area = d3.area()
            .x(d => vis.xScaleContext(vis.xValue(d)))
            .y1(d => vis.yScaleContext(vis.yValue(d)))
            .y0(vis.config.contextHeight);

        // Set the scale input domains
        vis.xScaleFocus.domain([1985, 2016]);
        vis.xScaleContext.domain(vis.xScaleFocus.domain());

        vis.bisectDate = d3.bisector(vis.xValue).left;

        vis.renderVis();
    }


    renderVis() {
        let vis = this;

        vis.contextAreaPath
            .datum(vis.data)
            .attr('d', vis.area);

        // Update the axes
        vis.xAxisFocusG.call(vis.xAxisFocus);
        vis.yAxisFocusG.call(vis.yAxisFocus);
        vis.xAxisContextG.call(vis.xAxisContext);

        // Update the brush and define a default position
        const defaultBrushSelection = [vis.xScaleFocus(new Date('2019-01-01')), vis.xScaleContext.range()[1]];
        vis.brushG
            .call(vis.brush)
            .call(vis.brush.move, defaultBrushSelection);
    }

    /**
     * React to brush events
     */
    brushed(selection) {
        let vis = this;

        // Check if the brush is still active or if it has been removed
        if (selection) {
            // Convert given pixel coordinates (range: [x0,x1]) into a time period (domain: [Date, Date])
            const selectedDomain = selection.map(vis.xScaleContext.invert, vis.xScaleContext);

            // Update x-scale of the focus view accordingly
            vis.xScaleFocus.domain(selectedDomain);
        } else {
            // Reset x-scale of the focus view (full time period)
            vis.xScaleFocus.domain(vis.xScaleContext.domain());
        }

        // Redraw line and update x-axis labels in focus view
        vis.focusLinePath.attr('d', vis.line);
        vis.xAxisFocusG.call(vis.xAxisFocus);
    }
}
