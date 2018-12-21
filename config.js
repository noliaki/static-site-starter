const path = require('path')

module.exports = {
  'src': path.resolve('src'),
  'dist': path.resolve('dist'),
  'docroot': path.resolve('src/docroot'),
  'pug': {
    'basedir': path.resolve('src/modules/pug'),
    'pretty': true
  },
  'stylus': {
    'include': [
      path.resolve('src/modules/stylus')
    ],
    'autoprefixerOption': {
      'grid': true
    }
  },
  'imagemin': {
    'jpegtran': {},
    'pngquant': {},
    'svgo': {
      'plugins': [
        {
          'removeViewBox': false
        }
      ]
    }
  },
  'browsersync': {
    'server': {
      'baseDir': 'dist',
      'directory': true
    },
    'startPath': '/index.html',
    'files': 'dist',
    'ghostMode': false,
    'logLevel': 'debug',
    'reloadDebounce': 500,
    'ui': false,
    'open': false
  }
}
