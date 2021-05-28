const express = require('express')
const router = require('./routes/router')
const PORT = process.env.PORT || 4001

const app = express()
app.use('/calculate',router)

app.listen(PORT, () => console.log(`Calc server up on ${PORT}`))