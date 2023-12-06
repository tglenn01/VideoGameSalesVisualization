
function initLegend() {
    d3.selectAll(".legend-btn").on("click", function () {
        d3.selectAll(".legend-btn").classed("inactive", true);
        d3.select(this).classed("inactive", false);
        let selectedGenre = d3.select(this).attr("data-genre");

        // Update the selected genre and re-render each scatterplot
        Object.values(scatterplots).forEach((plot) => {
            plot.selectedGenre = selectedGenre;
            plot.updateVis();
        });

        bubbles.toggleGenre(selectedGenre);
        whiskers.toggleGenre(selectedGenre);
    });

    d3.selectAll('.reset-filter-btn').on("click", function () {
        toggleGenresOn();
    })
}

function updateLegend(genre) {
    d3.selectAll(".legend-btn").classed("inactive", true);

    d3.selectAll(".legend-btn[data-genre=" + genre + "]").classed("inactive", false)
}

function resetLegend() {
    d3.selectAll(".legend-btn").classed("inactive", false);
}
