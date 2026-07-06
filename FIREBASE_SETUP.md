# Firebase setup for verified Field Notes likes

This site uses Firebase Authentication and Cloud Firestore to let a reader leave one Google-verified like per Field Note.

## Firebase console steps

1. Open Firebase Console and select `peculab-site`.
2. Go to `Authentication` > `Sign-in method`.
3. Enable `Google`.
4. In authorized domains, include:
   - `peculab.github.io`
   - `localhost`
5. Go to `Firestore Database` and create a database in production mode.
6. Open `Rules`, paste the contents of `firestore.rules`, and publish.

## Data model

Each article stores a public count and one private per-user marker:

```text
articleLikes/{articleId}
articleLikes/{articleId}/users/{uid}
```

The page reads the public count. A signed-in reader can only create or delete their own user marker, so one Google account can only leave one like per article.

## Notes

- The Firebase web config in `field-notes-engagement.js` is intentionally public. Security is enforced by Firestore Rules.
- Google sign-in should be tested from the deployed `https://peculab.github.io/...` site. Browsers may restrict module scripts or sign-in flows from local `file:///` pages.
- Social sharing uses the canonical GitHub Pages URL, not the local file path.
