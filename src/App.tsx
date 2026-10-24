import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, CalendarDays, Clock3, Flower2, Heart, MapPin, Menu, Music2, Pause, Sparkles, X } from 'lucide-react'
import { getGuest, getGuestEvents, mapUrl, weddingConfig } from './config'
import { ScrollEffects } from './ScrollEffects'
import { useReducedMotion } from './useReducedMotion'

type Guest = NonNullable<ReturnType<typeof getGuest>>
type WeddingEvent = (typeof weddingConfig.events)[keyof typeof weddingConfig.events]
const groomFirstName = weddingConfig.groom.split(' ')[0]
const coupleName = `${groomFirstName} weds ${weddingConfig.bride}`
const dateFormat = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Karachi' })
const dayFormat = new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: 'Asia/Karachi' })
const shortDate = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', timeZone: 'Asia/Karachi' })

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 42, scale: 0.985 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reduced ? 0 : 0.95, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}

function Ornament({ light = false }: { light?: boolean }) {
  return <div className={`ornament ${light ? 'light' : ''}`} aria-hidden="true"><span /><Flower2 size={19} strokeWidth={1} /><span /></div>
}

function MughalArch({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 560 660" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="gold" x1="0" y1="0" x2="560" y2="660"><stop stopColor="#9b7943" /><stop offset=".45" stopColor="#ead69c" /><stop offset="1" stopColor="#9b7943" /></linearGradient>
      <pattern id="jali" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M22 0 44 22 22 44 0 22Z M0 0 44 44 M44 0 0 44" stroke="#c9af73" strokeWidth=".55" opacity=".24" /><circle cx="22" cy="22" r="6" stroke="#c9af73" strokeWidth=".5" opacity=".22" /></pattern>
    </defs>
    <path d="M30 655V274C30 183 92 144 149 130C154 78 222 78 280 15C338 78 406 78 411 130C468 144 530 183 530 274V655" fill="url(#jali)" stroke="url(#gold)" strokeWidth="1.4" />
    <path d="M43 655V279C43 192 102 155 163 143C164 92 228 94 280 32C332 94 396 92 397 143C458 155 517 192 517 279V655" stroke="url(#gold)" strokeWidth=".7" />
    <path d="M16 655V268C16 175 75 131 136 117C145 65 211 63 280 0C349 63 415 65 424 117C485 131 544 175 544 268V655" stroke="url(#gold)" strokeWidth=".5" opacity=".5" />
    <path d="M56 655V285C56 205 115 166 175 155C176 111 237 106 280 52C323 106 384 111 385 155C445 166 504 205 504 285V655" stroke="url(#gold)" strokeWidth=".5" opacity=".5" />
    {[0, 1].map(side => <g key={side} transform={side ? 'translate(560 0) scale(-1 1)' : ''} stroke="url(#gold)" strokeWidth=".8">
      <path d="M30 650C95 602 103 559 80 518C63 489 87 462 114 462C146 462 155 499 133 511C114 523 96 501 111 492M31 619C68 603 74 579 64 555M31 577C59 550 51 523 32 512M78 548C115 552 132 536 139 519" />
      <path d="M30 651C101 643 153 610 160 567C165 534 189 528 206 539C229 554 213 584 196 579C180 574 186 556 196 560M98 630C109 600 128 584 153 584M137 610C166 617 186 602 188 582" />
      <path d="M25 330C7 315 6 293 18 283M30 359C54 341 51 322 37 318M30 403C10 389 7 368 20 357" />
      <circle cx="111" cy="492" r="4" /><circle cx="196" cy="560" r="4" />
    </g>)}
    <g stroke="url(#gold)" strokeWidth=".8"><path d="M280 73v33m-13-17 13 14 13-14M280 114l-8 11 8 11 8-11Z" /><path d="M220 193h120M247 202h66" opacity=".5" /></g>
  </svg>
}

function Botanical({ className = '' }: { className?: string }) {
  return <svg className={`botanical ${className}`} viewBox="0 0 200 280" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth=".9">
    <path d="M95 280C100 219 77 136 112 15M97 236C56 216 32 180 26 151M94 196C137 174 159 144 164 111M94 146C60 117 48 80 51 50M102 92C134 75 146 45 145 20" />
    {[0, 1, 2, 3].map(i => <g key={i} transform={`translate(${i % 2 ? 2 : 0},${i * 42})`}><path d="M97 84C69 80 63 57 69 43C88 49 100 63 97 84ZM105 61C127 59 135 44 133 29C114 32 105 43 105 61Z" fill="currentColor" fillOpacity=".09" /></g>)}
    <path d="M37 178C16 177 6 160 10 143C30 147 39 160 37 178ZM63 211C44 209 35 193 38 178C57 182 66 194 63 211ZM129 173C147 174 164 159 163 144C143 144 132 155 129 173ZM147 145C166 147 184 131 183 115C164 116 151 127 147 145Z" fill="currentColor" fillOpacity=".12" />
  </g></svg>
}

function InvitationIntro({ guest, onOpen, onBeginOpen }: { guest: Guest; onOpen: () => void; onBeginOpen: () => void }) {
  const [opening, setOpening] = useState(false)
  const reduced = useReducedMotion()
  function beginOpening() {
    onBeginOpen()
    setOpening(true)
  }
  useEffect(() => {
    if (!opening) return
    const timer = setTimeout(onOpen, reduced ? 20 : 1000)
    return () => clearTimeout(timer)
  }, [opening, onOpen, reduced])
  return <motion.div className="intro" exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.8 }} role="dialog" aria-modal="true" aria-label="Your personal wedding invitation">
    <Botanical className="intro-leaf left" /><Botanical className="intro-leaf right" />
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="eyebrow">SOME MOMENTS ARE MEANT TO BE SHARED</motion.p>
    <div className={`envelope ${opening ? 'opening' : ''}`}>
      <div className="envelope-inner"><Flower2 size={30} strokeWidth={1} /><p>A celebration of love</p><h2>{coupleName}</h2></div>
      <div className="envelope-flap" /><div className="envelope-front" />
      <button className="wax-seal" onClick={beginOpening} disabled={opening} aria-label="Open your invitation"><span>N</span></button>
    </div>
    <p className="intro-for">Especially for <span>{guest.name}</span></p>
    <button autoFocus className="intro-open" onClick={beginOpening} disabled={opening}>{opening ? 'A beautiful beginning awaits…' : 'Open your invitation'} {!opening && <ArrowUpRight size={16} />}</button>
    <p className="intro-note">WITH LOVE, FROM THE AKRAM FAMILY</p>
  </motion.div>
}

