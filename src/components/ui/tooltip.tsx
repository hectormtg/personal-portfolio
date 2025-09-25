'use client'

import { createPortal, type ReactNode } from 'preact/compat'
import { useEffect, useRef, useState } from 'preact/hooks'
import './tooltip.scss'

type Position = 'top' | 'bottom' | 'left' | 'right' | 'auto'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?: Position
  delay?: number
  variant?: 'default' | 'success' | 'warning' | 'error'
  disabled?: boolean
  offset?: number
}

export function Tooltip({
  content,
  children,
  position = 'auto',
  delay = 300,
  variant = 'default',
  disabled = false,
  offset = 8,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [actualPosition, setActualPosition] = useState<Position>('top')
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    let finalPosition = position
    let x = 0
    let y = 0

    // Auto positioning logic
    if (position === 'auto') {
      const spaceTop = triggerRect.top
      const spaceBottom = viewport.height - triggerRect.bottom
      const spaceLeft = triggerRect.left
      const spaceRight = viewport.width - triggerRect.right

      if (spaceTop >= tooltipRect.height + offset) {
        finalPosition = 'top'
      } else if (spaceBottom >= tooltipRect.height + offset) {
        finalPosition = 'bottom'
      } else if (spaceRight >= tooltipRect.width + offset) {
        finalPosition = 'right'
      } else if (spaceLeft >= tooltipRect.width + offset) {
        finalPosition = 'left'
      } else {
        finalPosition = 'top' // fallback
      }
    }

    // Calculate coordinates based on final position
    switch (finalPosition) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
        y = triggerRect.top - tooltipRect.height - offset
        break
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
        y = triggerRect.bottom + offset
        break
      case 'left':
        x = triggerRect.left - tooltipRect.width - offset
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
        break
      case 'right':
        x = triggerRect.right + offset
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
        break
    }

    // Prevent overflow
    x = Math.max(8, Math.min(x, viewport.width - tooltipRect.width - 8))
    y = Math.max(8, Math.min(y, viewport.height - tooltipRect.height - 8))

    setTooltipPosition({ x, y })
    setActualPosition(finalPosition)
  }

  const showTooltip = () => {
    if (disabled) return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      hideTooltip()
    }
  }

  useEffect(() => {
    calculatePosition()

    const handleResize = () => calculatePosition()
    const handleScroll = () => calculatePosition()

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isVisible, triggerRef, tooltipRef])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`

  const getTooltipClasses = () => {
    const baseClass = 'tooltip'
    const positionClass = `tooltip--${actualPosition}`
    const variantClass = variant !== 'default' ? `tooltip--${variant}` : ''

    return [baseClass, positionClass, variantClass].filter(Boolean).join(' ')
  }

  const getArrowClasses = () => {
    const baseClass = 'tooltip-arrow'
    const positionClass = `tooltip-arrow--${actualPosition}`

    return [baseClass, positionClass].filter(Boolean).join(' ')
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        onKeyDown={handleKeyDown}
        aria-describedby={isVisible ? tooltipId : undefined}
        className='tooltip-trigger'
        tabIndex={0}
      >
        {children}
      </div>

      {typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={tooltipRef}
            id={tooltipId}
            role='tooltip'
            className={getTooltipClasses()}
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              ...(!isVisible ? { opacity: '0' } : {}),
            }}
          >
            {content}
            <div className={getArrowClasses()} />
          </div>,
          document.body
        )}
    </>
  )
}
