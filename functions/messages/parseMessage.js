const {ResponseError} = require("./response")

// parse the request body into a valid message
const parseMessage = event => {
  try {
    const message = JSON.parse(event.body)

    if (!message.text) {
      throw 'Empty messages not allowed'
    }

    return message
  } catch (error) {
    throw new ResponseError({
      message: 'Invalid Message Payload',
      error: error.toString()
    })
  }
}

module.exports = parseMessage
