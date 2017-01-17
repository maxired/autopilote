const parse = require('./parse')
const pilot = require('./pilot')

parse('./assets/samples-merged.pdf', (err, pages) => {
  pilot(pages)
});
