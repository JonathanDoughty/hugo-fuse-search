---
title: "Search"
sitemap:
  priority : 0.1
layout: "search"
---
<div class="pa4-l">
  <form class="bg-light-green center pa4 br2-ns ba b--black-10">
    <fieldset class="bn ma0 pa0">
      <legend class="pa0 f5 f4-ns mb3 black-80">Start typing; titles of
      pages that have matching content will appear below</legend>
      <div class="measure">
        <label class="clip" for="search">Search</label>
        <input class="f6 f5-l input-reset bn fl black-80 bg-white pa3 lh-solid
        w-auto w-75-m w-100-l br2-ns br--left-ns" type="search" autofocus
        placeholder="&nbsp;I am looking for" name="search" value="" id="search">
      </div>
    </fieldset>
  </form>
 <ul class="list pl-10" id="results"></ul>
</div>
<script src="/dist/js/lunr.js"></script>
<script src="/dist/js/lunr-search.js"></script>
