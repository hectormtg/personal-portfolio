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
  const langPrefixRegex = /^\/[a-z]{2}\/?/
  const cleanedPathname = pathname.replace(langPrefixRegex, '/').replace(/^\/|\/$/g, '')

  const escapedPathname = cleanedPathname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const regexString = `^/${escapedPathname}/?(?:/.*)?$`

  if (cleanedPathname === '') {
    return new RegExp('^/$')
  }

  return new RegExp(regexString)
}
