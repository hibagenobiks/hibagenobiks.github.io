# Hiba Ali — personal website

A lightweight, custom Jekyll site for GitHub Pages: no profile photo, serif
"journal" typography, automatic dark mode, a table of contents on long notes,
tag filtering, and a one-click citation box on every note.

Why custom instead of AcademicPages? AcademicPages is built on a large theme
(Minimal Mistakes) with hundreds of files you never touch, sample posts that
leak into "You may also enjoy", and a sidebar built around a photo. This site
has ~25 files, every one of which you can read and understand, so changing
something never means hunting through a theme.

---

## 1. What's in the folder

| Path | What it is | Do you edit it? |
|---|---|---|
| `_config.yml` | Your name, bio, social links, site address | **Yes, first** |
| `_data/navigation.yml` | Top menu | Sometimes |
| `_data/publications.yml` | Your papers (one entry each) | **Yes** |
| `index.md` | Extra text on the home page | Optional |
| `cv.md`, `talks.md`, `teaching.md` | Those pages | **Yes** (replace placeholders) |
| `_posts/` | Your notes/articles, one Markdown file each | **This is where you write** |
| `_templates/new-note.md` | Copy this to start a new note | No (copy it) |
| `images/` | Figures (one folder per note keeps things tidy) | Yes |
| `files/` | PDFs: CV, slides, posters | Yes |
| `_layouts/`, `_includes/` | Page templates (HTML) | Rarely |
| `assets/css/main.css` | All styling; change `--accent` to recolour | Rarely |
| `assets/js/main.js` | Dark-mode toggle, TOC, tag filter | No |

Folders starting with `_` are Jekyll's "special" folders: they are used to
*build* the site but are not published as pages themselves.

---

## 2. Replacing your current site (one-time)

You already have the repo `hibagenobiks.github.io` on your laptop. Do the
switch on a **branch**, so your current live site stays untouched until you
are happy with the new one. (GitHub Pages publishes only the `main`/`master`
branch, so a branch is a safe sandbox.)

```bash
cd ~/path/to/hibagenobiks.github.io

git status                    # should say "nothing to commit"; commit or stash first if not
git switch -c redesign        # new branch called "redesign"

# Keep your real figures and PDFs somewhere safe first
mkdir -p ~/site-backup
cp -r images files ~/site-backup/ 2>/dev/null

# If you use a custom domain, keep its CNAME file too
[ -f CNAME ] && cp CNAME ~/site-backup/

# Remove the old theme files from this branch (they stay safe on main)
git rm -r -q .
```

Now unzip `hiba-site.zip` and copy **its contents** (not the folder itself) into
the repo folder, then put your real figures back:

```bash
cp -r ~/Downloads/hiba-site/. .     # adjust the path to where you unzipped
cp ~/site-backup/images/<your-figure-files> images/reference-genome/
[ -f ~/site-backup/CNAME ] && cp ~/site-backup/CNAME .
```

### Your figures

The article uses `images/reference-genome/figure1.png` … `figure6.png`.
Placeholder images with those names are included so the page doesn't look
broken. Either:

- rename your real figures to `figure1.png` … `figure6.png` and overwrite the
  placeholders, **or**
- keep your filenames and change the `src="..."` in each
  `{% include figure.html ... %}` line of
  `_posts/2026-07-02-reference-genome-genetic-yield.md`.

### Your old article link still works

The note's front matter has
`permalink: /neurogenomics/reference-genome-genetic-yield/`, the same address
as on your old site, so anyone who already has (or cited) that link still
lands on the article. New notes get addresses like `/notes/<title>/`.

---

## 3. Preview on your laptop before publishing (recommended)

Why: GitHub takes 1–2 minutes per build and only shows errors in a log. A local
preview shows every change in about a second.

One-time setup (macOS):

```bash
brew install ruby                      # macOS's built-in Ruby is too old
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
gem install bundler
bundle install                         # run inside the repo; installs Jekyll exactly as GitHub uses it
```

Every time:

```bash
bundle exec jekyll serve --livereload
```

Open <http://localhost:4000>. The page reloads when you save a file.
(Restart the command after editing `_config.yml`, because it's read only at startup.)

---

## 4. Publish

```bash
git add -A
git commit -m "Redesign site: custom layout, no photo, new notes section"
git push -u origin redesign
```

Check it on GitHub, then make it live by merging into your main branch:

```bash
git switch main          # or: git switch master
git merge redesign
git push
```

On GitHub → your repo → **Settings → Pages**, check that **Source** is
"Deploy from a branch" and the branch is `main` (or `master`), folder `/ (root)`.
The site updates at <https://hibagenobiks.github.io> within a couple of minutes
(**Actions** tab shows progress and any errors).

---

## 5. Writing a new note

1. Copy `_templates/new-note.md` into `_posts/` and name it
   `YYYY-MM-DD-short-title.md`. The date in the name is the publish date.
2. Fill in the front matter (title, description, tags).
3. Write in Markdown. Available extras:

   - **Highlight box:** a paragraph starting with a bold heading, followed by `{: .callout}` (or `{: .callout .warn}` for amber) on the next line.
   - **Box with a list inside:** wrap it in `<div class="callout" markdown="1"> … </div>`.
   - **Figure with caption:** `{% include figure.html src="/images/folder/fig.png" alt="..." caption="**Figure 1.** ..." %}`
   - **Equations:** set `math: true`, then write `$...$` or `$$...$$`.
   - **Code, tables, quotes:** normal Markdown.

4. Put figures in `images/<note-name>/`. Use PNG or SVG, roughly 1400 px wide.
5. Preview, commit, push.

Tags are free text. Every tag you use becomes a filter button on the Notes page.

---

## 6. Common tweaks

- **Change the colour:** edit `--accent` (light mode) and the second `--accent`
  (dark mode) at the top of `assets/css/main.css`.
- **Add a menu item:** add a page file (e.g. `outreach.md` with
  `permalink: /outreach/`) and a line in `_data/navigation.yml`.
- **Add your CV PDF:** put it in `files/` and set `cv_pdf: /files/Hiba_Ali_CV.pdf`
  in `_config.yml`. A download button appears on the CV page.
- **Hide reading time:** `show_reading_time: false` in `_config.yml`.

## 7. If something breaks

- *Site shows the old version:* hard-refresh (Cmd+Shift+R); GitHub's cache can lag a minute or two.
- *Build failed (red ✗ on the Actions tab):* open the failed run; the error names the file and line. A typical cause is a missing closing `---` or a `"` inside a title (wrap the title in single quotes, or escape it).
- *A note doesn't appear:* its date in the file name is in the future, or the file isn't in `_posts/`.

## Learn more

- Jekyll docs, especially "Front Matter", "Posts" and "Includes": <https://jekyllrb.com/docs/>
- GitHub Pages and Jekyll: <https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll>
- Markdown reference used here (kramdown, including the `{: .class}` syntax): <https://kramdown.gettalong.org/syntax.html>
- Git basics (branches, merge): <https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging>
