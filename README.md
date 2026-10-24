# Nabeel weds Zainab · A Celebration of Love

A mobile-first Pakistani wedding invitation built with React, Vite, TypeScript, React Router, Framer Motion, Tailwind CSS v4, and Lucide icons. No Git required.

## Run

```sh
npm install
npm run dev
```

Production: `npm run build`. Preview: `npm run preview`. Configuration tests: `npm test`.

## Guest invitations

The roster contains 60 members with their supplied event assignments and invitation sizes: 36 use unique last-four-phone-digit IDs and 24 use temporary name-based IDs.

| URL | Guest | Invitation |
| --- | --- | --- |
| `/invite/2909` | Muhammad Sarfraz | All three events, with family |
| `/invite/3232` | Bashir | Barat and Walima, 1 person each; no Mehandi |
| `/invite/6683` | Muhammad Yousaf | Barat and Walima, 2 persons each; no Mehandi |
| `/invite/9561` | Palwasha Asim Sethi | Mehandi and Walima with family; Barat, 2 persons |
| `/invite/temp-bushra` | Bushra | All three events, 2 persons each |
| `/invite/temp-muhammad-arslan` | Muhammad Arslan | All three events, with family |

The home page, `/invite/guest-001`, and `/invite/muhammad-arslan` remain aliases for Muhammad Arslan's invitation.

Unknown invitations show an explicit invalid-link screen rather than another guest's invitation.

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

Rebuild and redeploy after editing guests, then send each guest their own link: `https://YOUR-SITE/invite/your-unique-guest-id`. Unassigned events are absent from their cards, timeline, and venue selector. There is no guest management dashboard or login.

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

When a number is available, rename that member's key in `guests` to its last four digits, quoted as a string to preserve leading zeros. Check that no other member already uses that ending; otherwise keep the distinct temporary ID until a unique number is provided. Leave their name, events, and sizes unchanged. Update the roster test expectations and this table, rebuild, redeploy, and send the new link. Previously sent temporary links stop working after renaming unless explicitly retained as aliases. For Muhammad Arslan, also update the canonical target in `getGuest` so the home page and legacy aliases continue to work.

Samina at `/invite/2915` (with family) and Samina at `/invite/temp-samina` (2 persons) are separate invitations. Likewise, Muhammad Shafique at `/invite/4226` (with family) and Muhammad shafique at `/invite/6664` (Barat and Walima, 2 persons) remain separate.

## Private WhatsApp sending page

Run `npm run whatsapp`, then open **http://127.0.0.1:5180** on this computer. This is a separate localhost-only tool, not a route on the public invitation site, and it does not need the Vite development server.

1. Review the **published invitation website home URL**, which defaults to **https://nabeel-wedding.netlify.app**. You can change it if needed. An empty previously saved URL also uses this default; an existing non-empty saved URL is preserved. Localhost links are rejected because guests cannot open your computer's preview.
2. Review the editable message, keeping `{name}` and `{link}`. Every guest gets their own name and invitation ID; the page shows their event allowances and a message preview.
3. Check each phone number. Pakistan mobile numbers starting `03` are converted to international `92` format; other countries need their country code. Shared phone numbers are flagged, not merged.
4. Click **Send on WhatsApp** for a guest. WhatsApp opens with their phone number and personalized message. Review it and press **Send inside WhatsApp** yourself.
5. After actually sending, check **I have sent this**. Opening a chat is tracked separately and never automatically marked sent. Search and filters help work through the list; previously marked invitations prompt before opening again.

No WhatsApp API, API fees, background sending, or unofficial account automation is used. A WhatsApp account and WhatsApp Web or the installed app are still needed. Clicking a link cannot verify delivery.

The optional **`whatsapp-contacts.local.json`** file in the project root maps invitation IDs to full phone-number strings. The local copy is populated with the 46 provided numbers; 14 guests have no number yet. It is ignored by Git, blocked by Vite's file-serving rules, and not imported into the production app. A fresh checkout will not contain it; the page still works by entering numbers manually. An invalid private file produces a terminal error instead of silently discarding contacts. Restart the tool after editing that file. If invitation IDs change, update its keys too.

Phone edits made on the page, the site URL, message, and manually marked sent statuses are saved in this browser's local storage at this exact local address; they do not modify the contacts file or the public roster. Browser data can be cleared or lost, and using another browser, hostname, or port starts separate progress. Do not use this page on a shared browser profile. Storage failures are shown explicitly. Keep a separate private backup of contact updates if needed.

Keep the contacts file, browser data, and this local server private. Do not expose the tool through a tunnel or public reverse proxy. Deploy **only `dist`**, never the repository root. The public site has no sending dashboard or phone numbers. For a different local port, set `WHATSAPP_PORT` before running the tool.

## Privacy

The invitation does not collect RSVPs or guest messages.

URL-based frontend filtering is presentation, not authorization; bundled guest names and invitation assignments are public. Guests can access another invitation if they obtain or guess its ID, and the home page shows Muhammad Arslan's all-event invitation. Four-digit and temporary IDs are guessable: they distinguish invitations but do not prevent access. Do not add sensitive guest details to this frontend. Enforcing event access requires backend authorization; verifying the recipient also requires authentication.

## Music, motion, assets

Music is an original soft pentatonic instrumental generated locally with Web Audio. It starts by default when the guest clicks either opening-envelope control, requires no remote audio, and can be paused or resumed with the music button. Starting directly from the opening click respects browser user-gesture requirements. If the browser cannot start audio, an explicit error is displayed and the guest can retry with the music button.

The botanical and Mughal arch artwork is inline original SVG. Reception photography loads from Unsplash; typography loads from Google Fonts, with local serif/sans-serif fallbacks. Replace remote assets with self-hosted licensed assets if offline operation is required.

Font sizes are 21% larger than the original design after two successive 10% increases, including responsive sizes. Original font families, colors, and spacing are retained.

Reduced-motion preferences disable floating particles, parallax, animated reveals, and smooth scrolling. The envelope has a keyboard-accessible opening button. The main invitation is inert until opened.

After opening, Lenis adds gently eased wheel scrolling and animated navigation between sections. Touch scrolling remains native. A thin gold progress line tracks the page, and sections rise softly into view. Lenis is destroyed on unmount or when reduced motion is enabled, restoring native scrolling.

## Hosting

Deploy the generated `dist` folder to a static host. Configure SPA fallback to `index.html` so direct `/invite/:guestId` visits work. Set the final site's canonical URL and social-sharing metadata before sending links.
