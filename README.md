# hibagenobiks.github.io

Personal website of Hiba Ali. It is plain HTML and CSS with no Jekyll, no theme and no build step.

**Why plain HTML?** With Jekyll, GitHub runs a build step that turns your files
into a website. If anything in that step goes wrong, you get a half-styled page
like the one you saw. Here, what is in the folder *is* the website. The empty
`.nojekyll` file tells GitHub Pages to skip Jekyll and serve the files exactly
as they are.

## Folder map

```
index.html                         Home page (hero, research, writing, contact)
about/index.html                   About me: story, experience, toolkit, publications
notes/index.html                   List of all notes
neurogenomics/reference-genome-genetic-yield/index.html
                                   Your reference-genome article (same address as before)
_new-note-template.html            Copy this to start a new note
assets/css/style.css               All the styling (colours at the top)
assets/js/site.js                  Dark mode, mobile menu, table of contents, copy button
images/                            Figures (one folder per note)
files/                             PDFs (CV, posters, slides)
404.html                           "Page not found" page
.nojekyll                          Tells GitHub not to run Jekyll (keep it!)
```

Every page's folder contains an `index.html`, so addresses look clean:
`/about/` instead of `/about.html`.

## Put it live (one time)

```bash
cd ~/meow/hibagenobiks.github.io
git switch main
git status                                   # should be clean

# Remove everything EXCEPT the .git folder and your images folder
find . -mindepth 1 -maxdepth 1 ! -name .git ! -name images -exec rm -rf {} +

# Copy the new site in (the dot-slash-dot copies hidden files like .nojekyll too)
cp -R ~/Downloads/hiba-static/. .

ls images/reference-genome                    # your 6 figures should be listed
git add -A
git commit -m "New static website"
git push
```

Then on GitHub, go to your repo → **Settings → Pages**. Set **Source** to
**Deploy from a branch**, with branch `main` and folder `/ (root)`. The site
updates within 1–2 minutes. The **Actions** tab shows a green ✓ when it's live.
Do a hard refresh (Cmd+Shift+R) to bypass your browser's cache.

## Preview on your laptop

```bash
cd ~/meow/hibagenobiks.github.io
python3 -m http.server 8000
```

Open <http://localhost:8000>. Press Ctrl+C in Terminal to stop.

Why a server, and not double-clicking `index.html`? The pages link to
`/assets/css/style.css` with a leading `/`, meaning "from the root of the site".
On GitHub that root is `hibagenobiks.github.io`. When you double-click a file,
the browser treats your whole hard drive as the root, so it can't find the CSS.
The little Python server makes your folder the root, just like GitHub does.

## Things to fill in

Search the files for `YOUR-` and `EDIT`. All of these are HTML comments, so
they are invisible on the site until you uncomment them:

- **Email, LinkedIn, ORCID:** in `index.html` (contact box) and in the footer of
  every page. To uncomment, delete the `<!--` and `-->` around the line.
- **Journal DOI** of your npj paper: in `index.html` and `about/index.html`.
- **Education:** in `about/index.html` (there's a ready block to uncomment).
- **City of the Universitätsklinikum:** search for `Universitätsklinikum` if you
  want to add it, e.g. "Universitätsklinikum Ulm".

## Writing a new note

1. Make a folder `notes/my-note-title/`. Use lowercase with dashes, because the
   folder name becomes the web address.
2. Copy `_new-note-template.html` into it and rename the copy to `index.html`.
3. Edit everything marked `EDIT`, write your note, and delete the example blocks you
   don't need. Delete the `noindex` line near the top. That line stops Google
   indexing the template, and you do want your note indexed.
4. Put figures in `images/my-note-title/`.
5. Add the note to the list in `notes/index.html` by copying an existing
   `<li class="note-item">` block, and do the same on the home page and About page if you like.
6. Preview, then `git add -A && git commit -m "New note: …" && git push`.

Building blocks available inside a note:

| You want | Write |
|---|---|
| Section heading (appears in the side menu) | `<h2 id="short-id">Title</h2>` |
| Highlighted box | `<div class="callout"><strong>Label</strong><p>Text</p></div>` |
| Warning box (amber) | `<div class="callout warn">…</div>` |
| Big pull quote | `<p class="pull">Sentence</p>` |
| Figure with caption | the `<figure class="fig wide">` block in the template |
| Two-column comparison | `<div class="compare"><div>…</div><div>…</div></div>` |

## Changing the look

All colours are at the top of `assets/css/style.css`. `--accent` is the teal,
and `--accent-2` is the terracotta. The dark-mode versions are in the
`[data-theme="dark"]` block just below. Change both if you re-colour.

## Learn more

- HTML basics (MDN): <https://developer.mozilla.org/en-US/docs/Learn/HTML>
- CSS basics (MDN): <https://developer.mozilla.org/en-US/docs/Learn/CSS>
- GitHub Pages, publishing from a branch: <https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site>
