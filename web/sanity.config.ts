import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { muxInput } from 'sanity-plugin-mux-input'
import { schemaTypes } from './src/lib/sanity/schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export default defineConfig({
  name: 'senga',
  title: 'Senga Gospel App',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [structureTool(), muxInput()],
  schema: {
    types: schemaTypes,
  },
})
