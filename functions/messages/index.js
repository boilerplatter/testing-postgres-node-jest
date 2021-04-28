// create JSON responses from a payload and HTTP status code
const createResponse = (payload, statusCode = 200) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})

// export the API as a single handler
exports.handler = async _event => {
  return createResponse({ message: 'Hello World' })
}
