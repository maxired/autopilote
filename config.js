module.exports = {
  brut:               { pages : 0, lines : 0, columns : 1},
  chargeSalarial:     { pages : 1, lines : 5, columns : 1},
  chargePatronal:     { pages : 1, lines : 5, columns : 2},
  secuSalarial:       { pages : 0, lines : [5, 6], columns : 3},
  secuPatronal:      [{ pages : 0, lines : [5, 6], columns : 5},
                      { pages : 0, lines : 7, columns : 3}],
  chomageSalarial:    { pages : 0, lines : 9, columns : 3},
  chomagePatronal:    { pages : 0, lines : 9, columns : 5},
  apicilSalarial:     { pages : 0, lines : [13, 16, 19, 22, 25, 28], columns: 2},
  apicilPatronal:     { pages : 0, lines : [13, 16, 19, 22, 25, 28], columns: 4},
  prevoyanceSalarial: { pages : 0, lines : 35, columns : 2},
  prevoyancePatronal:[{ pages : 0, lines : 32, columns : 2},
                      { pages : 0, lines : 35, columns : 4}],
  csgSalararial:     [{ pages : 0, lines : [37, 38], columns : 3}],
  patronalAutre:     [{ pages : 1, lines : [3, 4], columns : 3}],

  totalSalarial:      { pages: 1, lines: 5, columns: 1},
  totalPatronal:      { pages: 1, lines: 5, columns: 2},
  salaireNet:         { pages: 1, lines: 6, columns: 1}
}
