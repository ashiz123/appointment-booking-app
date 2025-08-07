const express = require('express')
const mongoose = require('mongoose');
const app = express()
const port = 3000

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://mongodb:27017/mydb');


app.get('/', (req, res) => {
  res.send('start project now')
})

app.get('/testing', (req, res) => {
  res.send('testing page');
})





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
