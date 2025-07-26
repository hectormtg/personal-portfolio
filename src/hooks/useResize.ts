import { useEffect, useState } from 'preact/hooks'
import { debounce } from '../utils/helpers'

interface Params {
  limit?: number
  onResize?: (viewportSize: number) => void
}

export const useResize = ({ limit = 600, onResize }: Params = {}) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth <= limit)
  }, [])

  useEffect(() => {
    const debouncedHandleResize = debounce(() => {
      setIsMobile(window.innerWidth <= limit)
      onResize?.(window.innerWidth)
    }, 500)

    window.addEventListener('resize', debouncedHandleResize)

    return () => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
  })

  return { isMobile }
}
