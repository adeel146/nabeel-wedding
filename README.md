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

Unknown invitations show an explicit invalid-link screen rather than another guest's invitation.

## Personalize

Edit `src/config.js` for names, guest IDs, assigned events, personalized messages, event dates, venues, addresses, and dress notes. Sample celebrations take place December 4–6, 2026 in Lahore. All event timestamps include Pakistan's UTC+05:00 offset, and displayed dates use the Asia/Karachi timezone. Countdown targets the guest's first assigned event and stops at zero.

The invitation celebrates Nabeel Akram and Zainab. Mehandi is at Paragon City Lahore; Barat is at House # 428, Imperial Garden, Paragon City, Lahore; Walima is at Marabele Hall, Garrison, Lahore. Dates and times remain sample values until confirmed.

Every event surface—cards, timeline, venue tabs, hero dates, and countdown—uses the same guest-filtered event list.

## Privacy

The invitation does not collect RSVPs or guest messages.

URL-based frontend filtering is presentation, not authorization; bundled sample guest data is public. Do not add sensitive guest details to this frontend.

## Music, motion, assets

Music is an original soft pentatonic instrumental generated locally with Web Audio. It starts only after an explicit button click, requires no remote audio, and can be paused. The opening envelope never starts audio.

The botanical and Mughal arch artwork is inline original SVG. Reception photography loads from Unsplash; typography loads from Google Fonts, with local serif/sans-serif fallbacks. Replace remote assets with self-hosted licensed assets if offline operation is required.

Reduced-motion preferences disable floating particles, parallax, animated reveals, and smooth scrolling. The envelope has a keyboard-accessible opening button. The main invitation is inert until opened.

## Hosting

Deploy the generated `dist` folder to a static host. Configure SPA fallback to `index.html` so direct `/invite/:guestId` visits work. Set the final site's canonical URL and social-sharing metadata before sending links.
