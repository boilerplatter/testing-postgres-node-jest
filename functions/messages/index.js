const Postgres = require('../../platter/postgres/node/TestingPostgresNodeJest')
const { Response } = require('./response')
const checkRequest = require('./checkRequest')
const parseMessage = require('./parseMessage')
const insertMessage = require('./insertMessage')

const postgres = new Postgres({ key: process.env.PLATTER_API_KEY })

// export the API as a single handler
exports.handler = async event => {
  try {
    checkRequest(event)
    const payload = parseMessage(event) 
    const message = await insertMessage(payload, postgres)

    return new Response(message)
  } catch (responseError) {
    return responseError
  }
}
