# Nabeel weds Zainab · A Celebration of Love

A mobile-first Pakistani wedding invitation built with React, Vite, TypeScript, React Router, Framer Motion, Tailwind CSS v4, and Lucide icons. No Git required.

## Run

```sh
npm install
npm run dev
```

Production: `npm run build`. Preview: `npm run preview`. Configuration tests: `npm test`.

## Guest invitations

The roster contains 77 members with their supplied event assignments: 49 use unique last-four-phone-digit IDs and 28 use temporary name-based IDs. The 14 newly added members (Shehryar, Mehran, Sohaib, Amir, Hassan, Faraz, Hamza Aman, Faisal, Zubair, Ahad, Shahbaz, Qaiser, Ahmad Raza, and Maqbool) receive all three events with `skipPersons: true`.

| URL | Guest | Invitation |
| --- | --- | --- |
| `/invite/2909` | Muhammad Sarfraz | All three events, with family |
| `/invite/3232` | Bashir | Barat and Walima, 1 person each; no Mehandi |
| `/invite/6683` | Muhammad Yousaf | Barat and Walima, 2 persons each; no Mehandi |
| `/invite/9561` | Palwasha Asim Sethi | Mehandi and Walima with family; Barat, 2 persons |
| `/invite/temp-bushra` | Bushra | All three events, 2 persons each |
| `/invite/temp-muhammad-arslan` | Muhammad Arslan | All three events, with family |
| `/invite/9196` | Shehryar | All three events, person labels hidden |
| `/invite/temp-faraz` | Faraz | All three events, person labels hidden; phone pending |

The explicit links `/invite/guest-001` and `/invite/muhammad-arslan` remain aliases for Muhammad Arslan's invitation. The home page `/` does not open any guest's card.

Plain `/`, `/invite`, and unknown invitations show an explicit invalid-link screen rather than another guest's invitation. Explicit no-guest option links open a generic invitation as described below.

## Personalize

Edit `src/config.js` for names, guest IDs, assigned events, personalized messages, event dates, venues, addresses, and dress notes. Mehandi is November 13, Barat is November 14, and Walima is November 15, 2026 in Lahore. All event timestamps include Pakistan's UTC+05:00 offset, and displayed dates use the Asia/Karachi timezone. Countdown targets the guest's first assigned event and stops at zero.

The invitation celebrates Nabeel Akram and Zainab. Mehandi is at Paragon City Lahore; Barat is at House # 428, Imperial Garden, Paragon City, Lahore; Walima is at Marabele Hall, Garrison, Lahore. Barat Sehra Bandi is at 5:00 PM, with Barat departure at 6:00 PM on November 14. The Barat countdown targets Sehra Bandi. Walima directions use the supplied Marabelle Maps link: https://maps.app.goo.gl/g8eirmLg1vf3ecKm8. Mehandi and Walima times remain sample values until confirmed.

Every event surface—cards, timeline, venue tabs, hero dates, and countdown—uses the same guest-filtered event list.

### Sending invitations to multiple guests

Add one entry per guest or family to the `guests` object in `src/config.js`, using a unique ID and the appropriate event list:

```js
'your-unique-guest-id': {
  name: 'Your guest name',
  events: ['barat', 'walima'],
  partySize: { barat: 2, walima: 'family' },
  message: 'We look forward to celebrating with you.',
},
```

Use `['walima']` for Walima only, `['barat']` for Barat only, or `['mehandi', 'barat', 'walima']` for all three. Combinations such as `['barat', 'walima']` also work; keep events in chronological order and assign at least one valid event.

Set `partySize` separately for each guest and event: a positive whole number such as `2` displays "2 persons", `1` displays "1 person", and `'family'` displays "With family". These are the total invited persons for that event, not extra plus-ones. The roster uses the supplied invitation sizes; the code snippet above is only an example. For an event marked "no", omit it from both `events` and `partySize`; do not use zero. Omitted sizes show no count, rather than assuming a number or a family invitation. Invalid sizes raise an explicit configuration error.

