const { v4: uuidv4 } = require('uuid')
const { ResponseError } = require('./response')
const parseMessage = require('./parseMessage')

describe('Message parseMessage()', () => {
  it('parses valid messages', () => {
    const text = 'This is a legit message'
    const baseMessage = parseMessage({ body: JSON.stringify({ text}) })

    expect(baseMessage.text).toBe(text)

    const replyingTo = uuidv4()
    const threadedMessage = parseMessage({ body: JSON.stringify({ text, replyingTo }) })

    expect(threadedMessage.text).toBe(text)
    expect(threadedMessage.replyingTo).toBe(replyingTo)
  })

  it('rejects messages without text', () => {
    expect(() => parseMessage({ body: '{}'})).toThrowError(ResponseError)
    expect(() => parseMessage({ body: '{"text":""}'})).toThrowError(ResponseError)
  })

  it('rejects invalid JSON', () => {
    expect(() => parseMessage({ body: '{invalid'})).toThrowError(ResponseError)
  })
})
