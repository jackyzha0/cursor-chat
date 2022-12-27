const path = require('path')
const { defineConfig } = require('vite')
const dts = require('vite-plugin-dts')

module.exports = defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'cursor-chat',
      fileName: (format) => `cursor-chat.${format}.js`
    }
  }
})
