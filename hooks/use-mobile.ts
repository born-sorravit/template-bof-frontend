import * as React from "react"

const MOBILE_BREAKPOINT = 768
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches
}

/** The server has no viewport; desktop is the safe first paint. */
function getServerSnapshot() {
  return false
}

/**
 * `useSyncExternalStore` rather than `useState` + `useEffect`: a media query is
 * an external store, and reading it through the store API avoids the cascading
 * render that `react-hooks/set-state-in-effect` flags.
 */
export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
