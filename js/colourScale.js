/**
 * Initialize the Ordinal Scale for each Game Genre to its respective Colour Code
 **/

let gameGenreColours = ['#2f4f4f', '#8b4513', '#008000', '#000080',
    '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#ff00ff',
    '#1e90ff', '#eee8aa', '#ff69b4']

let colourScale = d3.scaleOrdinal()
    .domain(gameGenres)
    .range(gameGenreColours);