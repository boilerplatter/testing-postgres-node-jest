const { ResponseError } = require('./response')
const checkRequest = require('./checkRequest')

const VALID_REQUEST = {
  httpMethod: 'POST',
  path: '/.netlify/functions/messages',
  headers: {
    'content-type': 'application/json'
  },
  body: '{foo:bar}'
}

describe('Message checkRequest()', () => {
  it('allows valid requests', () => {
    expect(checkRequest(VALID_REQUEST)).toBe(null)
  })

  it('rejects disallowed methods', () => {
    expect(() => checkRequest({ ...VALID_REQUEST, httpMethod: 'GET' })).toThrow(ResponseError)
    expect(() => checkRequest({ ...VALID_REQUEST, httpMethod: 'PATCH' })).toThrow(ResponseError)
    expect(() => checkRequest({ ...VALID_REQUEST, httpMethod: 'DELETE' })).toThrow(ResponseError)
  })

  it('rejects non-root paths', () => {
    const path = `${VALID_REQUEST.path}/bad/path/segments`

    expect(() => checkRequest({ ...VALID_REQUEST, path })).toThrow(ResponseError)
  })

  it('rejects non-JSON content types', () => {
    const headers = { ...VALID_REQUEST.headers, 'content-type': 'text/html' }

    expect(() => checkRequest({ ...VALID_REQUEST, headers })).toThrow(ResponseError)
  })

  it('rejects empty payloads', () => {
    expect(() => checkRequest({ ...VALID_REQUEST, body: '' })).toThrow(ResponseError)
  })
})
