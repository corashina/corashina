# Top Languages Card Repair

## Goal

Restore the broken Top Languages card in the GitHub profile README without redesigning any other part of the profile.

## Design

Replace the existing Top Languages image URL with the canonical GitHub Readme Stats endpoint. Preserve the current `corashina` username, compact layout, Tokyo Night theme, displayed width, and accessible alternative text.

Add a version query parameter to invalidate GitHub's cached copy of the broken image. No new files, services, actions, or generated assets are required.

## Verification

- Confirm the README contains the canonical Top Languages endpoint.
- Confirm the query string still includes `username=corashina`, `theme=tokyonight`, and `layout=compact`.
- Request the final image URL and confirm it returns a successful SVG response.
- Confirm no unrelated README content changes.