Invitation sizes appear on the assigned event cards, schedule, and selected venue details. They do not grant access to unassigned events or enforce attendance limits.

To hide the person/family label for a specific guest across all their assigned events, add `skipPersons: true` to that guest in `src/config.js`:

```js
'your-unique-guest-id': {
  name: 'Your guest name',
  events: ['barat', 'walima'],
  partySize: { barat: 2, walima: 'family' },
  skipPersons: true,
  message: 'We look forward to celebrating with you.',
},
```

This hides both numeric counts and "With family" on the invitation and WhatsApp sender event preview, without changing event assignments or stored party sizes. Omit `skipPersons` or set it to `false` to show the labels again. Use a boolean, not the string `'true'`; invalid sizes still raise configuration errors even when labels are hidden. To hide a size for only one event, omit that event's entry from `partySize` instead.

Rebuild and redeploy after editing guests, then send each guest their own link: `https://YOUR-SITE/invite/your-unique-guest-id`. Unassigned events are absent from their cards, timeline, and venue selector. The sender dashboard below does not edit guest assignments.

### Hide guest personalization through the invitation URL

Append `?skipPersonalization=true` to an existing invitation link:

```text
https://YOUR-SITE/invite/3232?skipPersonalization=true
```

This single option hides the guest's name (including "Especially for" and the personalized header), their personal message, and all person/family labels on the invitation. The greeting uses generic invitation wording instead. On a guest link, only that guest's assigned events are shown. Existing guest configuration and the WhatsApp sender message/preview are unchanged.

Only the exact value `true` enables this mode. Remove the parameter or use `skipPersonalization=false` to restore normal personalization; a configured `skipPersons: true` continues to hide person labels. If the link already has query parameters, append `&skipPersonalization=true`.

### Hide selected events through the invitation URL

Use `hideEvents` with one event ID or a comma-separated list:

```text
https://YOUR-SITE/invite/2909?hideEvents=mehandi
https://YOUR-SITE/invite/2909?hideEvents=barat,walima
https://YOUR-SITE/invite/2909?skipPersonalization=true&hideEvents=mehandi,barat
```

Event IDs are `mehandi`, `barat`, and `walima`. Hidden events are removed from cards, schedule, venue tabs, hero dates, and the countdown selection. The countdown targets the first remaining assigned event. Repeated parameters (such as `hideEvents=mehandi&hideEvents=barat`) also work; surrounding spaces and case are ignored. Unknown or empty values have no effect.

This only hides events already assigned to the guest; it never grants other events or changes saved configuration. Removing the parameter restores their assigned events. If every assigned event is hidden, the page displays "No events to display" instead of an invitation with an invalid countdown.

### Generic invitations without a guest ID

Both standard query links and path-style option links are supported:

```text
https://nabeel-wedding.vercel.app/?skipPersonalization=true
https://nabeel-wedding.vercel.app/skipPersonalization=true
https://nabeel-wedding.vercel.app/?hideEvents=barat
https://nabeel-wedding.vercel.app/hideEvents=barat
https://nabeel-wedding.vercel.app/?skipPersonalization=true&hideEvents=mehandi,barat
https://nabeel-wedding.vercel.app/skipPersonalization=true&hideEvents=mehandi,barat
```

These links start with all three events and always hide guest names, personalized messages, and person/family labels, including when only `hideEvents` is supplied. They do not use any roster member's identity. `hideEvents` removes selected events throughout the page; hiding all three shows "No events to display". Plain `/` without these options remains an invalid-link screen, as do unknown guest IDs and unrelated paths.

### Temporary IDs awaiting phone numbers

Full phone numbers are not stored in the public guest configuration. Shared endings cannot identify separate invitations, so every member with a shared or missing number has a distinct `temp-...` ID. The shared numeric IDs `8135`, `2256`, and `1325` do not resolve to an invitation.

