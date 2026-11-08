# Paediatric HALO QRH

Quick Reference Handbook for High Acuity, Low Occurrence emergency procedures in patients under 16.

**`index.html` is the master booklet and the only file to edit for content.** Everything else is built from it:

| Output | Where | How it is made |
|---|---|---|
| Website (phone-first, works offline) | https://paediatrichaloqrh.netlify.app | Netlify runs `npm run build` → `dist/` |
| Downloadable PDF | `pdf/HALO-QRH-Paediatrics.pdf`, linked from every page | GitHub Action **Update PDF** prints the booklet when `index.html` or `images/` change on `main` |
| Printable booklet | `/booklet.html` on the website | Copy of `index.html` with local fonts |
| Android app | `android/` | GitHub Action **Android app**; see [android/README.md](android/README.md) |

The build is shared with the adult HALO QRH (shakeymedic/Halobooklet). It reads procedures from the Contents page,
using its page numbers (`Pg 4–5` for a two-page procedure, `Pg 30` for a one-page reference card such as WETFLAG),
so a new procedure needs a Contents entry and its pages. The build stops with an error if the Contents and the
pages disagree.

App icons live in `icons/`. After changing them, run `node build/android-icons.mjs` to update the Android launcher icons.

## Working locally

```sh
npm ci
npm run build                      # dist/
npx playwright install chromium    # once
npm run pdf && npm run build       # refresh the PDF too
npm run serve                      # preview dist/
```
