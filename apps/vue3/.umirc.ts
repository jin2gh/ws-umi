import { defineConfig } from 'umi'
import routes from './config/routes'

export default defineConfig({
  npmClient: 'pnpm',
  presets: [require.resolve('@umijs/preset-vue')],
  routes,
});
