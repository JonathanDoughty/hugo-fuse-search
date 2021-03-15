// Example of site-specific options for controlling fuse.js searches
var jsonURL = '/index.json',
    minimumChars = 3,
    showScores = false,  // Note: all content scores can be higher than title scores which take priority
    showCategoryAndTags = false,
    useAllContent = true, // all content includes tags and categories (galleries)
    maxResults = 10;

var titleOptions = {
  isCaseSensitive: false,
  shouldSort: true,
  matchAllTokens: true,
  ignoreLocation: true, // true = ignore location and distance
  includeScore: true,
  includeMatches: false,
  threshold: 0.2,
  location: 0,
  distance: 80,
  maxPatternLength: 32,
  minMatchCharLength: 4
};

var allContentOptions = {
  isCaseSensitive: false,
  shouldSort: true,
  matchAllTokens: true,
  ignoreLocation: true, // true = ignore location and distance
  includeScore: true,
  includeMatches: false,
  ignoreFieldNorm: false, // don't want tags/categories over-weighted
  threshold: 0.5,
  location: 0,
  distance: 1000,
  maxPatternLength: 32,
  minMatchCharLength: 3
};

var titleContentKeys = [
  { name: "title", weight: 0.8},
  { name: "contents", weight: 0.7} // if content match within shorter distance
];

var allContentKeys = [
  //{ name: "title", weight: 0.9},
  { name: "contents", weight: 0.7},
  { name: "tags", weight: 0.8},
  { name: "categories", weight: 0.9}
];
