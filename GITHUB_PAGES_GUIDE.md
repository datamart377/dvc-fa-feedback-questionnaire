# Hosting the Questionnaire on GitHub Pages — Step by Step

This guide puts the questionnaire online as a **public GitHub Pages website**
that still records every response into your **Google Sheet**.

How it works: GitHub Pages serves the form (`index.html`); when someone submits,
the page sends the answers to a small **Google Apps Script** endpoint (`Code.gs`)
which writes them to your sheet. Two pieces, one flow.

> You need **both** parts below. Part A gives you a URL that Part B's form posts to.

---

## Part A — Deploy the Google Apps Script backend (get your endpoint URL)

1. Go to **https://sheets.google.com** and create a **new blank spreadsheet**
   (or open the one you want responses in). Name it e.g. *DVC (F&A) Q1 Feedback*.
2. In the sheet: **Extensions → Apps Script**.
3. Delete the default `Code.gs` contents and paste the full **`Code.gs`** provided.
   Click **Save** (💾).
4. **Deploy → New deployment**.
   - Gear ⚙ → **Web app**.
   - **Execute as:** **Me**.
   - **Who has access:** **Anyone**  ← required so the public web page can post to it.
   - **Deploy**, then **Authorize access** (on the "Google hasn't verified this app"
     screen: **Advanced → Go to … (unsafe) → Allow** — normal for your own script).
5. Copy the **Web app URL** — it ends in **`/exec`**. This is your endpoint.
   Keep it handy for Part B, Step 1.

> A **`Responses`** tab is created automatically on the first submission.

---

## Part B — Publish the form on GitHub Pages

### 1. Paste your endpoint URL into the form
Open **`index.html`** in a text editor. Near the bottom, in the `<script>`
section, find:
```js
var SCRIPT_URL = "";
```
Put your `/exec` URL between the quotes, e.g.:
```js
var SCRIPT_URL = "https://script.google.com/macros/s/AKfy..../exec";
```
Save the file.

### 2. Make the repository public
GitHub Pages is free only on public repos. In your repo:
**Settings → General → scroll to "Danger Zone" → Change repository visibility →
Make public** → confirm.

### 3. Push the files to GitHub
If you haven't pushed yet, follow **`GITHUB_DEPLOYMENT_GUIDE.md`**. In short, from
the project folder:
```bash
git add .
git commit -m "Add GitHub Pages form (index.html) and Apps Script endpoint"
git push
```
Make sure the repo now contains **`index.html`** (lowercase) and **`Code.gs`**.

### 4. Turn on GitHub Pages
In the repo: **Settings → Pages**.
- **Source:** *Deploy from a branch*.
- **Branch:** **main**, folder **/(root)** → **Save**.
- Wait ~1 minute. GitHub shows your live URL, which will be:
  **`https://datamart377.github.io/dvc-fa-feedback-questionnaire/`**
  (it serves `index.html` automatically).

### 5. Test it
1. Open the Pages URL, fill in the form, and click **Submit feedback**.
2. You should see the thank-you screen.
3. Check the **`Responses`** tab in your Google Sheet — a new row should appear.

That's it — share the Pages URL by email, QR code, or intranet.

---

## Updating later
- **Change the form?** Edit `index.html`, then `git add . && git commit -m "..." && git push`.
  GitHub Pages redeploys automatically in about a minute (same URL).
- **Change the backend logic (`Code.gs`)?** In Apps Script: **Deploy → Manage
  deployments → edit ✏ → New version → Deploy**. The `/exec` URL stays the same,
  so you don't need to touch `index.html`.

---

## Troubleshooting
| Symptom | Fix |
|--------|-----|
| Form shows but "submission failed" | `SCRIPT_URL` is empty/wrong, or the Apps Script deployment isn't set to **Who has access: Anyone**. Re-check Part A step 4 and Part B step 1. |
| Pages URL 404s | Pages needs a minute after enabling; confirm **Branch = main**, folder **/(root)**, and that `index.html` is lowercase in the repo. |
| Responses not appearing | Open the `/exec` URL directly — it should say the endpoint is active. Re-deploy a **New version** in Apps Script; make sure you pasted its `/exec` (not `/dev`) URL. |
| "make this repository public to enable Pages" | The repo is still private — do Part B step 2. |

---

## Note on privacy
Making the **repository** public exposes the *code* (the form and `Code.gs`) —
not your responses. Responses live in your private Google Sheet. The form never
captures a respondent's Google identity, and the Name field is optional.

If you'd rather keep everything private and skip GitHub Pages entirely, you can
deploy the form directly inside Google Apps Script instead — see
`DEPLOYMENT_GUIDE.md` (uses `Index.html`, no public repo needed).
