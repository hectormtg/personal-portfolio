export function debounce(fn: () => void, ms: number) {
  let timer: any
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn()
    }, ms)
  }
}
