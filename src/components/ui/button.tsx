import clsx from 'clsx'
import type { HTMLAttributes } from 'preact/compat'
import styles from './button.module.scss'
import Icon from './icon'

interface Props extends HTMLAttributes<HTMLButtonElement & HTMLAnchorElement> {
  loading?: boolean
  endIconSrc?: string
  href?: string
}

const Button = ({ loading, endIconSrc, children, href, ...props }: Props) => {
  if (href) {
    return (
      <a
        href={href}
        {...(props as HTMLAttributes<HTMLAnchorElement>)}
        className={clsx(styles.button, endIconSrc && styles.endIconButton, props.className)}
        type='button'
      >
        <span>{children}</span>
        {endIconSrc && <div className={styles.iconContainer}>{<Icon src={endIconSrc} />}</div>}
      </a>
    )
  }

  return (
    <button
      {...(props as HTMLAttributes<HTMLButtonElement>)}
      className={clsx(styles.button, endIconSrc && styles.endIconButton, props.className)}
    >
      <span>{children}</span>
      {endIconSrc && <div className={styles.iconContainer}>{<Icon src={endIconSrc} />}</div>}
    </button>
  )
}

export default Button
