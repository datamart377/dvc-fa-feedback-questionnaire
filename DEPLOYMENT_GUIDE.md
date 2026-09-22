# Stakeholder Feedback Questionnaire — setup guide

This turns your Word questionnaire into an online form with a shareable link.
Every submission lands as one row in a Google Sheet you own. No external
hosting, no third-party service — it runs entirely inside your Google account
via Google Apps Script.

You have two files:
- **Code.gs** — the server logic (writes responses to the sheet)
- **Index.html** — the form people fill in

## One-time setup (about 5 minutes)

### 1. Create the spreadsheet
1. Go to **https://sheets.google.com** and create a **new blank spreadsheet**.
2. Rename it something like *DVC (F&A) Q1 Feedback — Responses*.

### 2. Open the bound Apps Script project
1. In that spreadsheet, click **Extensions → Apps Script**.
2. A script editor opens. It is already tied to this spreadsheet.

### 3. Add the code
1. In the editor you'll see a file called **Code.gs** with a default
   `myFunction`. Delete everything in it and paste the entire contents of the
   **Code.gs** file provided.
2. Click the **+** next to "Files" → **HTML**. Name it exactly **`Index`**
   (no extension — the editor adds `.html`). Delete its default contents and
   paste the entire contents of the **Index.html** file provided.
3. Click the **Save** icon (💾).

### 4. Deploy as a web app
1. Click **Deploy → New deployment**.
2. Click the gear ⚙ next to "Select type" and choose **Web app**.
3. Fill in:
   - **Description:** e.g. `Q1 feedback form`
   - **Execute as:** **Me** (your account) — so responses always write to your sheet.
   - **Who has access:**
     - **Anyone** — anyone with the link can respond without signing in (best for wide, anonymous distribution), **or**
     - **Anyone within [your organisation]** — only signed-in colleagues in your Google Workspace domain.
4. Click **Deploy**.
5. The first time, Google asks you to **authorise**. Click **Authorize access**,
   pick your account, and on the "Google hasn't verified this app" screen click
   **Advanced → Go to [project name] (unsafe)** → **Allow**. (This warning is
   normal for your own scripts; it only means the script isn't publicly
   registered with Google.)
6. Copy the **Web app URL** it gives you. That link is your questionnaire —
   share it by email, QR code, or intranet.

A **`Responses`** tab is created in your spreadsheet automatically, with a
header row, the first time someone submits (or run the `setupSheet` function
once from the editor to create it up front).

## Sharing tips
- Paste the web-app URL into an email or generate a QR code from it.
- You can watch responses arrive live in the `Responses` tab.

## Updating the form later
If you change **Code.gs** or **Index.html**, click **Deploy → Manage
deployments → (edit ✏) → Version: New version → Deploy**. The **same URL keeps
working** — you don't need to re-share it.

## The Makerere crest
The official crest (taken from your Word document) is **already embedded** in
Index.html and appears in both top corners on a gold-ringed disc. Nothing to do.

If you ever want to swap in a higher-resolution version:
1. Convert the new crest PNG to a base64 **data URI** (any "image to base64"
   tool, or re-share it in the chat and it can be embedded for you).
2. In **Index.html**, find `var LOGO_SRC = "data:image/png;base64,..."` near the
   bottom and replace the value with the new data URI.
3. Save and redeploy (Deploy -> Manage deployments -> New version).

## Notes
- **Time zone:** the timestamp uses the spreadsheet's time zone. Set it in the
  script editor under **Project Settings → Time zone** (choose *Africa/Kampala*)
  if needed.
- **Anonymity:** the form never captures the respondent's Google identity or
  email; only what they type is stored, and the Name field is optional — so
  anonymous responses stay anonymous.
- **Required fields:** only *Unit/Office* and *Designation/Role* are required;
  everything else can be left blank, matching the "select N/A / omit" spirit of
  the paper form.
- **Column order** in the sheet is controlled by the `FIELDS` list at the top of
  Code.gs — the header row and every response row are built from that same list,
  so they can never fall out of sync.
