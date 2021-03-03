const express = require('express')
const path = require('path')

require(path.join(process.cwd(), '/src/db/mongoose'))
//require('./db/mongoose')

//const userRoute = require('./routes/user')
//const productRoute = require('./routes/product')

const userRoute = require(path.join(process.cwd(), '/src/routes/user'))
const productRoute = require(path.join(process.cwd(), '/src/routes/product'))
const contractRoute = require(path.join(process.cwd(), '/src/routes/contract'))

const app = express();
const port = process.env.PORT || 5000
const viewPath = __dirname + '\\templates\\views'

app.use(express.json())

app.set('view engine', 'hbs')
app.set('views', viewPath)

app.use(express.static(__dirname + '\\public'))

app.use(userRoute)
app.use(productRoute)
app.use(contractRoute)




app.listen(port, () => {
    console.log('Server is up on port ' + port)

})