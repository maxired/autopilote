let fs = require('fs'),
    PDFParser = require("pdf2json");


module.exports = function(filename, cb) {
  let pdfParser = new PDFParser();

  pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
  pdfParser.on("pdfParser_dataReady", pdfData => {

  const pages = pdfData.formImage.Pages

  const mappedPages = pages.map((page) => {
    const lines = {}
    page.Texts.forEach((text) => {
      lines[text.y] = lines[text.y] || []
      lines[text.y].push(text)
    })

    const mappedLines = Object.keys(lines)
    .filter(key => {
      const line = lines[key]
      return line[0].y > 15 && line[0].x > 10
    })
    .map(key => {
      const line = lines[key]
      const reducedLines = line.reduce(({ last, arr, lastX }, w, index) => {
        const current = decodeURIComponent(w.R[0].T)
        const currentFormatted = current.replace(/,/, '.')
        const comma = parseFloat(currentFormatted)

        if(last !== undefined && lastX && (lastX + 1) > w.x){
          if(!isNaN(comma)){
            arr.push(`${last}${currentFormatted}`)
            return { last: undefined, arr}
          }
        }

        if (last){
          arr.push(last)
        }

        if (!isNaN(comma)) {
          return {last: currentFormatted, lastX: w.x , arr}
        } else {
          arr.push(current)
          return {last: undefined, arr}
        }
      }, { last: undefined, arr: [] })

      if(reducedLines.last){
        reducedLines.arr.push(reducedLines.last)
      }

      return reducedLines.arr
    })
    return mappedLines
  })

  cb(null, mappedPages)

});

  pdfParser.loadPDF(filename);
}
