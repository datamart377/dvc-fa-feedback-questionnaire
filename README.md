# Stakeholder Feedback Questionnaire — Office of the DVC (F&A)

An online Quarter One stakeholder feedback questionnaire for Makerere University,
Office of the Deputy Vice Chancellor (Finance & Administration). Responses are
recorded directly in a Google Sheet.

## Files
| File | Purpose |
|------|---------|
| `Index.html` | The questionnaire form (served by Google Apps Script). |
| `Code.gs` | Apps Script server code — records each submission as a row in the sheet. |
| `DEPLOYMENT_GUIDE.md` | Step-by-step setup and deployment instructions. |

## Deploy
See **DEPLOYMENT_GUIDE.md**. In short: create a Google Sheet →
Extensions → Apps Script → paste `Code.gs` and `Index.html` → Deploy as a web app.

> **Note:** `Index.html` uses `google.script.run` and is designed to run **inside
> Google Apps Script**, which supplies its Google Sheets backend. Hosting the raw
> file on GitHub Pages will display the form but will not submit to the sheet
> unless the submission mechanism is switched to a fetch-based Apps Script
> endpoint.
