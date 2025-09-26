import { useState } from 'preact/hooks'
import { Modal } from '../../../components/ui/modal'
import styles from './card.module.scss'
import ProjectDetails from './project-details'
import type { IProject } from '../../../types/project.types'

interface Props {
  item: IProject
}

const Card = ({ item }: Props) => {
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
        <ProjectDetails project={item} />
      </Modal>
    </>
  )
}

export default Card
