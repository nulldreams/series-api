const path = require('path')
const Datastore = require('nedb')
const _ = require('lodash')

const db = new Datastore({
  filename: path.join(__dirname, 'data', `series.db`)
})

db.loadDatabase()
db.persistence.setAutocompactionInterval(1000 * 60 * 1)

function add (series, cb) {
  db.findOne({}, (err, documento) => {
    if (err) return cb(err)
    if (!documento) {
      return db.insert({ series: [series] }, cb)
    }
  })
}

function update (nome, epIndex, data, cb) {
  console.log('update')
  db.findOne({'series.nome': nome}, (err, documento) => {
    let indexSerie = _.findIndex(documento.series, {'nome': nome})
    let ep = _.assign(documento.series[indexSerie].episodios[epIndex], { opcoes: '' })
    ep.opcoes = data
    documento.series[indexSerie].episodios[epIndex] = ep
    db.update({}, documento, {}, (err, numReplaced) => {
      console.log(`${nome} foi alterado`)
      console.log(numReplaced)
    })
  })
}

function get (param, cb) {
  db.find(param, cb)
}

module.exports = {
  add,
  get,
  update
}
