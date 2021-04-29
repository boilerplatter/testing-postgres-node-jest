const path = require('path')
const Postgres = require(path.join(__dirname, '../', process.env.PLATTER_POSTGRES_CLIENT))
const postgres = new Postgres({ key: process.env.PLATTER_API_KEY })

module.exports.up = async () => {
  await postgres.query(
    `CREATE TABLE IF NOT EXISTS messages (
       created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
       id SERIAL PRIMARY KEY,
       replying_to INTEGER REFERENCES messages,
       text TEXT NOT NULL
     )`
  )
}

module.exports.down = async () => {
  await postgres.query('DROP TABLE messages')
}
