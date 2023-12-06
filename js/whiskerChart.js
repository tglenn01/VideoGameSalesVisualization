class WhiskerChart {

    constructor(_config, data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: 650,
            containerHeight: 600,
            margin: {
                top: 10,
                right: 50,
                bottom: 40,
                left: 110
            },
            boxOpacity: .80,
            outlineColour: "#000435",
            fadedOpacity: 0.2
        }

        this.initData(data);
    }

    // Preprocess the database specifically for this chart
    // Group all the games in the same genre
    // Calculate Sum, n, mean, and variance
    initData(data) {
        let vis = this;
        // temp values used in for each loops
        let genreData;
        let ratingValue;

        vis.genresData = new Map();

        gameGenres.forEach(genre => {
            genreData = {
                genre: genre,
                active: true,
                esrbSum: 0,
                esrbN: 0,
                mean: 0,
                variance: 0
            };
            vis.genresData.set(genre, genreData);
        })

        data.forEach(d => {
            ratingValue = d['Rating-Value']

            genreData = vis.genresData.get(d['Genre']);
            genreData['esrbSum'] += ratingValue;
            genreData['esrbN']++
        });

        vis.genresData.forEach(genre => {
            genre['mean'] = genre['esrbSum'] / genre['esrbN'];
        })


        let mean;
        data.forEach(d => {
            ratingValue = d['Rating-Value']
            genreData = vis.genresData.get(d['Genre']);

            mean = genreData['mean'];
            genreData['variance'] += (ratingValue - mean) * (ratingValue - mean);
        });

        vis.genresData.forEach(genre => {
            genre['variance'] = genre['variance'] / genre['esrbN'];
        })

        vis.initialGenreData = new Map(vis.genresData);
    }


    initVis() {
        let vis = this;
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.xScale = d3.scaleLinear()
            .domain([3, 0])
            .range([vis.height - 100, 50]);

        vis.yScale = d3.scaleBand()
            .domain(gameGenres)
            .range([50, vis.width]);

        vis.esrbLabels = ['Everyone', 'E10+', 'Teen', 'Mature']
        vis.xAxis = d3.axisBottom(vis.xScale)
            .ticks(4)
            .tickFormat(d => vis.esrbLabels[d]);

        vis.gridLinesAxis = d3.axisTop(vis.xScale)
            .ticks(4)
            .tickFormat(d => '')
            .tickSize(-vis.height + vis.config.margin.bottom - 100);

        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(vis.genresData.size);

        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight)
            .attr('id', 'whisker-plot');

        vis.chartArea = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        vis.genreGroups = vis.chartArea.selectAll('g')
            .data(vis.genresData.values(), data => {
                return data;
            })
            .join('g')
            .attr('class', 'genre-group')
            .attr('transform', `translate(0, 15)`)


        let boxHeight = 20


        vis.whiskersOutline = vis.genreGroups.append('line')
            .attr('class', 'whisker-outline')
            .attr('stroke', vis.config.outlineColour)
            .attr('x1', d => vis.xScale(d.mean + d.variance) + boxHeight /2 + 1  + 'px')
            .attr('x2', d => vis.xScale(d.mean - d.variance) + boxHeight /2 - 1 + 'px')
            .attr('y1', d => vis.yScale(d.genre) + boxHeight / 2 + 'px')
            .attr('y2', d => vis.yScale(d.genre) + boxHeight / 2 + 'px')

        vis.whiskers = vis.genreGroups.append('line')
            .attr('class', 'whisker')
            .attr('x1', d => vis.xScale(d.mean + d.variance) + boxHeight /2  + 'px')
            .attr('x2', d => vis.xScale(d.mean - d.variance) + boxHeight /2  + 'px')
            .attr('y1', d => vis.yScale(d.genre) + boxHeight / 2 + 'px')
            .attr('y2', d => vis.yScale(d.genre) + boxHeight / 2+ 'px')
            .attr('stroke', d => colourScale(d.genre))
            .attr('stroke-width', 0.5);

        vis.boxesBackdrop = vis.genreGroups.append('rect')
            .attr('class', 'box-backdrop')
            .attr('width', boxHeight + 8)
            .attr('height', boxHeight + 8)
            .attr('y', d => vis.yScale(d.genre))
            .attr('x', d => vis.xScale(d.mean))

        vis.boxesOutline = vis.genreGroups.append('rect')
            .attr('class', 'box-outline')
            .attr('width', boxHeight + 5)
            .attr('height', boxHeight + 5)
            .attr('stroke', vis.config.outlineColour)
            .attr('y', d => vis.yScale(d.genre) - 2.5)
            .attr('x', d => vis.xScale(d.mean) - 2.5)

        vis.boxes = vis.genreGroups.append('rect')
            .attr('class', 'box')
            .attr('width', boxHeight)
            .attr('height', boxHeight)
            .attr('y', d => vis.yScale(d.genre))
            .attr('x', d => vis.xScale(d.mean))
            .attr('stroke', d => colourScale(d.genre))
            .attr('opacity', vis.config.boxOpacity)
            .on('click', (d, genre) => {
                onClickHelper(genre['genre']);
            });


        vis.yAxisG = vis.chartArea.append('g')
            .attr('class', 'y-tick-whisker')
            .call(vis.yAxis);

        vis.yAxisG.selectAll('.tick')
            .attr('font-size', '16px')
            .attr('font-weight', 'bold')
            .attr('color', d => colourScale(d))
            .attr('genre', d => d)
            .attr('stroke-width', '0.35')
            .attr('stroke', 'black')
            .on('click', (d, genre) => {
               onClickHelper(genre);
            });

        vis.xAxisG = vis.chartArea.append('g')
            .attr('class', 'x-tick-whisker')
            .call(vis.xAxis)
            .attr('transform', `translate(30, ${vis.height})`);

        vis.gridLines = vis.chartArea.append('g')
            .attr('class', 'x-tick-grid-lines')
            .call(vis.gridLinesAxis)
            .attr('transform', `translate(30, 50)`);

        vis.yAxisG.select(".domain").remove();
        vis.xAxisG.select(".domain").remove();
        vis.gridLines.select(".domain").remove();

    }


    renderVis(data) {
        let vis = this;
    }

    // The specific genre is highlighted with it'c colour and full capacity
    // The unselected genre the colours of the outline and main are flipped and the opacity is dimmed
    updateVis() {
        let vis = this;

        // update whiskers
        vis.genreGroups.selectAll('.whisker').transition().duration(750).attr('stroke', d => {
            if (d['active']) return colourScale(d.genre);
            return vis.config.outlineColour;
        }).attr('opacity', d => {
            if (d['active']) return 1;
            return vis.config.fadedOpacity;
        })

        // update whisker outlines
        vis.genreGroups.selectAll('.whisker-outline').transition().duration(750).attr('stroke', d => {
            if (d['active']) return vis.config.outlineColour;
            return colourScale(d.genre);
        }).attr('opacity', d => {
            if (d['active']) return 1;
            return vis.config.fadedOpacity;
        })

        // update boxes
        vis.genreGroups.selectAll('.box').transition().duration(750).attr('stroke', d => {
            if (d['active']) return colourScale(d.genre);
            return vis.config.outlineColour;
        }).attr('opacity', d => {
            if (d['active']) return vis.config.boxOpacity;
            return vis.config.fadedOpacity;
        })

        // update boxes outlines
        vis.genreGroups.selectAll('.box-outline').transition().duration(750).attr('stroke', d => {
            if (d['active']) return vis.config.outlineColour;
            return colourScale(d.genre);
        }).attr('opacity', d => {
            if (d['active']) return 1;
            return vis.config.fadedOpacity;
        })

        // update just the opacity of the backdrop
        vis.genreGroups.selectAll('.box-backdrop').transition().duration(750).attr('opacity', d => {
            if (d['active']) return 1;
            return vis.config.fadedOpacity;
        })
    }


    // Receive a genre to highlight on the graph,
    // all but the selected genre are dimmed
    toggleGenre(genre) {
        let vis = this;

        vis.genresData.forEach(entry => {
            entry['active'] = entry['genre'] === genre;
        })

        this.updateVis()
    }


    toggleAllGenresOn() {
        let vis = this;

        vis.genresData.forEach(entry => {
            entry['active'] = true;
        })

        this.updateVis()
    }


}

// Send selected genres to other charts on click :)
function onClickHelper(genre) {
    updateLegend(genre);
    bubbles.toggleGenre(genre);
    whiskers.toggleGenre(genre);
}
