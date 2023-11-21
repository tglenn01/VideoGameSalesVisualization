class Bubbles {

    // TODO set borders/margins
    constructor(_config, data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: 900,
            containerHeight:900,
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
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight)
            .attr('id', "bubbles");

        // Append group element that will contain our actual chart
        // and position it according to the given margin config
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        // Todo: Append Axis title

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.renderVis();
    }


    renderVis() {
        let vis = this;

        // Create the pack layout.
        const pack = d3.pack()
            .size([vis.width, vis.height])
            .padding(3);

        // Compute the hierarchy from the JSON data; recursively sum the
        // values for each node; sort the tree by descending value; lastly
        // apply the pack layout.
        const root = pack(d3.hierarchy(vis.data)
            .sum(d => d.Global_Sales)
            .sort((a, b) => b.Global_Sales - a.Global_Sales));

        console.log(root);
        console.log(root.descendants())

        //Add nodes
        const node = vis.svg.append("g")
            .selectAll()
            .data(root.descendants())
            .join("g")
            .attr("transform", d => `translate(${d.x},${d.y})`);

        // Add a filled or stroked circle.
        node.append("circle")
            .attr("fill", d => d.children ? "#fff" : "#ddd")
            .attr("stroke", d => d.children ? "#bbb" : null)
            .attr("r", d => d.r);




        /*
        // Compute the layout
        const pack = data => d3.pack()
            .size([vis.width, vis.height])
            .padding(3)
            (d3.hierarchy(vis.data)
                .sum(d => d.Global_Sales)
                .sort((a, b) => b.Global_Sales - a.Global_Sales));
        const root = pack(vis.data);

        // Append the nodes
        const node = vis.svg.append('g')
            .selectAll("circle")
            .data(root.descendants())
            .join("circle")
            //.attr("fill", d => d.children ? vis.colorScale(d.depth) : "white")
            .attr("pointer-events", d => Object.keys(d).length > 0 ? "none" : null)
            .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
            .on("mouseout", function() { d3.select(this).attr("stroke", null); })
            //.on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));
            */


        /*// Append the text labels.
        const label = vis.svg.append("g")
            .style("font", "10px sans-serif")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .selectAll("text")
            .data(root.descendants())
            .join("text")
            .style("fill-opacity", d => d.parent === root ? 1 : 0)
            .style("display", d => d.parent === root ? "inline" : "none")
            //.text(d => d.data.name);

        // Todo: Tooltip event listeners

        // Create the zoom behavior and zoom immediately in to the initial focus node.
        vis.svg.on("click", (event) => zoom(event, root));
        let focus = root;
        let view;
        zoomTo([focus.x, focus.y, focus.r * 2]);

        function zoomTo(v) {
            const k = vis.width / v[2];

            view = v;

            label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
            node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
            node.attr("r", d => d.r * k);
        }

        function zoom(event, d) {
            const focus0 = focus;

            focus = d;

            const transition = vis.svg.transition()
                .duration(event.altKey ? 7500 : 750)
                .tween("zoom", d => {
                    const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                    return t => zoomTo(i(t));
                });

            label
                .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
                .transition(transition)
                .style("fill-opacity", d => d.parent === focus ? 1 : 0)
                .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
                .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
        }*/
    }


    toggleGenre(genre) {
        let vis = this;
    }

}