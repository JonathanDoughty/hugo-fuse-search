// adapted from https://gist.github.com/naile/47e3e8aa62c6d1410d7b51b80f13bcfe
// and https://gist.github.com/eddiewebb/735feb48f50f0ddd65ae5606a1cb41ae
var titleContentSearcher,
    allContentSearcher,
    searchResultsList,
    jsonContent,
    json = '/index.json',
    minimumChars = 3,
    showScores = true,
    useAllContent = false,
    maxResults = 10;

var fuseOptions = {
    caseSensitive: true,
    shouldSort: true,
    matchAllTokens: true,
    includeScore: true,
    includeMatches: true,
    threshold: 0.50,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 2
};

var titleContentKeys = [
        { name: "title", weight: 0.9},
        { name: "contents", weight: 0.5}
];
 
var allContentKeys = [
        { name: "title", weight: 0.9},
        { name: "contents", weight: 0.5},
        { name: "tags", weight: 0.01},
        { name: "categories", weight: 0.3}
];
 
// Initialize fuse.js using hugo generated index file
function initFuse() {
    var request = new XMLHttpRequest();
    request.open('GET', json, true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            jsonContent = JSON.parse(request.responseText);
            //console.log("index:", jsonContent);
            var titleContentOptions = JSON.parse(JSON.stringify(fuseOptions));
            titleContentOptions.keys = titleContentKeys;
            titleContentSearcher = new Fuse(jsonContent, titleContentOptions);
            if (useAllContent) {
                var allContentOptions = JSON.parse(JSON.stringify(fuseOptions));
                allContentOptions.keys = allContentKeys;
                allContentSearcher = new Fuse(jsonContent, allContentOptions);
            }
        } else {
            var err = request.status + ", " + error;
            console.error("Error setting Hugo index file:", json, err);
        }
    };
   request.send();
}

// Hook up event handler on the input field
function initUI() {
    searchResultsList = document.getElementById("results");
    var searchUserInput = document.getElementById("search");
    searchUserInput.onkeyup = function () {
        while (searchResultsList.firstChild) {
            searchResultsList.removeChild(searchResultsList.firstChild);
        }

        // Only trigger a search when minimumChars, at least, have been provided
        var query = searchUserInput.value.trim();
        if (query.length < minimumChars) {
            return;
        }

        var results = titleContentSearcher.search(query);
        var allResults;
        if (useAllContent) {
            allResults  = allContentSearcher.search(query);
        }
        renderResults(results, allResults);
    };
}

/**
 * Display the first maxResults
 * @param  {Array} results to display
 */
function renderResults(results, allResults) {
    if (results.length <1) {
        return;
    }

    function displayableScore(score) {
        return (100 - (score * 100)).toFixed(2);
    }

    // Show the first maxResults matches
    var resultsSoFar = 0,
        remaining = results.length;

    results.slice(0, maxResults).forEach(function (result) {
        var li = document.createElement('li');
        var ahref = document.createElement('a');
        ahref.href = result.item.permalink;
        ahref.text = result.item.title;
        li.append(ahref);
        if (showScores) {
            li.append(document.createTextNode(" - Score:" + displayableScore(result.score)));
        }
        searchResultsList.appendChild(li);
        resultsSoFar += 1;
    });

    if (resultsSoFar < maxResults && useAllContent) {
        // Fill in additional from allResults, not duplicating existing results
        // assuming the first resultsSoFar duplicate those above since keys are a superset.
        allResults.slice(resultsSoFar, maxResults).forEach(function (result) {
            var li = document.createElement('li');
            var ahref = document.createElement('a');
            ahref.href = result.item.permalink;
            ahref.text = result.item.title;
            li.append(ahref);
            if (showScores) {
                li.append(document.createTextNode(" - *Score:" + displayableScore(result.score)));
            }
            searchResultsList.appendChild(li);
            resultsSoFar += 1;
        });
        remaining = allResults.length - resultsSoFar;
    } else {
        remaining -= resultsSoFar;
    }
    if (resultsSoFar < maxResults && remaining > 0) {
        // Tell user there are more yet
        var li = document.createElement('li');
        var p = document.createElement('p');
        p.appendChild(document.createTextNode("... and " + remaining + " more"));
        li.append(p);
        searchResultsList.appendChild(li);
    };
}

// Let's get started
initFuse();

document.addEventListener("DOMContentLoaded", function () {
    initUI();
});
