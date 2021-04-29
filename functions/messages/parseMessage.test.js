const { ResponseError } = require('./response')
const parseMessage = require('./parseMessage')

const RANDOM_REPLYING_TO = Math.floor(Math.random() * 100)

describe('Message parseMessage()', () => {
  it('parses valid messages', () => {
    const text = 'This is a legit message'
    const baseMessage = parseMessage({ body: JSON.stringify({ text}) })
    expect(baseMessage.text).toBe(text)

    const threadedMessage = parseMessage({ body: JSON.stringify({ text, replyingTo: RANDOM_REPLYING_TO }) })
    expect(threadedMessage.text).toBe(text)
    expect(threadedMessage.replyingTo).toBe(RANDOM_REPLYING_TO)
  })

  it('rejects messages without text', () => {
    expect(() => parseMessage({ body: '{}'})).toThrowError(ResponseError)
    expect(() => parseMessage({ body: '{"text":""}'})).toThrowError(ResponseError)
  })

  it('rejects invalid JSON', () => {
    expect(() => parseMessage({ body: '{invalid'})).toThrowError(ResponseError)
  })
})
