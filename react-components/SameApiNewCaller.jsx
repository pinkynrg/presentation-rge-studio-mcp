import ApiFlow from './ApiFlow.jsx'

// Same API, new caller — 2×2: frontend → backend, then agent → same backend.
export default function SameApiNewCaller() {
  return <ApiFlow withAgent={true} />
}
