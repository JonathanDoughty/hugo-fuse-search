---
title: "Search TCA"
featured_image: "ParkSign.jpg"
sitemap:
  priority : 0.1
---
<div class="pa4-l br3-ns bg-light-green">
  <form class="center pa4 br2-ns ba b--black-40 shadow-4">
    <fieldset class="bn ma0 pa0">
      <legend class="pa0 f5 f4-ns mb3 black-80">What are you looking for?<br/>Titles of
      pages that have matching content will appear below</legend>
      <div class="measure">
        <label class="clip" for="search">Search</label>
        <input class="f6 f5-l input-reset bn fl black-80 bg-white pa3 lh-solid
        w-auto w-75-m w-100-l br2-ns br--left-ns" type="search" autofocus
        placeholder="&nbsp;I am looking for" name="search" value="" id="search">
      </div>
    </fieldset>
  </form>
  <div class="">
      <ul class="list pl-10" id="results"></ul>
  </div>
</div>
<script src="/dist/js/lunr.js"></script>
<script src="/dist/js/lunr-search.js"></script>
