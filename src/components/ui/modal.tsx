'use client'

import clsx from 'clsx'
import type { ComponentChildren } from 'preact'
import { createPortal } from 'preact/compat'
import { useEffect, useRef, useState } from 'preact/hooks'
import styles from './modal.module.scss'

export interface ModalProps {
  id?: string
  title?: string
  isOpen: boolean
  onClose: () => void
  size?: 'small' | 'medium' | 'large'
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  children: ComponentChildren
  footer?: ComponentChildren
}

const isBrowser = import.meta.env.SSR === false
const rootElement = isBrowser ? document.getElementById('root') : null

export function Modal({
  id,
  title,
  isOpen,
  onClose,
  size = 'medium',
  closeOnBackdrop = true,
  closeOnEscape = true,
  children,
  footer,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape' && closeOnEscape) {
        onClose()
      } else if (e.key === 'Tab') {
        handleTabKey(e)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closeOnEscape, onClose])

  // Handle focus management
  useEffect(() => {
    if (isOpen) {
      // Store current focus
      previousFocusRef.current = document.activeElement as HTMLElement

      // Prevent body scroll
      document.body.style.overflow = 'hidden'

      if (rootElement) {
        rootElement.style.filter = 'blur(20px)'
      }

      // Focus first focusable element
      // setTimeout(() => {
      //   const firstFocusable = getFirstFocusableElement(modalRef.current)
      //   if (firstFocusable) {
      //     firstFocusable.focus()
      //   }
      // }, 100)
    } else {
      // Restore body scroll
      document.body.style.overflow = ''
      rootElement?.removeAttribute('style')

      // Restore focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }

    return () => {
      document.body.style.overflow = ''
      rootElement?.removeAttribute('style')
    }
  }, [isOpen])

  const handleBackdropClick = (e: MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleTabKey = (e: KeyboardEvent) => {
    if (!modalRef.current) return

    const focusableElements = getFocusableElements(modalRef.current)
    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault()
        lastFocusable?.focus()
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault()
        firstFocusable?.focus()
      }
    }
  }

  const getFocusableElements = (element: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ')

    return Array.from(element.querySelectorAll(focusableSelectors)) as HTMLElement[]
  }

  const getFirstFocusableElement = (element: HTMLElement | null): HTMLElement | null => {
    if (!element) return null
    const focusableElements = getFocusableElements(element)
    return focusableElements[0] || null
  }

  if (!isOpen) return null

  return createPortal(
    <div
      className={clsx(styles.modal, styles[`modal--${size}`])}
      id={id}
      role='dialog'
      aria-modal='true'
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-content`}
      ref={modalRef}
    >
      <div
        className={styles.backdrop}
        onClick={handleBackdropClick}
      />

      <div className={styles.container}>
        <div className={styles.content}>
          <header className={styles.header}>
            <h2
              className={styles.title}
              id={`${id}-title`}
            >
              {title}
            </h2>
            <button
              className={styles.closeButton}
              type='button'
              aria-label='Close modal'
              onClick={onClose}
            >
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <line
                  x1='18'
                  y1='6'
                  x2='6'
                  y2='18'
                />
                <line
                  x1='6'
                  y1='6'
                  x2='18'
                  y2='18'
                />
              </svg>
            </button>
          </header>

          <div
            className={styles.body}
            id={`${id}-content`}
          >
            {children}
          </div>

          {footer && <footer className={styles.footer}>{footer}</footer>}
        </div>
      </div>
    </div>,
    document.getElementById('modal') as HTMLElement
  )
}
