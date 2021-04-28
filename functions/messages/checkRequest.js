const { ResponseError } = require('./response')

// guard against invalid requests for this endpoint
const checkRequest = event => {
  if (event.httpMethod !== 'POST') {
     throw new ResponseError({ message: 'Method Not Allowed' }, 405)
  }

  if (event.path !== '/.netlify/functions/messages') {
    throw new ResponseError({ message: 'Not Found'}, 404)
  }

  if (event.headers['content-type'] !== 'application/json') {
    throw new ResponseError({ message: 'Payload Content-Type Not Acceptable'}, 406)
  }

  if (!event.body) {
    throw new ResponseError({ message: 'Message Payload Required'}, 400)
  }

  return null
}

module.exports = checkRequest
