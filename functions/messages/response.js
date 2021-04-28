// create JSON-compatible responses from a payload and HTTP status code
class Response {
  headers = {
    'Content-Type': 'application/json'
  }

  constructor(payload, statusCode = 200) {
    this.body = JSON.stringify(payload)
    this.statusCode = statusCode
  }
}

class ResponseError extends Response {
  constructor(payload, statusCode = 400) {
    if (statusCode < 400) {
      throw new Error('Invalid status code given to ResponseError')
    }

    super(payload, statusCode)
  }
}

module.exports = { Response, ResponseError }
