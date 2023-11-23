class Bubbles {

    // TODO set borders/margins
    constructor(_config, data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: 800,
            containerHeight: 800,
            margin: {
                top: 30,
                right: 30,
                bottom: 30,
                left: 30
            },
            tooltipPadding: _config.tooltipPadding || 15

        }
        this.data = data;
        this.originalData = data;
        this.selection = null;
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
        vis.svg = d3.select(vis.config.parentElement)
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

        // Append the nodes.
        const node = vis.svg.append("g")
            .selectAll("circle")
            .data(root.descendants())
            .join("circle")
            .attr("fill", d => d.children ? vis.colorScale(d.depth) : "white")
            // .attr("class", d => (!d.children &&
            //                         vis.selection != null &&
            //                         d.Year_of_Release >= vis.selection[0].getFullYear() &&
            //                         d.Year_of_Release <= vis.selection[1].getFullYear()) ||
            //                       vis.selection == null
            //                       ? "active" : "inactive")
            .attr("pointer-events", d => !d.children ? "auto" : null)
            .on("mouseover", function () {
                d3.select(this).attr("stroke", "#000");
            })
            .on("mouseout", function () {
                d3.select(this).attr("stroke", null);
            })
            .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));

        const label = vis.svg.append("g")
            .style("font", "10px sans-serif")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .selectAll("text")
            .data(root.descendants())
            .join("text")
            .style("fill-opacity", d => d.parent === root ? 1 : 0)
            .style("display", d => d.parent === root ? "inline" : "none")

        // Add a tspan for each CamelCase-separated word.
        label.selectAll()
            .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g))
            .join("tspan")
            .attr("x", 0)
            .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.35}em`)
            .text(d => d);

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
                // The r > x value determines how small of a node still gets a label
                .on("start", function(d) { if (d.parent === focus && d.r > 1.5) this.style.display = "inline"; })
                .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });

        }

        // Tooltip event listeners
        node.filter(d => !d.children)
            .on('mouseover', (event, d) => {
                console.log(d.data);
                d3.select('#tooltip')
                    .style('display', 'block')
                    .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')
                    .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                    .html(`
              <div class="tooltip-title">${d.data.name}</div>
              <div><i>${d.data.Publisher}, ${d.data.Year_of_Release}</i></div>
              <ul>
                <li>Global Sales: ${d.data.Global_Sales}</li>
                <li>Critic Score: ${d.data.Critic_Score}</li>
                <li>User Score: ${d.data.User_Score}</li>
                <li>ESRB Rating: ${d.data.Rating}</li>
                <li>Developers: ${d.data.Developers}</li>
              </ul>
            `);
            })
            .on('mouseleave', () => {
                d3.select('#tooltip').style('display', 'none');
            });
    }

    toggleGenre(genre) {
        let vis = this;
    }

    updateSelection(selection) {
        let vis = this;
        // vis.selection = selection;
        // console.log(vis.originalData);
        //
        // if (selection != null) {
        //     let filteredData = [];
        //     // The variable names are assumed using default settings
        //     vis.originalData.children.forEach((platform) => {
        //         platform.children.forEach((genre) => {
        //             filteredData.push(genre.children.filter(d => (!d.children &&
        //                                 d.Year_of_Release >= vis.selection[0].getFullYear() &&
        //                                 d.Year_of_Release <= vis.selection[1].getFullYear())));
        //         });
        //     });
        //     vis.data = filteredData;
        // } else {
        //     vis.data = vis.originalData;
        // }
        // console.log(vis.data);
        //vis.updateVis();

    }
}
