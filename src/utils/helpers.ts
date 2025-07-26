export function debounce(fn: () => void, ms: number) {
  let timer: any
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn()
    }, ms)
  }
}

export function getPathnameRegex(pathname: string) {
  let cleanedPathname = pathname.replace(/^\/|\/$/g, '')

  const escapedPathname = cleanedPathname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const regexString = `^/${escapedPathname}/?(?:/.*)?$`

  if (cleanedPathname === '') {
    return new RegExp('^/$')
  }

  return new RegExp(regexString)
}
