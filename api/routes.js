const api = require('./controllers/serie')

module.exports = (fastify) => {
  fastify.addContentTypeParser('*', (req, done) => {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => {
      done(data)
    })
  })

  fastify.get('/api/v1/series', api.series)
  fastify.get('/api/v1/serie/:serie', api.serie)
}
