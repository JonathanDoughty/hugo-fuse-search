## About

This is not a standalone theme. It is a [Hugo](https://gohugo.io)
[theme component](https://gohugo.io/hugo-modules/theme-components/)
providing a content search capability based on the
[Fuse.js](https://fusejs.io/) JavaScript capability and Hugo's ability to
generate a
[Custom Output Format](https://gohugo.io/templates/output-formats#customizing-output-formats)
JSON rendition of site content.

This implementation was inspired by the
[Github Gist for Fuse.js integration](https://gohugo.io/tools/search/)

# Usage


1. Copy/adjust the content of `exampleSite/content/search.md` or
`exampleSite/content/search/_index.md` into your content

1. Copy/adjust the content of `exampleSite/static/dist/css/site.css` into your
own `static/dist/css/site.css` or equivalent. Only needed if you want to tweak
the look of search items returned by search.


1. Copy and adjust if necessary the content of `exampleSite/static/dist/js/fuse-options.js` into
your own static/dist/js/ collection. As implemented search uses two sets of
content with slightly different fuse parameters: titles and the first 80
characters of text content, followed by 1000 characters of content text, tags,
and 'categories' at a lower priority.

1. Add "search" as one of the themes in `config.toml` or as a hugo module:
```
theme = [ "search",  ...]

```

5. Add "JSON" as one of the outputs formats in `config.toml`
```
[outputs]
  home = ["HTML", "JSON"]
```

6. You may need to make an adjustment to allow the generation of inline HTML:
```
[markup.goldmark.renderer]
   # render inline HTML, for e.g., search
   unsafe = true
```

7. Incorporate the search page into your web site. Mine add a main menu
selection:
```
[[menu.Main]]
  identifier = "search"
  url        = "/search/"
  name       = "icon-label-Search"
  post       = '<span class="fas fa-search"></span>'
  weight     = 40
```
