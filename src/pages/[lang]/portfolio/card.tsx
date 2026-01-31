import { useState } from 'preact/hooks'
import { Modal } from '../../../components/ui/modal'
import styles from './card.module.scss'
import ProjectDetails from './project-details'
import type { IProject } from '../../../types/project.types'
import type { Languages } from '../../../types/languages.types'

interface Props {
  item: IProject
  lang: Languages
}

const Card = ({ item, lang }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen(prev => !prev)
  }

  return (
    <>
      <div
        class={styles.card}
        onClick={handleClick}
      >
        <img src={item.thumbnail} />
        <div>
          <span>{item.title}</span>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={item.title}
        id={`details-${item.title}`}
        fluid
      >
        <ProjectDetails
          project={item}
          lang={lang}
        />
      </Modal>
    </>
  )
}

export default Card
