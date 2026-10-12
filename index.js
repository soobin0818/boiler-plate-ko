const express = require('express');
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://bin9929_db_user:5sEMdScA9hRUZQ9E@ssu.4rgkxqw.mongodb.net/?appName=ssu').then(() => console.log('MonogoDB Connected...'))
.catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})