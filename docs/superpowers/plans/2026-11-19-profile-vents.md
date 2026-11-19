# Plan: Profile README, Vents design

Spec: `docs/superpowers/specs/2026-11-19-profile-vents-design.md`

1. Add subset fonts and their OFL licences under `fonts/`.
2. `scripts/lib.mjs`: shared SVG helpers (seeded random, paths, gradients, text, font-face embedding, XML escaping).
3. `scripts/hero.mjs`: the vent scene. Layers back to front: water gradient, light shafts, whale, far chimneys in haze, jellyfish, fish school, plumes with heat shimmer, main chimneys with glowing cracks and bacterial mats, embers, shrimp swarm, tube worms, crabs, eelpout, foreground rocks, snow, bubbles, name block, grain.
4. `scripts/links.mjs`: four link buttons in the vent style.
5. `scripts/build-art.mjs`: write `assets/hero.svg` and `assets/link-{website,email,linkedin,blog}.svg`.
6. `scripts/cards.mjs` + `scripts/build-cards.mjs`: languages and activity cards, from the GitHub API or `--sample`.
7. `scripts/check.mjs`: strict XML parse of every generated SVG.
8. `.github/workflows/profile.yml`: daily build of cards and the snk eel, published to the `output` branch.
9. Rewrite `README.md`: hero, links, badge block, cards, eel.
10. Visual check in Chromium, fix, commit as Tomasz, open PR, merge to main, delete this plan, the spec and the branch.
