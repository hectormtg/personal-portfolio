'use client'

import clsx from 'clsx'
import type { JSX } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import styles from './swiper.module.scss'
import { useResize } from '../../hooks/useResize'
import { CONFIG } from '../../constants/config.constants'

interface SwiperProps {
  images: string[]
  width?: number
  height?: number
  autoPlay?: boolean
  autoPlayInterval?: number
  showNavigation?: boolean
  showDots?: boolean
  transitionDuration?: number
  className?: string
  onSlideChange?: (index: number) => void
}

interface TouchState {
  startX: number
  startY: number
  currentX: number
  isDragging: boolean
}

export default function Swiper({
  images,
  width = 400,
  height = 350,
  autoPlay = false,
  autoPlayInterval = 3000,
  showNavigation = true,
  showDots = true,
  transitionDuration = 300,
  className = '',
  onSlideChange,
}: SwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [touchState, setTouchState] = useState<TouchState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    isDragging: false,
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<number | null>(null)
  const touchStateTrace = useRef<TouchState>(touchState)

  const { isMobile } = useResize()

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && images.length > 1) {
      autoPlayRef.current = window.setInterval(() => {
        goToNext()
      }, autoPlayInterval)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [autoPlay, autoPlayInterval, currentIndex])

  useEffect(() => {
    touchStateTrace.current = touchState
  }, [touchState])

  // Reset auto-play when user interacts
  const resetAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
      if (autoPlay) {
        autoPlayRef.current = window.setInterval(() => {
          goToNext()
        }, autoPlayInterval)
      }
    }
  }

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return

    setIsTransitioning(true)
    setCurrentIndex(index)
    onSlideChange?.(index)

    setTimeout(() => {
      setIsTransitioning(false)
    }, transitionDuration)
  }

  const goToNext = () => {
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
    goToSlide(nextIndex)
  }

  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    goToSlide(prevIndex)
  }

  // Touch event handlers
  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    setTouchState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      isDragging: true,
    })
    resetAutoPlay()
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchState.isDragging) return

    const touch = e.touches[0]
    const deltaX = Math.abs(touch.clientX - touchState.startX)
    const deltaY = Math.abs(touch.clientY - touchState.startY)

    // Prevent vertical scrolling if horizontal swipe is detected
    if (deltaX > deltaY) {
      e.preventDefault()
    }

    setTouchState(prev => ({
      ...prev,
      currentX: touch.clientX,
    }))
  }

  const handleTouchEnd = () => {
    if (!touchState.isDragging) return

    const deltaX = touchStateTrace.current.currentX - touchStateTrace.current.startX
    const threshold = width * 0.2 // 20% of width

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        goToPrevious()
      } else {
        goToNext()
      }
    }

    setTouchState({
      startX: 0,
      startY: 0,
      currentX: 0,
      isDragging: false,
    })
  }

  // Mouse event handlers for desktop
  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    const mouseEvent = e as MouseEvent
    setTouchState({
      startX: mouseEvent.clientX,
      startY: mouseEvent.clientY,
      currentX: mouseEvent.clientX,
      isDragging: true,
    })
    resetAutoPlay()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!touchState.isDragging) return

    setTouchState(prev => ({
      ...prev,
      currentX: e.clientX,
    }))
  }

  const handleMouseUp = () => {
    if (!touchState.isDragging) return

    const deltaX = touchState.currentX - touchState.startX
    const threshold = width * 0.2

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        goToPrevious()
      } else {
        goToNext()
      }
    }

    setTouchState({
      startX: 0,
      startY: 0,
      currentX: 0,
      isDragging: false,
    })
  }

  // Add event listeners
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Touch events
    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)

    // Mouse events
    if (CONFIG.ENABLE_DESKTOP_SWIPER_DRAG) {
      container.addEventListener('mousedown', handleMouseDown)
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
      container.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [touchState.isDragging, width])

  const translateX = touchState.isDragging
    ? touchState.currentX - touchState.startX - currentIndex * width
    : -(currentIndex * width)

  const containerStyle: JSX.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
    // cursor: touchState.isDragging ? 'grabbing' : 'grab',
  }

  const slidesStyle: JSX.CSSProperties = {
    display: 'flex',
    width: `${images.length * width}px`,
    height: '100%',
    transform: `translateX(${translateX}px)`,
    transition: touchState.isDragging ? 'none' : `transform ${transitionDuration}ms ease-out`,
  }

  const imageStyle: JSX.CSSProperties = {
    width: `${width}px`,
    height: '100%',
    objectFit: 'contain',
    flexShrink: 0,
  }

  const navigationButtonStyle: JSX.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    zIndex: 2,
  }

  const dotsContainerStyle: JSX.CSSProperties = {
    position: 'absolute',
    bottom: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    zIndex: 2,
  }

  const dotStyle: JSX.CSSProperties = {
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    aspectRatio: '1',
  }

  return (
    <div
      className={clsx(styles.swiper, className)}
      style={containerStyle}
      ref={containerRef}
    >
      <div style={slidesStyle}>
        {images.map((src, index) => (
          <div
            key={index}
            id={`Slide ${index + 1}`}
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <img
              src={src || '/placeholder.svg'}
              alt={`Slide ${index + 1}`}
              style={imageStyle}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {showNavigation && images.length > 1 && (
        <>
          <button
            style={{ ...navigationButtonStyle, left: '16px' }}
            onClick={goToPrevious}
            onMouseEnter={e => {
              ;(e.target as HTMLElement).style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
            }}
            onMouseLeave={e => {
              ;(e.target as HTMLElement).style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
            }}
            aria-label='Previous image'
            id={styles.goBackwardsButton}
          >
            ‹
          </button>
          <button
            style={{ ...navigationButtonStyle, right: '16px' }}
            onClick={goToNext}
            onMouseEnter={e => {
              ;(e.target as HTMLElement).style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
            }}
            onMouseLeave={e => {
              ;(e.target as HTMLElement).style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
            }}
            aria-label='Next image'
            id={styles.goForwardButton}
          >
            ›
          </button>
        </>
      )}

      {showDots && images.length > 1 && (
        <div
          style={dotsContainerStyle}
          id={styles.pagination}
        >
          {images.map((_, index) => (
            <button
              key={index}
              style={{
                ...dotStyle,
                backgroundColor: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
              }}
              onClick={() => {
                goToSlide(index)
                resetAutoPlay()
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