| Member | Temporary ID | Reason |
| --- | --- | --- |
| Muhammad Arslan | `temp-muhammad-arslan` | Shared ending 8135 |
| Muhammad Ashfaq | `temp-muhammad-ashfaq` | Shared ending 8135 |
| Muqaddas Bibi | `temp-muqaddas-bibi` | Shared ending 2256 |
| Hassan Javaid | `temp-hassan-javaid` | Shared ending 2256 |
| Bushra | `temp-bushra` | Shared ending 1325 |
| Tallat | `temp-tallat` | Shared ending 1325 |
| Sakina | `temp-sakina` | Shared ending 1325 |
| Samina (2 persons per event) | `temp-samina` | Shared ending 1325 |
| Rahat | `temp-rahat` | Shared ending 1325 |
| Shafqat | `temp-shafqat` | Shared ending 1325 |
| Muhammad Idrees | `temp-muhammad-idrees` | Number missing |
| Rabia Basri | `temp-rabia-basri` | Number missing |
| Haji Younas | `temp-haji-younas` | Number missing |
| Muhammad Javaid Younas | `temp-muhammad-javaid-younas` | Number missing |
| Riffat | `temp-riffat` | Number missing |
| Khurshid | `temp-khurshid` | Number missing |
| Liaqat Ali | `temp-liaqat-ali` | Number missing |
| Mehmood Ahmed | `temp-mehmood-ahmed` | Number missing |
| Nagina | `temp-nagina` | Number missing |
| Abdul Shakoor | `temp-abdul-shakoor` | Number missing |
| Ali Raza | `temp-ali-raza` | Number missing |
| Fayaz | `temp-fayaz` | Number missing |
| Ijaz | `temp-ijaz` | Number missing |
| Rauf | `temp-rauf` | Number missing |
| Saeed | `temp-saeed` | Number missing |
| Naeem | `temp-naeem` | Number missing |
| Jara | `temp-Jara` | Number missing |
| Faraz | `temp-faraz` | Supplied number incomplete; private contact left blank |

When a number is available, rename that member's key in `guests` to its last four digits, quoted as a string to preserve leading zeros. Check that no other member already uses that ending; otherwise keep the distinct temporary ID until a unique number is provided. Leave their name, events, and sizes unchanged. Update the roster test expectations and this table, rebuild, redeploy, and send the new link. Previously sent temporary links stop working after renaming unless explicitly retained as aliases. For Muhammad Arslan, also update the canonical target in `getGuest` so the explicit legacy aliases continue to work.

Samina at `/invite/2915` (with family) and Samina at `/invite/temp-samina` (2 persons) are separate invitations. Likewise, Muhammad Shafique at `/invite/4226` (with family) and Muhammad shafique at `/invite/6664` (Barat and Walima, 2 persons) remain separate.

## Private WhatsApp sending page

Run `npm run whatsapp`, then open **http://127.0.0.1:5180** on this computer. This is a separate localhost-only tool that does not need the Vite development server. For password-protected mobile access on Vercel, use the production setup below.

1. Review the **published invitation website home URL**, which defaults to **https://nabeel-wedding.vercel.app**. You can change it if needed. Empty saved URLs and the previous Netlify default automatically use this address; other custom saved URLs are preserved. Localhost links are rejected because guests cannot open your computer's preview.
2. Review the editable message, keeping `{name}` and `{link}`. Every guest gets their own name and invitation ID; the page shows their event allowances and a message preview.
3. Check each phone number. Pakistan mobile numbers starting `03` are converted to international `92` format; other countries need their country code. Shared phone numbers are flagged, not merged.
4. Click **Send on WhatsApp** for a guest. WhatsApp opens with their phone number and personalized message. Review it and press **Send inside WhatsApp** yourself.
5. After actually sending, check **I have sent this**. Opening a chat is tracked separately and never automatically marked sent. Search and filters help work through the list; previously marked invitations prompt before opening again.

No WhatsApp API, API fees, background sending, or unofficial account automation is used. A WhatsApp account and WhatsApp Web or the installed app are still needed. Clicking a link cannot verify delivery.

The optional **`whatsapp-contacts.local.json`** file in the project root maps invitation IDs to full phone-number strings. The local copy is populated with the 46 provided numbers; 14 guests have no number yet. It is ignored by Git, blocked by Vite's file-serving rules, and not imported into the production app. A fresh checkout will not contain it; the page still works by entering numbers manually. An invalid private file produces a terminal error instead of silently discarding contacts. Restart the tool after editing that file. If invitation IDs change, update its keys too.

