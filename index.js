const parse = require('./parse')
const pilot = require('./pilot')
const config = require('./config')

parse('./assets/samples-merged.pdf', (err, pages) => {
  pilot(pages, config)
});
