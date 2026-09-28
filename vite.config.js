import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/pro/',

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),

        clock: resolve(__dirname, 'src/components/clock.html'),
        mouseEvents: resolve(__dirname, 'src/components/mouseEvents.html'),
        movies: resolve(__dirname, 'src/components/movies.html'),
        canvasBool: resolve(__dirname, 'src/components/canvasBool.html'),
        canvasGravity: resolve(__dirname, 'src/components/canvasGravity.html'),
        media: resolve(__dirname, 'src/components/media.html'),
        videoPlayer: resolve(__dirname, 'src/components/videoPlayer.html'),
        chess: resolve(__dirname, 'src/components/chess.html'),
      },
    },
  },
})