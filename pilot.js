
const printLine = (reportLine) => {
  if (reportLine === '') {
    // console.log('')
  } else {
    const rawValue = reportLine.valeur
    const value = typeof rawValue === 'number' ? rawValue.toFixed(2) : rawValue
    console.log(`30\t\t${reportLine['intitulé']}\t${reportLine.compte}\t\t${reportLine.debit ? value : ''}\t${reportLine.credit ? value : ''}`)
  }
}

const numberLines = function(line){

 const mappedLines =  line.reduce( (memo, w) => {

   if( !isNaN(parseFloat(w))){
     memo.last && memo.arr.push(memo.last)
     memo.arr.push(w)

     return { last: undefined, arr: memo.arr}
   }

   const last = memo.last ? `${memo.last || ''} ${w}` : w
   return { last , arr: memo.arr }

 }, { last: undefined, arr: [] })

 if(mappedLines.last){
   mappedLines.arr.push(mappedLines.last)
 }

 return mappedLines.arr
}

const getColumn = (reducedPages, page, line, column) => {
  return numberLines(reducedPages[page][line])[column]
}

const add = (...values) => {
  return values.reduce((memo, v) => {
    return memo + parseFloat(v)
  }, 0)
}

const addLines = (reducedPages, page, lines, column) => {
  return lines.reduce( ( memo, lineIndex) => {
    return memo + parseFloat(getColumn(reducedPages, page, lineIndex, column))
  }, 0)

}

module.exports = function(reducedPages){
  const brut = getColumn(reducedPages, 0, 0, 1)

  const chargeSalarial = getColumn(reducedPages, 1, 5, 1)
  const chargePatronal = getColumn(reducedPages, 1, 5, 2)

  const secuSalarial = addLines(reducedPages, 0, [5, 6], 3)
  const secuPatronal = add( addLines(reducedPages, 0, [5, 6], 5), getColumn(reducedPages, 0, 7, 3))

  const chomageSalarial = getColumn(reducedPages, 0, 9, 3)
  const chomagePatronal = getColumn(reducedPages, 0, 9, 5)

  const apicilSalarial = addLines(reducedPages, 0, [13, 16, 19, 22, 25, 28], 2)
  const apicilPatronal = addLines(reducedPages, 0, [13, 16, 19, 22, 25, 28], 4)


  const prevoyanceSalarial = getColumn(reducedPages, 0, 35, 2)
  const prevoyancePatronal = add(getColumn(reducedPages, 0, 32, 2) , getColumn(reducedPages, 0, 35, 4))

  const csgSalararial = addLines(reducedPages, 0, [37, 38], 3)

  const patronalAutre = addLines(reducedPages, 1, [3, 4], 3)


  const totalSalarial = getColumn(reducedPages, 1, 5, 1)
  const totalPatronal = getColumn(reducedPages, 1, 5, 2)

  const report = []

  const salaireNet = getColumn(reducedPages, 1, 6, 1)

  report.push('')
  report.push( { compte : 641000, intitulé: 'Salaire Brut du mois', debit: true, valeur: brut})
  report.push( { compte : '421000 - Personnel rémunérations dues', intitulé: 'Salaire Brut du mois', credit: true, valeur: brut})
  report.push('')
  report.push( { compte : 421000, intitulé: 'Enregistrement des charges salariales', debit: true, valeur: chargeSalarial})
  report.push( { compte : 431000, intitulé: 'Enregistrement des charges salariales - Securite Sociale', credit: true, valeur: secuSalarial}) // secu
  report.push( { compte : 437100, intitulé: 'Enregistrement des charges salariales - assurance chomage', credit: true, valeur: chomageSalarial}) // assedic
  report.push( { compte : 437200, intitulé: 'Enregistrement des charges salariales - prevoyance', credit: true, valeur: prevoyanceSalarial}) // 437
  report.push( { compte : 437300, intitulé: 'Enregistrement des charges salariales - retraite', credit: true, valeur: apicilSalarial}) // TODO, // 437
  report.push( { compte : 431000, intitulé: 'Enregistrement des charges salariales - CSG ', credit: true, valeur: csgSalararial}) // TODO, //secu
  report.push('')

  report.push( { compte : 645100, intitulé: 'Enregistrement des charges patronales -  Securite Sociale', debit: true, valeur: secuPatronal})
  report.push( { compte : 645400, intitulé: 'Enregistrement des charges patronales - assurance chomage', debit: true, valeur: chomagePatronal})
  report.push( { compte : 645800, intitulé: 'Enregistrement des charges patronales - prevoyance', debit: true, valeur: prevoyancePatronal})
  report.push( { compte : 645300, intitulé: 'Enregistrement des charges patronales - retraite', debit: true, valeur: apicilPatronal})
  report.push( { compte : 645100, intitulé: 'Enregistrement des charges patronales - autre charge patronal', debit: true, valeur: patronalAutre})
  report.push('')
  report.push( { compte : 431000, intitulé: 'Enregistrement des charges patronales -  Securite Sociale', credit: true, valeur: secuPatronal})
  report.push( { compte : 437100, intitulé: 'Enregistrement des charges patronales - assurance chomage', credit: true, valeur: chomagePatronal})
  report.push( { compte : 437200, intitulé: 'Enregistrement des charges patronales - prevoyance', credit: true, valeur: prevoyancePatronal})
  report.push( { compte : 437300, intitulé: 'Enregistrement des charges patronales - retraite', credit: true, valeur: apicilPatronal})
  report.push( { compte : 431000, intitulé: 'Enregistrement des charges patronales - autre charge patronal', credit: true, valeur: patronalAutre})


  report.push('')
  report.push( { compte : 421000, intitulé: 'Règlement des salaires nets aux salariés', debit: true, valeur: salaireNet})
  report.push( { compte : 512100, intitulé: 'Règlement des salaires nets aux salariés', credit: true, valeur: salaireNet})
  report.push('')
  report.push( { compte : 431000, intitulé: 'Règlement des charges salariales et patronale - Securite Sociale', debit: true, valeur: add(secuPatronal, secuSalarial)}) // secu
  report.push( { compte : 437100, intitulé: 'Règlement des charges salariales et patronale- assurance chomage', debit: true, valeur: add(chomageSalarial, chomagePatronal)}) // assedic
  report.push( { compte : 437200, intitulé: 'Règlement des charges salariales et patronale - prevoyance', debit: true, valeur: add(prevoyanceSalarial, prevoyancePatronal)}) // 437
  report.push( { compte : 437300, intitulé: 'Règlement des charges salariales et patronale - retraite', debit: true, valeur: add(apicilSalarial, apicilPatronal)}) // TODO, // 437
  report.push( { compte : 431000, intitulé: 'Règlement des charges salariales et patronale - CSG ', debit: true, valeur: add(csgSalararial, patronalAutre)}) // TODO, //secu
  report.push( { compte : 512100, intitulé: 'Règlement des charges sociales salariales et patronales', credit: true, valeur: add(chargeSalarial,chargePatronal)})


  console.log('chargeSalarial', chargeSalarial, add(secuSalarial, chomageSalarial, prevoyanceSalarial, apicilSalarial, csgSalararial))
  console.log('chargePatronal', chargePatronal, add(secuPatronal, chomagePatronal, prevoyancePatronal, apicilPatronal, patronalAutre))
  console.log('secuPatronal', secuPatronal)

  report.forEach(printLine)
}
