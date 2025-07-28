// @ts-check
import { defineConfig } from 'astro/config'

import icon from 'astro-icon';

import preact from '@astrojs/preact';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [icon(), preact()],
  adapter: netlify()
})