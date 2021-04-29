const path = require('path')
const { Response } = require('./response')
const checkRequest = require('./checkRequest')
const parseMessage = require('./parseMessage')
const insertMessage = require('./insertMessage')
const Postgres = require(path.join(__dirname, '../../', process.env.PLATTER_POSTGRES_CLIENT))
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
