const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.use((req, res) => res.sendStatus(404))

app.listen(port, () => console.log(`Listening on port ${port}`))
