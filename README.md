# Nabeel weds Zainab · A Celebration of Love

A mobile-first Pakistani wedding invitation built with React, Vite, TypeScript, React Router, Framer Motion, Tailwind CSS v4, and Lucide icons. No Git required.

## Run

```sh
npm install
npm run dev
```

Production: `npm run build`. Preview: `npm run preview`. Configuration tests: `npm test`.

## Sample invitations

| URL | Guest | Events |
| --- | --- | --- |
| `/` or `/invite/guest-001` | Muhammad Arslan | Mehandi, Barat, Walima |
| `/invite/muhammad-arslan` | Muhammad Arslan | Mehandi, Barat, Walima |
| `/invite/guest-002` | Ahmed Khan | Walima only |
| `/invite/guest-003` | Ayesha & Family | Barat, Walima |
| `/invite/guest-004` | Dear Guest & Family | Barat only |

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
  events: ['barat'],
  message: 'We look forward to celebrating with you.',
},
```

Use `['walima']` for Walima only, `['barat']` for Barat only, or `['mehandi', 'barat', 'walima']` for all three. Combinations such as `['barat', 'walima']` also work; keep events in chronological order and assign at least one valid event.

Rebuild and redeploy after editing guests, then send each guest their own link: `https://YOUR-SITE/invite/your-unique-guest-id`. Unassigned events are absent from their cards, timeline, and venue selector. There is no guest management dashboard or login.

## Privacy

The invitation does not collect RSVPs or guest messages.

URL-based frontend filtering is presentation, not authorization; bundled sample guest data is public. Guests can access another invitation if they obtain or guess its ID, and the home page shows an all-event sample invitation. Unique IDs reduce accidental mix-ups but do not prevent access. Do not add sensitive guest details to this frontend. Enforcing event access requires backend authorization; verifying the recipient also requires authentication.

## Music, motion, assets

Music is an original soft pentatonic instrumental generated locally with Web Audio. It starts by default when the guest clicks either opening-envelope control, requires no remote audio, and can be paused or resumed with the music button. Starting directly from the opening click respects browser user-gesture requirements. If the browser cannot start audio, an explicit error is displayed and the guest can retry with the music button.

The botanical and Mughal arch artwork is inline original SVG. Reception photography loads from Unsplash; typography loads from Google Fonts, with local serif/sans-serif fallbacks. Replace remote assets with self-hosted licensed assets if offline operation is required.

Reduced-motion preferences disable floating particles, parallax, animated reveals, and smooth scrolling. The envelope has a keyboard-accessible opening button. The main invitation is inert until opened.

### Readability and low-vision support

The default reading size is 18px with the browser's standard 16px setting. Body copy, event dates, times, addresses, and directions use relative `rem` sizes; secondary labels are at least 16.2px. Headings use Georgia for clearer letterforms. Text uses darker green/brown on light backgrounds and light cream on dark backgrounds instead of pale gold for essential information.

Cards, dates, navigation, and venue tabs wrap as text grows. The opening screen scrolls on short displays, names can wrap, and browser zoom is not restricted. Controls have at least 48px height, links to directions are underlined, and keyboard focus has a contrasting outline. Reduced-motion and Windows forced-colors preferences remain supported.

After opening, Lenis adds gently eased wheel scrolling and animated navigation between sections. Touch scrolling remains native. A thin gold progress line tracks the page, and sections rise softly into view. Lenis is destroyed on unmount or when reduced motion is enabled, restoring native scrolling.

## Hosting

Deploy the generated `dist` folder to a static host. Configure SPA fallback to `index.html` so direct `/invite/:guestId` visits work. Set the final site's canonical URL and social-sharing metadata before sending links.
