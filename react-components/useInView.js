import { useState, useEffect, useRef } from 'react'

// True only while the element is actually on screen. Slidev mounts every
// slide's React component up front, so time-based animations must gate on this
// (and reset when it flips false) to start when you land on the slide.
export function useInView(threshold = 0.25) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') { setInView(true); return }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, inView]
}