function Navigation({ name }: { name: string }) {
  const [open, setOpen] = useState(false)
  return <header className="site-header">
    <a href="#home" className="brand" aria-label={`${coupleName} home`}>N<span className="brand-star">✦</span><span className="brand-caption">THE WEDDING INVITATION</span></a>
    <nav aria-label="Main navigation" className={open ? 'nav open' : 'nav'}>
      {['Home', 'Events', 'Schedule', 'Venue'].map(item => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setOpen(false)}>{item}</a>)}
    </nav>
    <span className="header-personal"><span className="online-dot" /> An invitation for {name.split(' ')[0]}</span>
    <button className="menu-button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
  </header>
}

function CoupleSection({ events }: { events: WeddingEvent[] }) {
  const { scrollY } = useScroll()
  const reduced = useReducedMotion()
  const y = useTransform(scrollY, [0, 800], [0, 75])
  return <section className="hero" id="home">
    <div className="hero-pattern" /><div className="hero-glow" />
    <div className="hero-topline"><span>LAHORE, PAKISTAN</span><span>{new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'Asia/Karachi' }).format(new Date(events[0].date)).toUpperCase()}</span></div>
    <Botanical className="hero-botanical left" /><Botanical className="hero-botanical right" />
    <motion.div className="arch-wrap" style={{ y: reduced ? 0 : y }}><MughalArch className="mughal-arch" /></motion.div>
    <div className="hero-content">
      <Reveal><p lang="ar" dir="rtl" className="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p><p className="bismillah-translation">IN THE NAME OF ALLAH, THE MOST GRACIOUS, THE MOST MERCIFUL</p></Reveal>
      <Reveal delay={0.1}><p className="hero-blessing">With the blessings of our families</p><p className="hero-intro">You are invited to the wedding of</p></Reveal>
      <Reveal delay={0.2}><h1 className="couple-name">{groomFirstName}<span className="weds"> weds </span><em>{weddingConfig.bride}</em></h1></Reveal>
      <Reveal delay={0.3}><Ornament light /><p className="hero-request">request the pleasure of your company<br />to celebrate their wedding</p></Reveal>
      <Reveal delay={0.4}><div className="hero-date"><span>{shortDate.format(new Date(events[0].date))}</span>{events.length > 1 && <><i /><span>{shortDate.format(new Date(events[events.length - 1].date))}</span></>}<span className="year">2026</span></div></Reveal>
      <Reveal delay={0.5}><a href="#greeting" className="hero-cta">A celebration awaits <ArrowDown size={14} /></a></Reveal>
    </div>
    <div className="hero-bottom"><span>A NEW CHAPTER. A LIFETIME OF LOVE.</span><a href="#greeting">SCROLL TO DISCOVER <ArrowDown size={12} /></a></div>
    <div className="particles" aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <span key={i} style={{ left: `${(i * 17 + 7) % 100}%`, animationDelay: `${i * 0.8}s`, animationDuration: `${8 + i % 5}s` }} />)}</div>
  </section>
}

