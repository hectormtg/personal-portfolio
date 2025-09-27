'use client'

import { useState, useEffect, useCallback } from 'preact/hooks'
import './not-found.scss'
import type { Languages } from '../types/languages.types'
import TextType from '../components/ui/text-type'
import Button from '../components/ui/button'
import FuzzyText from '../components/ui/fuzzy-text'
import { ui } from '../i18n/ui'
import arrowIcon from '../icons/arrow-right-icon.svg'
import Galaxy from '../components/ui/galaxy'

interface Props {
  lang: Languages
}

export default function NotFound({ lang }: Props) {
  const [currentJoke, setCurrentJoke] = useState(0)

  const t = ui[lang]

  const JOKES = [
    t[404].joke_1,
    t[404].joke_2,
    t[404].joke_3,
    t[404].joke_4,
    t[404].joke_5,
    t[404].joke_6,
    t[404].joke_7,
  ]

  useEffect(() => {
    const jokeInterval = setInterval(() => {
      setCurrentJoke(prev => (prev + 1) % JOKES.length)
    }, 20000)

    return () => {
      clearInterval(jokeInterval)
    }
  }, [])

  const Subtitle = useCallback(
    () => (
      <TextType
        className='subtitle'
        text={JOKES[currentJoke]}
      />
    ),
    [currentJoke]
  )

  return (
    <>
      <Galaxy
        mouseInteraction={false}
        mouseRepulsion={false}
        className='galaxy-layer'
      />
      <div className='not-found-container contentAnimation'>
        <div className='content'>
          {/* Main 404 Display */}
          {/* <div className='main-404'> */}
          {/* <h1 className={`title ${isGlitching ? 'glitch-animation' : ''}`}>404</h1> */}
          <FuzzyText>404</FuzzyText>
          {/* <div className='subtitle'>{developerJokes[currentJoke]}</div> */}
          <Subtitle />
          {/* </div> */}

          {/* Action Buttons */}
          <div className='actions'>
            <Button
              href={`/${lang}`}
              endIconSrc={arrowIcon.src}
            >
              {t[404].cta}
            </Button>
          </div>

          {/* Footer Message */}
          {/* <div className='footer'>
          <p>{"Don't worry, even senior developers get lost sometimes."}</p>
          <p>{'This page is probably just taking a coffee break ☕'}</p>
        </div> */}
        </div>
      </div>
    </>
  )
}
