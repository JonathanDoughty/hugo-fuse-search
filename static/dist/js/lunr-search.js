 // vanilla js version of https://gist.github.com/sebz/efddfc8fdcb6b480f567
 // adapted from https://gist.github.com/naile/47e3e8aa62c6d1410d7b51b80f13bcfe
 var lunrIndex,
     $results,
     pagesIndex,
     json = '/index.json',
     titleBoost =10,
     tagBoost = 2,
     fuzzyWordMin = 3,
     minimumChars = 3,
     saturation = 1.4,     // Default = 1.2; > slows down saturation of common words
     docLengthAdjust = 0,  // 0 - 1; default = .75 0; 0 reduces effect of document length 
     maxResults = 10;

 // Initialize lunr.js using hugo generated index file
 function initLunr() {
   var request = new XMLHttpRequest();
   request.open('GET', json, true);

   request.onload = function () {
     if (request.status >= 200 && request.status < 400) {

       pagesIndex = JSON.parse(request.responseText);
       //console.log("index:", pagesIndex);

       // Set up lunrjs by declaring the fields we use
       // and their boost level for the ranking
       lunrIndex = lunr(function () {
         this.field("title", {
           boost: titleBoost
         });
         this.field("tags", {
           boost: tagBoost
         });
         this.field("contents");
         // Similarity tuning - see https://lunrjs.com/guides/customising.html
         this.k1(saturation);
         this.b(docLengthAdjust);

         // ref is the result item identifier (the page URL)
         this.ref("permalink");
         //this.add({ field: "test", text: 'at least one entry' });
         for (var i = 0; i < pagesIndex.length; ++i) {
           this.add(pagesIndex[i]);
         }
       });
     } else {
       var err = request.status + ", " + error;
       console.error("Error setting Hugo index file:", json, err);
     }
   };

   request.send();
 }

 // Nothing crazy here, just hook up a event handler on the input field
 function initUI() {
   $results = document.getElementById("results");
   $search = document.getElementById("search");
   $search.onkeyup = function () {
     while ($results.firstChild) {
       $results.removeChild($results.firstChild);
     }

     // Only trigger a search when minimumChars, at least, have been provided
     var query = $search.value.trim();
     if (query.length < minimumChars) {
       return;
     }

     //add some fuzzyness to the string matching to help with spelling mistakes.
     var wordCount = query.split(' ').length;
     var fuzzLength = Math.round(Math.min(Math.max(query.length / (minimumChars * wordCount), 1), 3));
     var fuzzyQuery;
     if (wordCount <= fuzzyWordMin) {
        // For few word matches no fuzzyness seems to work better
        fuzzyQuery = query;
     } else {
        // For longer queries add some fuzziness
        fuzzyQuery = query + '~' + fuzzLength;
     }
     var results = search(fuzzyQuery);
     renderResults(results);
   };
 }

 /**
  * Trigger a search in lunr and transform the result
  *
  * @param  {String} query
  * @return {Array}  results
  */
 function search(query) {
   // Find the item in our index corresponding to the lunr one to have more info
   // Lunr result:
   //  {ref: "/section/page1", score: 0.2725657778206127}
   // Our result:
   //  {title:"Page1", permalink:"/section/page1", ...}
   var searchResults = lunrIndex.search(query);
   return searchResults.map(function (result) {
     return pagesIndex.filter(function (page) {
       return page.permalink === result.ref;
     })[0];
   });
 }

 /**
  * Display the first maxResults
  * @param  {Array} results to display
  */
 function renderResults(results) {
   if (results.length <1) {
     return;
   }

   $results = document.getElementById("results");
   // Show the first maxResults matches
   results.slice(0, maxResults).forEach(function (result) {
     var li = document.createElement('li');
     var ahref = document.createElement('a');
     ahref.href = result.permalink;
     ahref.text = result.title;
     li.append(ahref);
     $results.appendChild(li);
   });
   if (results.length > maxResults) {
       var li = document.createElement('li');
       var p = document.createElement('p');
       p.appendChild(document.createTextNode("... and " + (results.length - maxResults) + " more"));
       li.append(p);
       $results.appendChild(li);
   };
 }

 // Let's get started
 initLunr();

 document.addEventListener("DOMContentLoaded", function () {
   initUI();
 });
