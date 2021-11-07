var parser = require("../jison/grammar.js").parser;

// set parser's shared scope
parser.yy.distributions = require("./distributions.js");

// returns the JSON object
export function parse (input) {
    return parser.parse(input);
};