import { useState } from 'preact/hooks'
import { languages, ui } from '../../i18n/ui'
import icon from '../../icons/language-icon.svg'
import type { Languages } from '../../types/languages.types'
import Icon from './icon'
import styles from './language-picker.module.scss'
import { Modal } from './modal'
import { getLangFromUrl } from '../../i18n/utils'
import clsx from 'clsx'

interface Props {
  url: URL
}

const LanguagePicker = ({ url }: Props) => {
  const [open, setOpen] = useState(false)

  const lang = getLangFromUrl(url)
  const t = ui[lang]

  const toggleModal = () => {
    setOpen(prev => !prev)
  }

  const handleClick = (_lang: Languages) => {
    if (_lang === lang) {
      toggleModal()
      return
    }
    const newPath = window.location.pathname.replace(/^\/(es|en)/, `/${_lang}`)
    window.location.pathname = newPath
  }

  return (
    <>
      <div
        className={styles.button}
        onClick={toggleModal}
      >
        <Icon src={icon.src} />
        <span id={styles.title}>{t.common.language}</span>
      </div>

      <Modal
        isOpen={open}
        onClose={toggleModal}
        title={t.common.language}
      >
        <ul className={styles.list}>
          {Object.entries(languages).map(([_lang, label]) => {
            const key = `lang_${_lang}` as keyof typeof t.common
            return (
              <li
                className={clsx(_lang === lang && styles.active)}
                onClick={() => handleClick(_lang as Languages)}
              >
                {t.common[key]} <span>{label}</span>
              </li>
            )
          })}
        </ul>
      </Modal>
    </>
  )
}

export default LanguagePicker