function GuestGreeting({ guest }: { guest: Guest }) {
  return <section className="greeting section-pad" id="greeting">
    <Botanical className="greeting-leaf" />
    <Reveal><p className="eyebrow"><span className="tiny-line" /> A LITTLE NOTE, JUST FOR YOU <span className="tiny-line" /></p><h2>Dear <em>{guest.name},</em></h2><p className="greeting-main">You are cordially invited to celebrate<br className="desktop-break" /> the wedding of {weddingConfig.groom} &amp; {weddingConfig.bride}.</p><p className="body-copy">{guest.message}</p><div className="greeting-sign"><Heart size={15} strokeWidth={1.3} /><span>Your presence is our most cherished gift.</span></div></Reveal>
  </section>
}

function Countdown({ date }: { date: string }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer) }, [])
  const remaining = Math.max(0, new Date(date).getTime() - now)
  const parts = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60]
  return <section className="countdown-section"><Reveal className="countdown-inner"><div className="countdown-title"><p className="eyebrow">EVERY MOMENT BRINGS US CLOSER</p><h2>{remaining ? <>Counting down to<br /><em>our special day</em></> : <>The celebration<br /><em>has begun</em></>}</h2></div><div className="countdown" aria-label="Countdown to your first invited event">{parts.map((part, i) => <div key={i} className="countdown-unit"><span>{String(part).padStart(2, '0')}</span><small>{['DAYS', 'HOURS', 'MINUTES', 'SECONDS'][i]}</small></div>)}</div></Reveal></section>
}

const eventIcons = { mehandi: Flower2, barat: Sparkles, walima: Heart }

function EventCard({ event, index }: { event: WeddingEvent; index: number }) {
  const Icon = eventIcons[event.id as keyof typeof eventIcons]
  return <Reveal delay={index * 0.1} className={`event-card ${event.id}`}>
    <div className="event-art"><div className="event-art-arch" /><Botanical className="event-leaf a" /><Botanical className="event-leaf b" /><span className="event-number">0{index + 1}</span><span lang="ur" dir="rtl" className="event-urdu">{event.urdu}</span><div className="event-symbol"><Icon strokeWidth={0.8} size={44} /></div><p>{event.label}</p></div>
    <div className="event-body"><p className="eyebrow">{dayFormat.format(new Date(event.date))} · {dateFormat.format(new Date(event.date))}</p><h3>{event.title}</h3><p className="event-subtitle">{event.subtitle}</p><div className="event-details"><p><Clock3 /><span>{event.time}</span></p><p><MapPin /><span>{event.venue}<small>{event.address}</small></span></p></div><div className="event-dress"><span>DRESS NOTE</span>{event.dress}</div><a className="event-map" href={mapUrl(event)} target="_blank" rel="noreferrer">View location <ArrowUpRight size={15} /></a></div>
  </Reveal>
}

