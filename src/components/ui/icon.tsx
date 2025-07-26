const Icon = ({ src }: { src: string }) => {
  return (
    <svg>
      <use href={src} />
    </svg>
  )
}

export default Icon
