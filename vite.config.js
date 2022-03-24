const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'cursor-chat',
      fileName: (format) => `cursor-chat.${format}.js`
    }
  }
})
