const fastify = require('fastify')()
const cors = require('cors')
const port = process.env.PORT || 7000

fastify.use(cors())

fastify.listen(port, '0.0.0.0', (err) => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})

require('./api/routes')(fastify)
