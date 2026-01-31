'use client'

import { useEffect, useRef, useState } from 'preact/hooks'
import Icon from '../../../components/ui/icon'
import Swiper from '../../../components/ui/swiper'
import desktopIcon from '../../../icons/desktop-icon.svg'
import codeIcon from '../../../icons/html-tags-icon.svg'
import linkIcon from '../../../icons/link-icon.svg'
import type { IProject } from '../../../types/project.types'
import styles from './project-details.module.scss'
import { STYLE_DEFAULTS } from '../../../constants/styles.constants'
import { useResize } from '../../../hooks/useResize'
import { ui } from '../../../i18n/ui'
import type { Languages } from '../../../types/languages.types'

interface Props {
  project: IProject
  lang: Languages
}

const ProjectDetails = ({ project, lang }: Props) => {
  const [width, setWidth] = useState(STYLE_DEFAULTS.MODAL_WIDTH)

  const containerRef = useRef<HTMLDivElement>(null)

  const t = ui[lang]

  useResize({
    onResize: () => setWidth(containerRef.current?.clientWidth || STYLE_DEFAULTS.MODAL_WIDTH),
  })

  useEffect(() => {
    if (!containerRef.current) return
    setWidth(containerRef.current.clientWidth)
  }, [containerRef])

  return (
    <div
      className={styles.container}
      ref={containerRef}
    >
      <section className={styles.list}>
        <Item
          label={t.portfolio_details.project_label}
          text={project.type}
          icon={<Icon src={desktopIcon.src} />}
        />
        <Item
          label='Tech Stack'
          text={project.stack}
          icon={<Icon src={codeIcon.src} />}
        />
        {project.url && (
          <Item
            label={t.portfolio_details.preview_label}
            url={project.url}
            icon={<Icon src={linkIcon.src} />}
          />
        )}
      </section>

      <Swiper
        images={project.images}
        width={width}
      />

      <section className={styles.summary}>
        <Item
          label={t.portfolio_details.summary_label}
          text={project.summary}
          icon={<Icon src={codeIcon.src} />}
        />
      </section>
    </div>
  )
}

export default ProjectDetails

interface ItemProps {
  label: string
  text?: string
  url?: string
  icon: any
}

const Item = ({ label, text, url, icon }: ItemProps) => {
  return (
    <div className={styles.item}>
      <span>
        {icon} {label}:
      </span>
      &nbsp;
      {text && !url && <p>{text}</p>}
      {url && (
        <a
          href={url}
          target='_blank'
        >
          {url}
        </a>
      )}
    </div>
  )
}