Phone edits made on the page, the site URL, message, and manually marked sent statuses are saved in this browser's local storage at this exact local address; they do not modify the contacts file or the public roster. Browser data can be cleared or lost, and using another browser, hostname, or port starts separate progress. Do not use this page on a shared browser profile. Storage failures are shown explicitly. Keep a separate private backup of contact updates if needed.

Keep the contacts file, browser data, and this local server private. Do not expose the local tool through a tunnel or public reverse proxy. For a different local port, set `WHATSAPP_PORT` before running the tool.

### Password-protected Vercel dashboard (mobile and desktop)

The existing Vercel project can serve **https://nabeel-wedding.vercel.app/whatsapp** alongside the invitations. No separate deployment or database is required. The Node function in `api/whatsapp.js` checks the password on the server, issues an eight-hour Secure/HttpOnly/SameSite session cookie, and requires it for the dashboard and contacts API. The login page and stylesheet contain no contacts or password.

Before deploying, add these **server-only environment variables** in **Vercel > Project Settings > Environment Variables**, selecting Production (and Preview only if needed):

| Variable | Value |
| --- | --- |
| `WHATSAPP_PASSWORD` | Your chosen shared password. Do not put it in source code. |
| `WHATSAPP_SESSION_SECRET` | A random secret of at least 32 characters, separate from the password. Generate one with the command below. |
| `WHATSAPP_CONTACTS_JSON` | Paste the contents of your private `whatsapp-contacts.local.json` file: an object mapping canonical guest IDs to phone-number strings. Use `{}` only if intentionally entering every number manually. |

Generate the session secret locally:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Never prefix these variables with `VITE_`, commit their values, or add contacts to `public`/`dist`. Vercel holds the contacts privately; the function returns them only after successful sign-in. Missing password/session configuration blocks access. If `WHATSAPP_CONTACTS_JSON` is missing, authenticated users still receive every configured guest and the default message, with empty server phone fields and an explicit warning to configure contacts or enter numbers manually. Invalid contacts JSON still produces an explicit error rather than silently discarding data. Contact environment-variable changes require a redeployment, as do password or session-secret changes; rotating either invalidates existing session cookies.

Deploy the repository through the existing Vercel Vite project, keeping **dist** as the static output. Vercel also packages the Node API and the explicitly listed sender assets in `vercel.json`. Do not copy the entire repository into a public static folder. A `dist`-only upload to a non-Vercel static host does **not** include this dashboard. `npm run dev` and `npm run preview` do not emulate Vercel Functions; `npm run whatsapp` continues to provide the original local sender without authentication.

On mobile, open `/whatsapp`, enter the password, tap **Send on WhatsApp**, and press **Send inside WhatsApp**. All authorized users share the same read-only server contacts, but edits, message settings, and marked-sent progress remain **browser-local**, not synchronized across devices. Use a trusted browser profile. **Sign out and clear saved browser data** removes that browser's sender settings and phone edits and expires its cookie; it does not revoke other devices' sessions. The server contacts remain available at the next sign-in.

On a fresh browser or after signing out, production automatically fills the same default message as the local sender: an Assalamualaikum greeting using `{name}`, the couple's names, and the personal invitation `{link}`. The website URL defaults to `https://nabeel-wedding.vercel.app`. No message environment variable is required. Existing custom message settings saved in that browser take precedence; they do not sync from your laptop to your phone.

