---
title: "Content Search"
description: "What can I help you find?"
layout: 'search'
sitemap:
  priority : 0.1
---
<div class="pa4-l">
  <form class="center pa4 br2-ns ba b--black-40 shadow-4">
    <fieldset class="bn ma0 pa0">
      <legend class="pa0 f5 f4-ns mb3 black-80">Start typing and descriptions that match will appear below.
      </legend>
      <div class="measure">
        <label class="clip" for="search">Search</label>
        <input class="f6 f5-l input-reset bn fl black-80 bg-white pa3 lh-solid
        w-auto w-75-m w-100-l br2-ns br--left-ns" type="search" autofocus
        placeholder="&nbsp;I am looking for ..." name="search" value="" id="search"
        onkeypress="return event.keyCode != 13;">
      </div>
    </fieldset>
  </form>
  <ul class="list ba b--light-silver" id="results">
      <li class="ph3 pv2 f5 black-70 bb b--light-silver">&#x2713 Misspellings forgiven</li>
      <li class="ph3 pv2 f5 black-70 bb b--light-silver">&#x2713 Search starts as you stop typing</li>
      <li class="ph3 pv2 f5 black-70 ">&#x2713 Results refined as more words are added</li>
  </ul>
</div>
<script src="/dist/js/fuse.min.js"></script>
<script src="/dist/js/fuse-options.js"></script>
<script src="/dist/js/fuse-search.js"></script>
