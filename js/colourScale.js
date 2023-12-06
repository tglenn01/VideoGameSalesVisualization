/**
 * Initialize the Ordinal Scale for each Game Genre to its respective Colour Code
 *
 *
 *
 *         "#ff0000", // red for Puzzle
 *         "#2f4f4f", // darkslategray for Action
 *         "#00ffff", // aqua for Shooter
 *         "#ffff00", // yellow for Racing
 *         "#eee8aa", // palegoldenrod for Strategy
 *         "#ff69b4", // hotpink for Misc
 *         "#000080", // navy for Platformer
 *         "#00ff00", // lime for Role-Playing
 *         "#1e90ff", // dodgerblue for Sports
 *         "#008000", // green for Fighting
 *         "#8b4513", // saddlebrown for Adventure
 *         "#ff00ff", // fuchsia for Simulation
 *
 **/

let gameGenres = ['Action', 'Adventure', 'Fighting', 'Platform', 'Puzzle', 'Racing', 'Role-Playing',
    'Shooter', 'Simulation', 'Sports', 'Strategy', 'Misc'];

let gameGenreColours = ['#2f4f4f', '#8b4513', '#008000', '#000080',
    '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#ff00ff',
    '#1e90ff', '#eee8aa', '#ff69b4']

let colourScale = d3.scaleOrdinal()
    .domain(gameGenres)
    .range(gameGenreColours);