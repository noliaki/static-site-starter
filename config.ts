export default {
  src: 'src',
  dist: 'dist',
  docroot: 'src/docroot',
  stylus: {
    includes: ['src/modules/stylus'],
    autoprefixerOption: {
      grid: true
    }
  },
  imagemin: {
    jpegtran: {},
    pngquant: {},
    svgo: {
      plugins: [
        {
          removeViewBox: false
        }
      ]
    }
  },
  browsersync: {
    server: {
      baseDir: 'dist',
      directory: true
    },
    startPath: '/index.html',
    files: 'dist',
    ghostMode: false,
    logLevel: 'debug',
    reloadDebounce: 500,
    ui: false,
    open: false
  }
}
