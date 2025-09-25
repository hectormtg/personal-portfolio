import { defineMiddleware } from 'astro:middleware'
import { defaultLang, languages } from './i18n/ui'

const validDefaultLangRoutes = new Set(
  Object.keys(import.meta.glob('/src/pages/[lang]/**/*.astro'))
    .map(path => path.replace('/src/pages/[lang]', '').replace(/(\/index)?\.astro$/, ''))
    .map(path => (path === '' ? '/' : path))
)

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url
  const pathSegments = pathname.split('/').filter(Boolean)
  const langFromUrl = pathSegments[0]

  if (langFromUrl && Object.keys(languages).includes(langFromUrl)) {
    return next()
  }

  if (validDefaultLangRoutes.has(pathname)) {
    const newUrl = new URL(`/${defaultLang}${pathname}`, context.url).toString()
    return context.redirect(newUrl, 301) // 301 = Permanent Redirect
  }

  return next()
})