function EventsSection({ events }: { events: WeddingEvent[] }) {
  return <section id="events" className="events-section section-pad"><Reveal className="section-heading"><p className="eyebrow">MOMENTS TO BECOME MEMORIES</p><h2>The <em>celebrations</em></h2><p className="body-copy">A gathering of hearts, a celebration of love.<br />We saved a place for you at {events.length === 1 ? 'this special evening' : 'these beautiful moments'}.</p><Ornament /></Reveal><div className={`events-grid ${events.length === 1 ? 'single' : ''}`}>{events.map((event, index) => <EventCard event={event} key={event.id} index={index} />)}</div><Reveal className="events-footnote"><Flower2 size={15} strokeWidth={1} /><span>Good company. Beautiful traditions. Memories for a lifetime.</span><Flower2 size={15} strokeWidth={1} /></Reveal></section>
}

function WeddingTimeline({ events }: { events: WeddingEvent[] }) {
  return <section id="schedule" className="timeline-section section-pad"><Reveal className="section-heading"><p className="eyebrow">YOUR INVITATION AT A GLANCE</p><h2>A beautiful <em>sequence</em></h2><p className="body-copy">Each evening, another memory to cherish.</p></Reveal><div className={`timeline ${events.length === 1 ? 'single' : ''}`}>{events.map((event, index) => {
    const Icon = eventIcons[event.id as keyof typeof eventIcons]
    return <Reveal key={event.id} delay={index * 0.15} className="timeline-item"><span className="timeline-date">{shortDate.format(new Date(event.date))}</span><div className="timeline-node"><Icon size={21} strokeWidth={1.1} /></div><h3>{event.title}</h3><p>{dayFormat.format(new Date(event.date))} · {event.time.replace(' onwards', '')}</p><small>{event.venue}</small></Reveal>
  })}</div></section>
}

function VenueSection({ events }: { events: WeddingEvent[] }) {
  const [selected, setSelected] = useState(events[0].id)
  const event = events.find(item => item.id === selected) ?? events[0]
  return <section id="venue" className="venue-section"><div className="venue-visual"><img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85" alt="Warmly lit wedding reception with elegant floral arrangements" loading="lazy" /><div className="venue-image-overlay" /><div className="venue-image-note"><span>BEAUTIFUL PLACES. BEAUTIFUL BEGINNINGS.</span><p>Where our memories<br /><em>will bloom.</em></p></div></div><Reveal className="venue-content"><p className="eyebrow">WE WILL MEET YOU HERE</p><h2>A setting for<br /><em>something special</em></h2><div className="venue-tabs" role="tablist" aria-label="Event venues">{events.map(item => <button key={item.id} id={`tab-${item.id}`} role="tab" aria-selected={selected === item.id} aria-controls="venue-panel" onClick={() => setSelected(item.id)}>{item.title}</button>)}</div><div id="venue-panel" role="tabpanel" aria-labelledby={`tab-${event.id}`}><h3>{event.venue}</h3><p className="body-copy">{event.address}</p><p className="venue-date"><CalendarDays size={15} />{dateFormat.format(new Date(event.date))} · {event.time}</p><a className="primary-button" href={mapUrl(event)} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={15} /></a></div><p className="venue-note"><MapPin size={13} /> In the heart of Lahore, with all our hearts.</p></Reveal></section>
}

