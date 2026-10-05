# Happy Teachers Day Website 🇵🇭🌼

Muted yellow theme + flowers + Puno ng Saging inside joke.

## Run locally
Just open `index.html` in browser. Message wall works in local mode (localStorage).

## Make wall SHARED (required for GitHub Pages)

GitHub Pages is static only, so we use free Firebase Firestore for sharing.

1. Go to https://console.firebase.google.com/ -> Add project -> name e.g. `happy-teachers-day` (disable Analytics)
2. Left menu: Build -> Firestore Database -> Create database
   - Start in **production mode**
   - Location: `asia-southeast1 (Singapore)` closest to PH
3. Top gear -> Project settings -> Your apps -> `</>` Web app -> nickname `teachers-day` -> Copy config
4. Open `firebase-config.js` in this folder and paste your real values.
5. In Firebase console: Firestore Database -> Rules tab -> paste contents of `firestore.rules` -> Publish.

Test: open site with `?` — status should say `💛 Shared wall • live`.

Security: anyone can read/post max 300 chars, no edit/delete. Enough for class project. For anti-spam, enable App Check later.

## Host on GitHub Pages (simple)

```
cd happy-teachers-day-website
git init
git add .
git commit -m "Happy Teachers Day"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/happy-teachers-day-website.git
git push -u origin main
```

Then GitHub repo -> Settings -> Pages -> Deploy from branch -> `main` / `/ (root)` -> Save.
Your link: `https://YOUR_USERNAME.github.io/happy-teachers-day-website/`

Share that link to classmates + teacher — all messages sync live.

## Files
- `index.html` - site
- `styles.css` - muted yellow theme
- `script.js` - Firebase + localStorage fallback logic
- `firebase-config.js` - paste your keys here
- `firestore.rules` - copy to Firebase console
- `images/puno-ng-saging-*.jpg` - banana tree photos
