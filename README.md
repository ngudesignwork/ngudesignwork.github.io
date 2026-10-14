# Portfolio

Personal portfolio site. Plain HTML, CSS and a little JavaScript: no build step, no dependencies.

## Structure

```
index.html            Home: intro on the left, scrolling project list on the right
work/project-01.html  Case study template
styles.css            Colors, type and layout (design tokens at the top)
main.js               Mini interactions: rolling link text, dog cursor
assets/               Images (cover images, case study screens)
```

## Preview locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Adding a project

1. Duplicate `work/project-01.html` as `work/project-02.html` and fill it in.
2. In `index.html`, point the matching `<a class="project">` at `work/project-02.html`.
3. Put images in `assets/project-02/` and swap each `<div class="placeholder">` for
   `<img src="../assets/project-02/hero.jpg" alt="Describe the image">`.

## Changing the look

All colors live at the top of `styles.css`:

| Token      | Value     | Used for                       |
|------------|-----------|--------------------------------|
| `--bg`     | `#F5F1FB` | Whisper lilac background       |
| `--ink`    | `#1F1B26` | Text                           |
| `--accent` | `#FF7C04` | The pop of color               |
| `--band`   | `#6E597A` | "Next case study" band         |

Fonts: Instrument Serif (headings) and Instrument Sans (body), from Google Fonts.

## Interactions

- **Rolling text:** add `data-roll` to any link and its text rolls up on hover.
- **Project rows:** title slides and turns italic, cover zooms, arrow lifts.
- **Wiggle:** add `class="wiggle"` to any inline word.
- **Dog cursor:** a dog trails the pointer and sticks its tongue out over links.
  Visitors can turn it off with the "Dog cursor" button. The choice is remembered.

Hover effects only run on devices with a mouse or trackpad, and motion is reduced
for visitors who turn on "Reduce motion" in their OS settings.

## Hosting (GitHub Pages)

The repo is named `ngudesignwork.github.io`, so GitHub Pages serves it at
`https://ngudesignwork.github.io`. In the repo, go to **Settings → Pages** and set the
source to **Deploy from a branch → `main` / root**.
