import { defineMiddleware } from 'astro:middleware'
import { defaultLang, languages } from './i18n/ui'

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url
  const pathSegments = pathname.split('/').filter(Boolean)
  const langFromUrl = pathSegments[0]

  if (langFromUrl && Object.keys(languages).includes(langFromUrl)) {
    return next()
  }

  const fixedPathname = pathname.replace(/\/+$/, '')
  const newUrl = new URL(`/${defaultLang}${fixedPathname}`, context.url).toString()
  return context.redirect(newUrl, 301) // 301 = Permanent Redirect
})
