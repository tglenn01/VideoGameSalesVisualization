class WhiskerChart {

    constructor(_config, data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: 900,
            containerHeight: 950,
            margin: {
                top: 150,
                right: 150,
                bottom: 150,
                left: 150
            }
        }

        this.initData(data);
    }

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

        console.log(vis.genresData)
        //vis.initVis()
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
            .tickFormat(d => vis.esrbLabels[d])
            .tickSize(-vis.height + vis.config.margin.bottom - 100);

        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(12)
            .tickFormat(d => d.toUpperCase());

        vis.svg = d3.select(vis.config.parentElement).append('svg')
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight)
            .attr('id', 'whisker-plot');

        vis.chartArea = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        vis.border = vis.chartArea.attr("class", "whisker-plot-chart")


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
            .attr('y', d => vis.yScale(d.genre) - 2.5)
            .attr('x', d => vis.xScale(d.mean) - 2.5)

        vis.boxes = vis.genreGroups.append('rect')
            .attr('class', 'box')
            .attr('width', boxHeight)
            .attr('height', boxHeight)
            .attr('y', d => vis.yScale(d.genre))
            .attr('x', d => vis.xScale(d.mean))
            .attr('stroke', d => colourScale(d.genre))

        vis.yAxisG = vis.chartArea.append('g')
            .attr('class', 'y-tick')
            .call(vis.yAxis);

        vis.xAxisG = vis.chartArea.append('g')
            .attr('class', 'x-tick')
            .call(vis.xAxis)
            .attr('transform', `translate(15, ${vis.height})`);

        vis.yAxisG.select(".domain").remove();
        vis.xAxisG.select(".domain").remove();

    }


    renderVis() {
        let vis = this;
    }


    toggleGenre(genre) {
        let vis = this;
    }

}