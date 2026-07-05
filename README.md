# PecuLab LLC Website

Static company website for PecuLab LLC, the independent U.S. applied AI education, automation, advisory, and cross-border execution company led by Yun-Cheng Tsai, Ph.D.

## Files

- `index.html` - main webpage
- `field-notes/index.html` - Jekyll-powered Field Notes listing page with language filters
- `field-notes/local-preview/` - local-only styled previews for checking posts before GitHub Pages builds them
- `_posts/` - Markdown Field Notes articles using `YYYY-MM-DD-title.md` filenames
- `_templates/field-note-template.md` - copyable Markdown template for new Field Notes posts
- `_layouts/post.html` - article layout with language-version links
- `_config.yml` - GitHub Pages / Jekyll configuration
- `styles.css` - layout, color system, and responsive styling
- `script.js` - mobile navigation and reveal animation
- `thanks.html` - FormSubmit confirmation redirect page
- `assets/portrait.jpg` - profile photo
- `assets/peculab-logo-source.png` - original stacked PecuLab logo source file
- `assets/peculab-logo.png` - cropped white-background stacked PecuLab logo derived from the source file
- `assets/peculab-mark.png` - cropped white-background symbol mark derived from the stacked logo for the header

## Public Profile Links

- LinkedIn: https://www.linkedin.com/in/pecutsai/
- Google Scholar: https://scholar.google.com/citations?user=a2LHNL8AAAAJ&hl=zh-TW

## Notes

- PecuLab LLC should remain the primary site identity and contracting/operating entity.
- FIH references should be framed as case-by-case collaboration lines, not as the company identity.
- Public profile materials are represented through LinkedIn and Google Scholar only.
- Publication details and citation data should remain on external profiles rather than being duplicated in this static site.
- Field Notes should be published as paired English and Chinese Markdown files.
- New Field Notes articles can be added as Markdown files in `_posts/` with `lang: en` and `lang: zh`.
- Paired English and Chinese files must share the same `translation_key`; the index groups them into one article card.
- The Field Notes index uses Jekyll `site.posts`; after GitHub Pages builds the site, new Markdown files in `_posts/` are listed automatically.
- Do not open `_posts/*.md` directly in a browser for layout review; those files are Markdown source. Use the GitHub Pages URL after build, or a local preview HTML file under `field-notes/local-preview/`. If a Markdown post changes, update the matching local preview file too.
- Local preview links should point to explicit `index.html` files instead of directory paths, so `file:///` browsing behaves predictably.
