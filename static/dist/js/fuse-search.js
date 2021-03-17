// adapted from https://gist.github.com/naile/47e3e8aa62c6d1410d7b51b80f13bcfe
// and https://gist.github.com/eddiewebb/735feb48f50f0ddd65ae5606a1cb41ae
// Initialize fuse.js using hugo generated index file

var titleContentSearcher,
    allContentSearcher,
    searchResultsList,
    jsonContent;


function initFuse() {
  var titleContentOptions = JSON.parse(JSON.stringify(titleOptions));
  titleContentOptions.keys = titleContentKeys;
  titleContentSearcher = new Fuse(jsonContent, titleContentOptions);
  if (useAllContent) {
    var contentOptions = JSON.parse(JSON.stringify(allContentOptions));
    contentOptions.keys = allContentKeys;
    allContentSearcher = new Fuse(jsonContent, contentOptions);
  }
}

function initFuseWithContent() {
  var request = new XMLHttpRequest();
  request.open('GET', jsonURL, true);

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      jsonContent = JSON.parse(request.responseText);
      initFuse();
   } else {
      var err = request.status + ", " + error;
      console.error("Error getting file:", jsonURL, err);
    }
  };
  request.send();
}

// Hook up event handler on the input field
function initUI() {
  searchResultsList = document.getElementById("results");
  var searchUserInput = document.getElementById("search");

  function doSearch() {
    while (searchResultsList.firstChild) {
      searchResultsList.removeChild(searchResultsList.firstChild);
    }

    // Only trigger a search when minimumChars, at least, have been provided
    var query = searchUserInput.value.trim();
    if (query.length < minimumChars) {
      return;
    }

    if (!titleContentSearcher) {
      initFuse();
    }
    var results = titleContentSearcher.search(query);
    var allResults = null;
    if (useAllContent) {
      allResults  = allContentSearcher.search(query);
    }
    renderResults(results, allResults);
  };

  function delay(callback, ms) {
    var timer = 0;
    return function() {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        callback.apply(context, args);
      }, ms || 0);
    };
  }

  searchUserInput.onkeyup = delay(doSearch, 500);
}

/**
 * Display the first maxResults, first from title matches, filling in with other category matches
 */
function renderResults(results, allResults) {
  if (results.length <1 && allResults && allResults.length < 1) {
    return;
  }

  function displayableScore(score) {
    return (100 - (score * 100)).toFixed(2);
  }

  function shorten(str, maxLen=80, separators = '/[\.\?]/') {
    if (str.length <= maxLen) return str;
    var shorter;
    var pos = str.replace(/^.{80}/,"").match(/[^a-z ]/i)['index'] + maxLen;
    shorter = str.substr(0, pos);
    if (shorter.charAt(shorter.len -1) != '.') {
      shorter += " ...";
    }
    return shorter;
  }

  function summarize(item, score) {
    var parts = item.contents.split(/[\n\r]/g);
    var summary;
    if (showCategoryAndTags) {
      var category = item.categories ? "In the " + item.categories[0] + " gallery" : "";
      var description = shorten(parts[0]);
      summary = category + " with tags " + item.tags.join(", ") + ": " + description;
    } else {
      summary = shorten(parts[0]);
    }
    if (showScores) {
      summary += " - Score:" + displayableScore(score);
    }
    return summary;
  }

  // Show the first maxResults matches
  var resultsSoFar = [],
      remaining = results.length;

  results.slice(0, maxResults).forEach(function (result) {
    var li = document.createElement('li');
    var ahref = document.createElement('a');
    ahref.href = result.item.permalink;
    ahref.text = result.item.title;
    li.append(ahref);
    li.append(document.createTextNode(" - " + summarize(result.item, result.score)));
    searchResultsList.appendChild(li);
    resultsSoFar.push(result.item.permalink);
  });

  if (resultsSoFar.length < maxResults && useAllContent) {
    // Fill in additional from allResults, filtering those included in results
    allResults = allResults.filter(function(value, index, arr) {
      return ! resultsSoFar.includes(value.item.permalink);
    });
    allResults.slice(resultsSoFar.length, maxResults).forEach(function (result) {
      // Maybe you want to filter out low scoring results too?
      // Maybe anything less than 20% of the top scoring item?
      // Or perhaps when the score is less than half of the preceeding score?
      var li = document.createElement('li');
      var ahref = document.createElement('a');
      ahref.href = result.item.permalink;
      ahref.text = result.item.title;
      li.append(ahref);
      li.append(document.createTextNode(" - " + summarize(result.item, result.score)));
      searchResultsList.appendChild(li);
      resultsSoFar.push(result.item.permalink);
    });
    remaining = allResults.length - resultsSoFar.length;
  } else {
    remaining -= resultsSoFar.length;
  }
  if (remaining > 0 && showScores) {
    // Tell user there are more yet
    // Bonus yak-shaving points for stats on score distribution
    // see https://stackoverflow.com/questions/48719873/how-to-get-median-and-quartiles-percentiles-of-an-array-in-javascript-or-php
    var li = document.createElement('li');
    var p = document.createElement('p');
    p.appendChild(document.createTextNode("... and " + remaining + " more"));
    li.append(p);
    searchResultsList.appendChild(li);
  };
}

initFuseWithContent();

document.addEventListener("DOMContentLoaded", function () {
  initUI();
});
