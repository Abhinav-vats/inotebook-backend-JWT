const connectToMongo = require('./db');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

connectToMongo()

const app = express()
const port = 3010

// JSON Parsing 

app.use(express.json())


//Available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


// app.get('/', (req, res) => {
//   res.send('Hello Abhinav!')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})