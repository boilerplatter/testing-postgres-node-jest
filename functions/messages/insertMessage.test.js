const child_process = require('child_process')
const faker = require('faker')
const path = require('path')
const { ResponseError } = require('./response')
const insertMessage = require('./insertMessage')
const Postgres = require(path.join(__dirname, '../../', process.env.PLATTER_POSTGRES_CLIENT))

const MOCK_MESSAGE_REQUEST = {
  text: 'this is legit text'
}

const MOCK_MESSAGE_RESPONSE = {
  id: 123,
  created_at: (new Date()).toISOString()
}

describe('Message insertMessage()', () => {
  it('returns the first row from a successful message insert', async () => {
    const mockDatabase = {
      async query() {
        return [MOCK_MESSAGE_RESPONSE]
      }
    }

    const response = await insertMessage(MOCK_MESSAGE_REQUEST, mockDatabase)

    expect(response).toBe(MOCK_MESSAGE_RESPONSE)
  })

  it('handles query errors as response errors', async () => {
    const mockDatabase = {
      async query() {
        throw new Error('Something went wrong!')
      }
    }

    await expect(insertMessage(MOCK_MESSAGE_REQUEST, mockDatabase)).rejects.toBeInstanceOf(ResponseError)
  })
})

describe('Message database INSERT', () => {
  const branch = faker.lorem.word(10)
  const postgres = new Postgres({ key: process.env.PLATTER_API_KEY, branch })

  beforeAll(() => {
    child_process.execSync(`npx platter postgres branch create ${branch} -i testing-postgres-node-jest`)
  })

  afterAll(() => {
    child_process.execSync(`npx platter postgres branch delete ${branch} -i testing-postgres-node-jest`)
  })

  test('it generates correct responses for valid top-level messages', async () => {
    const response = await insertMessage(MOCK_MESSAGE_REQUEST, postgres)
    const date = (new Date()).getDate()
    const createdAt = (new Date(response.created_at)).getDate()

    expect(response.id).toBeGreaterThan(0)
    expect(createdAt).toBe(date)
  })

  test('it generates correct responses for valid replies', async () => {
    const threadStart = await insertMessage(MOCK_MESSAGE_REQUEST, postgres)
    const response = await insertMessage({...MOCK_MESSAGE_REQUEST, replyingTo: threadStart.id}, postgres)
    const date = (new Date()).getDate()
    const createdAt = (new Date(response.created_at)).getDate()

    expect(response.id).toBe(threadStart.id + 1)
    expect(createdAt).toBe(date)
  })

  test('it rejects invalid replies', async () => {
    await expect(insertMessage({...MOCK_MESSAGE_REQUEST, replyingTo: 12345}, postgres)).rejects.toBeInstanceOf(ResponseError)
  })
})
