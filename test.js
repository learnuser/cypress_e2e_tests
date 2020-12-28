const { Client } = require('pg')

const client = new Client({
  user: 'postgres',
  host: '172.18.0.8',
  database: 'app',
  password: 'changethis',
  port: 5432,
})
try{
client.connect()
} catch(err) {
console.log(err)
}
client.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  client.end()
})