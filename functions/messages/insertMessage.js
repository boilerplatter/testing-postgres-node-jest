const { ResponseError } = require('./response')

// insert a message into the database, returning the database-generated ID and timestamp
const insertMessage = async (message, postgres) => {
  try {
    const [insertedMessage] = await postgres.query(
      `INSERT INTO messages (text, replying_to)
       VALUES ($1, $2)
       RETURNING id, created_at`,
      [message.text, message.replyingTo]
    )

    return insertedMessage
  } catch (error) {
    const payload = {
      message: 'Bad Request',
      error: error.toString()
    }

    throw new ResponseError(payload, 400)
  }
}

module.exports = insertMessage
