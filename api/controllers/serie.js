const database = require('../../serieservice')
const _ = require('lodash')

exports.series = (req, reply) => {
  database.get({}, (err, series) => {
    if (err) return reply.code(500).send(err)

    reply.code(200).send({ series: series[0].series, quantidade: series[0].series.length })
  })
}

exports.serie = (req, reply) => {
  database.get({}, (err, serie) => {
    if (err) return reply.code(500).send(err)

    let _serie = _.find(serie[0].series, { path: req.params.serie })

    reply.code(200).send({ serie: _serie, episodios: _serie.episodios.length })
  })
}
