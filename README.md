# Save the Date

A mobile-friendly static website for GitHub Pages. No installation, build step, backend, credentials, or paid domain is needed. Guest addresses are submitted directly to Google Forms and stored in your private Google Sheet, never in this repository.

## 1. Customize

Edit `settings.js` in any text editor, or use GitHub's pencil icon after uploading:

- `names`: your names.
- `date`: the actual wedding date as `YYYY-MM-DD`, for example `2027-05-22`. Blank by default so guests cannot accidentally save an invented date. A valid date enables both calendar options.
- `dateLabel`: the placeholder displayed while `date` is blank.
- `location` and `message`: text shown to guests.
- `photos`: optional foreground photos. Put image files in `assets/`, then add entries such as `{ src: "assets/our-photo.jpg", alt: "Luke and Julia in the mountains" }`. Add an optional `caption` if wanted. Up to four photos are shown.
- `formUrl`: the published Google Form responder link.
- `formEmbedUrl`: optional Google Forms embed URL. Leave blank for a simple button. If used, the separate button remains available as a fallback.

Colors and fonts are at the top of `styles.css`. Page layout and labels are in `index.html`. Calendars create an all-day save-the-date reminder with no invented ceremony time; `.ics` supports Apple Calendar and Outlook. Google Calendar opens a prefilled event that the guest must save.

## 2. Create the address form

1. Open https://forms.google.com and create a blank form called **Wedding mailing address**. Description: “Please share one mailing address per household so we can send your invitation.”
2. Add short-answer questions: **Full name** (required), **Partner / household names** (optional), **Street address** (required), **Apartment / unit** (optional), **City** (required), **State / province / region** (optional for international guests), **ZIP / postal code** (optional for countries without one), **Country** (required), and **Email** (optional). Postal codes should be text, not numbers, to preserve leading zeros and international formats.
3. In Settings, avoid “Limit to 1 response” and verified email collection if guests should not need a Google login. Keep response summaries hidden from respondents. Do not publish the response Sheet.
4. Set the confirmation message to **Thank you! We've received your mailing address. We can't wait to celebrate with you.**
5. In **Responses → Link to Sheets**, create a new spreadsheet.
6. Publish the form, make responder access available to **Anyone with the link**, and copy the responder link into `formUrl` in `settings.js`. Use the `/viewform` or `forms.gle` link, not `/edit`. Workspace policies may restrict external guests; check while signed out.
7. Optional: use Google's Embed HTML option and copy only the iframe's `src` URL into `formEmbedUrl`.
8. Open the site in a private browser window, submit a clearly labeled test household, and check that one row appears in the Sheet. Delete that test response from both the form and Sheet afterward.

Google Forms displays the submission confirmation itself. This website does not claim to have received an address or track whether the guest submitted. The form must actually be published and accepting responses.

## 3. Publish on GitHub Pages (no terminal needed)

1. Sign in to https://github.com/new and create a **public** repository named `save-the-date`. Choose **Add a README** to initialize it.
2. In the repository, choose **Add file → Upload files**. Upload `index.html`, `styles.css`, `settings.js`, and `app.js` from this folder directly into the repository root, then commit. Upload `.nojekyll` too if your file picker shows hidden files; this plain site also works without it. Do not upload the ZIP itself or nest the site inside another folder.
3. Go to **Settings → Pages**. Set Source to **Deploy from a branch**, choose **main** and **/ (root)**, then Save.
4. Wait for GitHub's deployment (it can take up to 10 minutes). The Pages screen shows the published URL, normally `https://YOUR-USERNAME.github.io/save-the-date/`. Text that link to guests after the checks below.

Edits committed to `main` automatically republish. The repo and website are public, so only put guest-facing wedding details here. `noindex` asks search engines not to index the page; it does not make the page private.

## Before texting the link

- Replace placeholder names, date, and location.
- Test on your phone; open both calendar options and verify the day and location before saving.
- Open the address form while signed out, submit a test, and verify it reaches your Sheet.
- If embedding, also check the separate form button.

## Preview locally

Open `index.html` directly in your browser. For a local web preview, run `python3 -m http.server 8000` in this folder and visit `http://localhost:8000`.

## Take it down later

Use **Settings → Pages → Unpublish site**. Also stop accepting responses in Google Forms. Your response Sheet remains in Google Drive; removing the website does not remove the form or its data.

## Official help

- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Publish/share Google Forms: https://support.google.com/docs/answer/2839588?hl=en
- Link responses to Sheets: https://support.google.com/docs/answer/2917686?hl=en
