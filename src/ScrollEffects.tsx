import { useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useReducedMotion } from './useReducedMotion'

export function ScrollEffects({ enabled }: { enabled: boolean }) {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    if (!enabled || reduced) return

    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
    })

    function navigateToSection(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null
      const hash = anchor?.getAttribute('href')
      if (!hash || anchor?.target || anchor?.hasAttribute('download')) return
      const target = document.getElementById(hash.slice(1))
      if (!target) return

      event.preventDefault()
      const headerOffset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
      lenis.scrollTo(target.getBoundingClientRect().top + window.scrollY - headerOffset)
      if (window.location.hash !== hash) window.history.pushState(null, '', hash)
    }

    document.addEventListener('click', navigateToSection)
    return () => {
      document.removeEventListener('click', navigateToSection)
      lenis.destroy()
    }
  }, [enabled, reduced])

  if (!enabled || reduced) return null

  return <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
}
