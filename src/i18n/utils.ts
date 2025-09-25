import { defaultLang, languages, ui } from './ui'

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/')
  if (lang in ui) return lang as keyof typeof ui
  return defaultLang
}

export function getDefaultRedirectPath(preferredLang?: string) {
  console.log('Preferred language: ', preferredLang)
  if (!preferredLang) return `/${defaultLang}`
  const hasSupport = Object.keys(languages).includes(preferredLang)
  return hasSupport ? `/${preferredLang}` : `/${defaultLang}`
}