function useBackgroundMusic() {
  const audioRef = useRef<AudioContext | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current)
    void audioRef.current?.close()
    timerRef.current = null
    audioRef.current = null
  }, [])
  async function start() {
    try {
      if (!audioRef.current) {
        const context = new AudioContext()
        audioRef.current = context
        // An original pentatonic instrumental, synthesized locally without external audio.
        const melody = [293.66, 349.23, 392, 440, 392, 349.23, 293.66, 261.63, 293.66, 392, 349.23, 261.63]
        let note = 0
        const playNote = () => {
          if (context.state !== 'running') return
          const oscillator = context.createOscillator()
          const gain = context.createGain()
          oscillator.type = 'sine'
          oscillator.frequency.value = melody[note++ % melody.length]
          gain.gain.setValueAtTime(0, context.currentTime)
          gain.gain.linearRampToValueAtTime(0.07, context.currentTime + 0.04)
          gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 2.5)
          oscillator.connect(gain); gain.connect(context.destination)
          oscillator.start(); oscillator.stop(context.currentTime + 2.6)
        }
        timerRef.current = setInterval(playNote, 850)
        await context.resume()
        playNote()
      } else { await audioRef.current.resume() }
      if (audioRef.current.state !== 'running') throw new Error('Audio context did not start')
      setPlaying(true); setError('')
    } catch { setError('Audio is unavailable in this browser.'); setPlaying(false) }
  }
  async function toggle() {
    if (playing && audioRef.current) {
      try { await audioRef.current.suspend(); setPlaying(false); setError('') }
      catch { setError('Music could not be paused. Please try again.') }
    } else {
      await start()
    }
  }
  return { playing, error, start, toggle }
}

function MusicPlayer({ playing, error, toggle }: ReturnType<typeof useBackgroundMusic>) {
  return <div className="music-control">{error && <span role="alert" className="music-error">{error}</span>}<button className={playing ? 'music-button playing' : 'music-button'} onClick={() => void toggle()} aria-label={playing ? 'Pause background music' : 'Play soft instrumental music'} title={playing ? 'Pause music' : 'A little music?'}>{playing ? <Pause size={17} /> : <Music2 size={17} />}<span>{playing ? 'Sound on' : 'Sound off'}</span></button></div>
}

function Footer() {
  return <footer><Ornament /><p lang="ar" dir="rtl" className="footer-dua">بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا</p><p className="footer-translation">May Allah bless this union with love, mercy, and a lifetime of happiness.</p><h2>With love, <em>the Akram family</em></h2><div className="footer-bottom"><span>{coupleName.toUpperCase()} · DECEMBER 2026</span><span>MADE WITH LOVE, TO BE SHARED WITH LOVE <Heart size={10} /></span></div></footer>
}

export function NotFound() {
  return <main className="not-found"><Flower2 size={40} strokeWidth={1} /><p className="eyebrow">A PERSONAL CELEBRATION</p><h1>Let’s find <em>your invitation.</em></h1><p>This invitation link is not recognized. Please check the link<br />shared with you or contact the Akram family.</p><Link to="/" className="primary-button">View sample invitation <ArrowUpRight size={15} /></Link></main>
}

export function WeddingInvitation() {
  const { guestId = 'guest-001' } = useParams()
  const guest = getGuest(guestId)
  const [opened, setOpened] = useState(false)
  const music = useBackgroundMusic()
  useEffect(() => {
    document.body.style.overflow = opened || !guest ? '' : 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [opened, guest])
  if (!guest) return <NotFound />
  const events = getGuestEvents(guest)
  return <div key={guest.id}><AnimatePresence>{!opened && <InvitationIntro guest={guest} onBeginOpen={() => void music.start()} onOpen={() => setOpened(true)} />}</AnimatePresence><div inert={!opened}><ScrollEffects enabled={opened} /><Navigation name={guest.name} /><main><CoupleSection events={events} /><GuestGreeting guest={guest} /><Countdown date={events[0].date} /><EventsSection events={events} /><WeddingTimeline events={events} /><VenueSection key={`venue-${guest.id}`} events={events} /></main><Footer /><MusicPlayer {...music} /></div></div>
}
