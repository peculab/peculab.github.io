# Firebase setup

Field Notes now uses share-only reader actions.

The previous Google-verified Like feature has been removed from the article layout and from `field-notes-engagement.js`. Readers can share, copy the article URL, or open social sharing links without signing in.

## Current behavior

- No Google sign-in is shown on Field Notes pages.
- No Like count is displayed.
- No Firebase app, Authentication flow, or Firestore write is loaded by the current engagement script.
- Social sharing uses the canonical GitHub Pages URL, not the local file path.

## Archived note

`firestore.rules` is kept only as an archived safety file. It should not be needed unless a future version intentionally brings back a database-backed reader response feature.