Before making this internet-facing, configure a **Vercel Firewall rate-limit rule for POST `/whatsapp/login` and POST `/api/whatsapp`** to deter password guessing (for example, ten attempts per IP per minute, subject to your plan's available controls). The application does not claim a durable, cross-instance login rate limiter; in-memory limits would not be reliable on serverless infrastructure. Use a strong, unique shared password; anyone who knows it can view all contacts. Password protection applies only to the sender, not the already-public invitation roster.

After deployment, verify in a private browser that `/whatsapp` shows sign-in, `/whatsapp/api/guests` returns 401 without a session, and correct sign-in loads contacts on mobile. Incorrect passwords must not reveal guest data. Check that signing out blocks subsequent API access. HTTPS is required for the session cookie.

### Adding guests and phone numbers later

Both senders build their guest JSON from **every entry in `guests` in `src/config.js`**, not just IDs with phone numbers. A new configured guest appears automatically after redeploying, even if their number is missing. Missing numbers can be entered in the dashboard; those edits stay in that browser.

For a permanent addition:

1. Add the guest's unique ID, name, events, and numeric/family invitation sizes to `src/config.js`. A phone-number entry alone does not create a guest or an invitation.
2. Add that same ID and phone-number string to the ignored `whatsapp-contacts.local.json` file for local use, then restart `npm run whatsapp`.
3. Update `WHATSAPP_CONTACTS_JSON` in Vercel with the latest private contacts JSON for production use.
4. Push the guest configuration and redeploy, including the updated Production environment variables.

Local contacts files and browser edits are **not automatically synchronized to Vercel**. The contacts JSON can contain only guests with existing canonical IDs; unknown IDs are rejected to avoid sending the wrong invitation. Do not commit the private contacts file.

## Privacy

The invitation does not collect RSVPs or guest messages.

URL-based frontend filtering is presentation, not authorization; bundled guest names and invitation assignments are public. Missing IDs show an invalid-link screen, but guests can still access another invitation if they obtain or guess its ID. Four-digit and temporary IDs are guessable: they distinguish invitations but do not prevent access. Do not add sensitive guest details to this frontend. Enforcing event access requires backend authorization; verifying the recipient also requires authentication.

## Music, motion, assets

Music is an original soft pentatonic instrumental generated locally with Web Audio. It starts by default when the guest clicks either opening-envelope control, requires no remote audio, and can be paused or resumed with the music button. Starting directly from the opening click respects browser user-gesture requirements. If the browser cannot start audio, an explicit error is displayed and the guest can retry with the music button.

The botanical and Mughal arch artwork is inline original SVG. Reception photography loads from Unsplash; typography loads from Google Fonts, with local serif/sans-serif fallbacks. Replace remote assets with self-hosted licensed assets if offline operation is required.

Font sizes are 21% larger than the original design after two successive 10% increases, including responsive sizes. Original font families, colors, and spacing are retained.

Each event card's "View location" button matches its artwork background: olive for Mehandi, burgundy for Barat, and champagne for Walima. Labels use contrasting text, with underlining on hover and a visible keyboard-focus outline.

Reduced-motion preferences disable floating particles, parallax, animated reveals, and smooth scrolling. The envelope has a keyboard-accessible opening button. The main invitation is inert until opened.

After opening, Lenis adds gently eased wheel scrolling and animated navigation between sections. Touch scrolling remains native. A thin gold progress line tracks the page, and sections rise softly into view. Lenis is destroyed on unmount or when reduced motion is enabled, restoring native scrolling.

## Hosting

Deploy the generated `dist` folder to a static host. Configure SPA fallback to `index.html` so direct `/invite/:guestId` visits work. Set the final site's canonical URL and social-sharing metadata before sending links.

### Vercel

Use the **Vite** framework preset, build command **`npm run build`**, and output directory **`dist`**. The root `vercel.json` rewrites incoming routes to `index.html`, allowing React Router to handle direct guest links such as `https://nabeel-wedding.vercel.app/invite/4250` and page refreshes. Without this SPA fallback, Vercel returns its own `404 NOT_FOUND` before React can resolve the invitation.

Include `vercel.json` in the deployed revision and redeploy after adding or changing it; an existing deployment will not pick up local edits. Verify the guest link by opening it directly in a new tab. The home page and missing/unknown guest IDs still show the app's invalid-invitation screen, not a default guest card. The more-specific `/whatsapp` rewrites run before the invitation SPA fallback. Sender assets are packaged privately with the Node function; phone numbers come from the server-only environment variable, never the static output.
